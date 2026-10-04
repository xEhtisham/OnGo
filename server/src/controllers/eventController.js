import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

// @desc    Create a new event (Draft or Published)
// @route   POST /api/events
// @access  Private (Organizer)
export async function createEvent(req, res, next) {
  try {
    const {
      title,
      category,
      description,
      coverImage,
      date,
      startTime,
      endTime,
      venueName,
      streetAddress,
      city,
      ticketTypes,
      bookingStatus,
      status,
      maxTicketsPerBooking,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !category ||
      !description ||
      !coverImage ||
      !date ||
      !startTime ||
      !endTime ||
      !venueName ||
      !streetAddress ||
      !city ||
      !Array.isArray(ticketTypes) ||
      ticketTypes.length === 0
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required event details and at least one ticket type',
      });
    }

    // Format ticket types
    const sanitizedTicketTypes = ticketTypes.map((ticket) => ({
      name: ticket.name?.trim(),
      price: Number(ticket.price) >= 0 ? Number(ticket.price) : 0,
      capacity: Number(ticket.capacity) >= 1 ? Number(ticket.capacity) : 1,
      sold: 0,
    }));

    const event = await Event.create({
      title: title.trim(),
      category,
      description: description.trim(),
      coverImage,
      date: new Date(date),
      startTime,
      endTime,
      venueName: venueName.trim(),
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      ticketTypes: sanitizedTicketTypes,
      bookingStatus: bookingStatus || 'Open',
      status: status || 'Draft',
      maxTicketsPerBooking: Number(maxTicketsPerBooking) || 5,
      organizer: req.user._id,
    });

    return res.status(201).json({
      status: 'success',
      message: `Event successfully ${event.status === 'Published' ? 'published' : 'saved as draft'}`,
      data: { event },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get published events for public discovery (with search, category, city, date & pagination)
// @route   GET /api/events
// @access  Public
export async function getPublicEvents(req, res, next) {
  try {
    const {
      search,
      category,
      city,
      timeframe,
      date,
      sort = 'date-asc',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      status: { $in: ['Published', 'Sold Out'] },
    };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // City filter (case-insensitive)
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Text search across title, description, venueName, and city
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venueName: searchRegex },
        { city: searchRegex },
      ];
    }

    // Date & Timeframe filters
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (date) {
      // Specific date filtering (YYYY-MM-DD)
      const targetDate = new Date(date);
      if (!isNaN(targetDate.getTime())) {
        const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const endOfDay = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate(),
          23,
          59,
          59,
          999
        );
        query.date = { $gte: startOfDay, $lte: endOfDay };
      }
    } else if (timeframe === 'today') {
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.date = { $gte: startOfToday, $lte: endOfToday };
    } else if (timeframe === 'this-weekend') {
      const dayOfWeek = now.getDay();
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
      const friday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilFriday);
      const sunday = new Date(friday.getFullYear(), friday.getMonth(), friday.getDate() + 2, 23, 59, 59, 999);
      query.date = { $gte: friday, $lte: sunday };
    } else if (timeframe === 'this-month') {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      query.date = { $gte: startOfToday, $lte: endOfMonth };
    } else if (timeframe !== 'all') {
      // Default: show upcoming events from today onwards
      query.date = { $gte: startOfToday };
    }

    // Sorting options
    let sortOption = { date: 1, startTime: 1 };
    if (sort === 'date-desc') {
      sortOption = { date: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      status: 'success',
      count: events.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get all events created by the logged-in organizer
// @route   GET /api/events/organizer
// @access  Private (Organizer)
export async function getOrganizerEvents(req, res, next) {
  try {
    const { status, search, category } = req.query;

    const query = { organizer: req.user._id };

    // Status filter (All, Published, Draft, Sold Out, Ended)
    if (status && status !== 'All') {
      // Normalize 'Drafts' query to 'Draft'
      const normalizedStatus = status === 'Drafts' ? 'Draft' : status;
      query.status = normalizedStatus;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter across title, venue, and city
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { venueName: searchRegex }, { city: searchRegex }];
    }

    const events = await Event.find(query).sort({ date: 1, createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      count: events.length,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get organizer dashboard overview metrics
// @route   GET /api/events/organizer/stats
// @access  Private (Organizer)
export async function getOrganizerStats(req, res, next) {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });

    const totalEvents = events.length;

    const now = new Date();
    const upcomingEventsList = events.filter(
      (e) => new Date(e.date) >= now && e.status === 'Published'
    );
    const upcomingEvents = upcomingEventsList.length;

    // Tickets sold across all organizer events
    const ticketsSold = events.reduce((total, event) => {
      const eventSold = event.ticketTypes.reduce(
        (sum, ticket) => sum + (Number(ticket.sold) || 0),
        0
      );
      return total + eventSold;
    }, 0);

    // Bookings count synchronized with live Booking collection
    const eventIds = events.map((e) => e._id);
    const totalBookings = await Booking.countDocuments({
      event: { $in: eventIds },
      status: 'Confirmed',
    });

    return res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalEvents,
          upcomingEvents,
          totalBookings,
          ticketsSold,
        },
        upcomingEvents: upcomingEventsList.slice(0, 4),
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single event by ID (Public)
// @route   GET /api/events/:id
// @access  Public
export async function getEventById(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email'
    );

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private (Organizer)
export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      });
    }

    // Ownership check: only the organizer who created the event can update it
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You are not authorized to edit this event',
      });
    }

    const {
      title,
      category,
      description,
      coverImage,
      date,
      startTime,
      endTime,
      venueName,
      streetAddress,
      city,
      ticketTypes,
      bookingStatus,
      status,
      maxTicketsPerBooking,
    } = req.body;

    if (title) event.title = title.trim();
    if (category) event.category = category;
    if (description) event.description = description.trim();
    if (coverImage) event.coverImage = coverImage;
    if (date) event.date = new Date(date);
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (venueName) event.venueName = venueName.trim();
    if (streetAddress) event.streetAddress = streetAddress.trim();
    if (city) event.city = city.trim();
    if (bookingStatus) event.bookingStatus = bookingStatus;
    if (status) event.status = status;
    if (maxTicketsPerBooking) event.maxTicketsPerBooking = Number(maxTicketsPerBooking);

    if (Array.isArray(ticketTypes) && ticketTypes.length > 0) {
      event.ticketTypes = ticketTypes.map((ticket) => ({
        _id: ticket._id,
        name: ticket.name?.trim(),
        price: Number(ticket.price) >= 0 ? Number(ticket.price) : 0,
        capacity: Number(ticket.capacity) >= 1 ? Number(ticket.capacity) : 1,
        sold: Number(ticket.sold) || 0,
      }));
    }

    await event.save();

    return res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer)
export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);

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
        message: 'Forbidden: You are not authorized to delete this event',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
