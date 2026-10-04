import mongoose from 'mongoose';

/**
 * Generates an uppercase, human-readable booking reference code (e.g. OG-7K9A-4M2P)
 */
export function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excludes confusing characters (0, O, 1, I)
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OG-${part1}-${part2}`;
}

const bookedTicketItemSchema = new mongoose.Schema(
  {
    ticketTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Ticket type reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Ticket tier name is required'],
      trim: true,
      maxlength: [50, 'Ticket tier name cannot exceed 50 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price in PKR is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1 ticket'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: true }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: [true, 'Booking reference is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Attendee user reference is required'],
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
      index: true,
    },
    tickets: {
      type: [bookedTicketItemSchema],
      required: [true, 'At least one ticket must be selected'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'A booking must contain at least one ticket item',
      },
    },
    totalTickets: {
      type: Number,
      required: [true, 'Total tickets count is required'],
      min: [1, 'Total tickets must be at least 1'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount in PKR is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    attendeeDetails: {
      fullName: {
        type: String,
        required: [true, 'Attendee full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters long'],
        maxlength: [70, 'Full name cannot exceed 70 characters'],
      },
      email: {
        type: String,
        required: [true, 'Attendee email address is required'],
        lowercase: true,
        trim: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Please provide a valid email address',
        ],
      },
      phone: {
        type: String,
        trim: true,
        default: '',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['Confirmed', 'Cancelled'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'Confirmed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Completed', 'Pending', 'Free', 'Refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'Completed',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
      maxlength: [250, 'Cancellation reason cannot exceed 250 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validation hook: auto-generate bookingReference and calculate totals if missing
bookingSchema.pre('validate', function () {
  if (!this.bookingReference) {
    this.bookingReference = generateBookingReference();
  }

  if (Array.isArray(this.tickets) && this.tickets.length > 0) {
    let computedCount = 0;
    let computedAmount = 0;

    this.tickets.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      item.subtotal = qty * price;
      computedCount += qty;
      computedAmount += item.subtotal;
    });

    if (!this.totalTickets) {
      this.totalTickets = computedCount;
    }
    if (this.totalAmount === undefined || this.totalAmount === null) {
      this.totalAmount = computedAmount;
    }
  }
});

// Compound indexes for optimal attendee & organizer querying
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1, createdAt: -1 });
bookingSchema.index({ event: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
