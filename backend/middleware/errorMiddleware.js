const errorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err.message);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };

