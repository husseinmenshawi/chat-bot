let mongoose = require("mongoose");

const mongoDbString =
  process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017/respondio";

let mongoConnection;
function constructConnection() {
  try {
    mongoConnection = mongoose.createConnection(mongoDbString);
    console.log(`Mongo DB connection successful`);
  } catch (e) {
    console.error(`Mongo DB connection error`);
  }
}

constructConnection();

module.exports = {
  mongoConnection,
};
