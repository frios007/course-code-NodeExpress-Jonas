const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 😢🙏", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong...",
    });
  }
};

const handleJwtError = () =>
  new AppError("Invalid token. Please login again", 401);

const handleJwtExpired = () =>
  new AppError("Your token has expired, please log in again.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "JsonWebTokenError") error = handleJwtError();
    if (error.name === "TokenExpiredError") error = handleJwtExpired();
    sendErrorProd(error, res);
  }
};

exports.unknownRouteHandler = (req, _, next) => {
  next(new AppError(`Can not find ${req.originalUrl} in the server`, 404));
};
