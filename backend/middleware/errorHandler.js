import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl,
    },
    err.message
  );

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
