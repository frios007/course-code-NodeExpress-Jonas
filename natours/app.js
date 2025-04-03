const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");
const unknownRouteHandler = require("./controllers/errorController.js");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//MIDDELWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", unknownRouteHandler);

app.use(globalErrorHandler);

module.exports = app;
