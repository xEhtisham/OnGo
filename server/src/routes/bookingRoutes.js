import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getEventBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Attendee booking actions
router.post('/', protect, createBooking);
router.get('/my-tickets', protect, getMyBookings);
router.get('/event/:eventId', protect, getEventBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
