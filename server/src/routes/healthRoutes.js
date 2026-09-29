import express from 'express';

const router = express.Router();

// GET /api/health - Backend health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'OnGo API is running',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

export default router;
