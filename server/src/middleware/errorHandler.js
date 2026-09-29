// 404 Not Found Middleware
export function notFoundHandler(req, res, next) {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Centralized Error Handling Middleware
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
