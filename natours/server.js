const mongoose = require("mongoose");
const dotenv = require("dotenv");

// If I wanted to switch to production environment i cant use it with npm command rather i have to manually ajust the config.env file and put it there.
// console.log(process.env.NODE_ENV);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception. Shutting down...");
  console.log(err);
  console.log(err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection Successful");
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log("Unhandled Rejection. Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
