import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

// @desc    Create a new booking and reserve tickets
// @route   POST /api/bookings
// @access  Private (Attendee)
export async function createBooking(req, res, next) {
  try {
    const { eventId, tickets, attendeeDetails } = req.body;

    // 1. Basic validation
    if (!eventId) {
      return res.status(400).json({
        status: 'error',
        message: 'Event ID is required',
      });
    }

    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one ticket tier must be selected',
      });
    }

    if (!attendeeDetails?.fullName?.trim() || !attendeeDetails?.email?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide attendee full name and email address',
      });
    }

    // 2. Fetch and validate event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      });
    }

    if (event.status !== 'Published') {
      return res.status(400).json({
        status: 'error',
        message: `This event is currently not available for bookings (Status: ${event.status})`,
      });
    }

    if (event.bookingStatus !== 'Open') {
      return res.status(400).json({
        status: 'error',
        message: 'Ticket reservations are currently closed for this event',
      });
    }

    // 3. Validate booking limit
    const totalRequested = tickets.reduce(
      (sum, item) => sum + (parseInt(item.quantity, 10) || 0),
      0
    );

    if (totalRequested <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please select at least 1 ticket to book',
      });
    }

    const maxAllowed = event.maxTicketsPerBooking || 5;
    if (totalRequested > maxAllowed) {
      return res.status(400).json({
        status: 'error',
        message: `You cannot book more than ${maxAllowed} tickets in a single reservation`,
      });
    }

    // 4. Validate tier availability and prepare sanitized booking tickets
    const sanitizedTickets = [];

    for (const item of tickets) {
      const qty = parseInt(item.quantity, 10) || 0;
      if (qty <= 0) continue;

      const tier = event.ticketTypes.find(
        (t) => t._id.toString() === item.ticketTypeId?.toString()
      );

      if (!tier) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid ticket tier selected',
        });
      }

      const remainingCapacity = tier.capacity - (tier.sold || 0);
      if (qty > remainingCapacity) {
        return res.status(400).json({
          status: 'error',
          message: `Not enough tickets remaining for "${tier.name}". Only ${remainingCapacity} left.`,
        });
      }

      // Increment sold count
      tier.sold = (tier.sold || 0) + qty;

      sanitizedTickets.push({
        ticketTypeId: tier._id,
        name: tier.name,
        price: tier.price,
        quantity: qty,
        subtotal: tier.price * qty,
      });
    }

    if (sanitizedTickets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid tickets selected',
      });
    }

    // Check if event is now sold out across all tiers
    const isSoldOut = event.ticketTypes.every((t) => (t.sold || 0) >= t.capacity);
    if (isSoldOut) {
      event.status = 'Sold Out';
    }

    // Persist event inventory changes
    await event.save();

    // 5. Create Booking record
    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      tickets: sanitizedTickets,
      attendeeDetails: {
        fullName: attendeeDetails.fullName.trim(),
        email: attendeeDetails.email.trim().toLowerCase(),
        phone: attendeeDetails.phone?.trim() || '',
      },
      status: 'Confirmed',
      paymentStatus: 'Completed',
    });

    // Populate event details for the client confirmation
    await booking.populate([
      {
        path: 'event',
        select: 'title coverImage date startTime endTime venueName streetAddress city category',
      },
      {
        path: 'user',
        select: 'name email',
      },
    ]);

    return res.status(201).json({
      status: 'success',
      message: 'Booking confirmed successfully!',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get all bookings for the logged-in attendee
// @route   GET /api/bookings/my-tickets
// @access  Private (Attendee)
export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        select:
          'title coverImage date startTime endTime venueName streetAddress city category status organizer',
        populate: {
          path: 'organizer',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Attendee or Event Organizer)
export async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found',
      });
    }

    // Authorization: User must be either the attendee OR the event organizer
    const isAttendee = booking.user._id.toString() === req.user._id.toString();
    const isOrganizer =
      booking.event?.organizer?.toString() === req.user._id.toString();

    if (!isAttendee && !isOrganizer) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You are not authorized to view this booking',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get attendee bookings for a specific organizer's event
// @route   GET /api/bookings/event/:eventId
// @access  Private (Organizer)
export async function getEventBookings(req, res, next) {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      });
    }

    // Ownership check
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You are not authorized to view bookings for this event',
      });
    }

    const bookings = await Booking.find({ event: event._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Cancel a booking and release ticket inventory
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Attendee or Organizer)
export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found',
      });
    }

    const isAttendee = booking.user.toString() === req.user._id.toString();
    const isOrganizer =
      booking.event?.organizer?.toString() === req.user._id.toString();

    if (!isAttendee && !isOrganizer) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You are not authorized to cancel this booking',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'This booking is already cancelled',
      });
    }

    // Release ticket capacity back to the event
    const event = await Event.findById(booking.event._id);
    if (event) {
      for (const item of booking.tickets) {
        const tier = event.ticketTypes.find(
          (t) => t._id.toString() === item.ticketTypeId.toString()
        );
        if (tier) {
          tier.sold = Math.max(0, (tier.sold || 0) - item.quantity);
        }
      }

      // If event was Sold Out, reopen status to Published
      if (event.status === 'Sold Out') {
        event.status = 'Published';
      }

      await event.save();
    }

    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason?.trim() || 'Cancelled by user';
    await booking.save();

    return res.status(200).json({
      status: 'success',
      message: 'Booking cancelled and ticket capacity released',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
}
