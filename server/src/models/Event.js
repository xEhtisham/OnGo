import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ticket name is required'],
      trim: true,
      maxlength: [50, 'Ticket name cannot exceed 50 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price in PKR is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Ticket quantity/capacity is required'],
      min: [1, 'Capacity must be at least 1 ticket'],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, 'Sold count cannot be negative'],
    },
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Event title must be at least 3 characters'],
      maxlength: [120, 'Event title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: {
        values: [
          'Music',
          'Sports',
          'Food & Drink',
          'Arts & Culture',
          'Business',
          'Education',
          'Technology',
          'Other',
        ],
        message: '{VALUE} is not a supported event category',
      },
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    coverImage: {
      type: String,
      required: [true, 'Event cover image is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    venueName: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    ticketTypes: {
      type: [ticketTypeSchema],
      validate: {
        validator: function (types) {
          return Array.isArray(types) && types.length > 0;
        },
        message: 'At least one ticket type must be provided',
      },
    },
    totalCapacity: {
      type: Number,
      min: [1, 'Total capacity must be at least 1'],
    },
    bookingStatus: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Sold Out', 'Ended'],
      default: 'Draft',
    },
    maxTicketsPerBooking: {
      type: Number,
      default: 5,
      min: [1, 'Max tickets per booking must be at least 1'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer user reference is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically calculate total capacity before validation and saving
eventSchema.pre('validate', function () {
  if (Array.isArray(this.ticketTypes) && this.ticketTypes.length > 0) {
    this.totalCapacity = this.ticketTypes.reduce(
      (sum, ticket) => sum + (Number(ticket.capacity) || 0),
      0
    );
  }
});

// Compound indexes for fast organizer dashboard queries & discovery filtering
eventSchema.index({ organizer: 1, status: 1 });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ city: 1, category: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
