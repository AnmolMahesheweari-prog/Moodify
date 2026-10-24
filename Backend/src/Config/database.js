const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected..");
}

module.exports = connectToDb;
