const mongoose = require("mongoose");
const initData = require("./data");
const list = require("../models/Listing");
require("dotenv").config();
const Join = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Database is connected");
};
Join();

const initDb = async () => {
  await list.deleteMany({});
  initData.data=initData.data.map((obj) => ({
    ...obj,
    owner: "681071dad8cb5509ab9bbd25",
  }));
  await list.insertMany(initData.data);
  console.log("Data initialized");
};
initDb();
