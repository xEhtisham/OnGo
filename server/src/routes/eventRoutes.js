import express from 'express';
import {
  createEvent,
  getOrganizerEvents,
  getOrganizerStats,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Organizer specific routes (must be before /:id)
router.get('/organizer', protect, getOrganizerEvents);
router.get('/organizer/stats', protect, getOrganizerStats);

// General event CRUD
router.post('/', protect, createEvent);
router.get('/:id', getEventById);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
