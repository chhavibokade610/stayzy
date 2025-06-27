const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//use to connect to the Stayzy database in Mongo db
const MONGO_URL = "mongodb://127.0.0.1:27017/stayzy";
main()
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//let us initialise the database
const initDB = async () => {
  // using deleteMany() function we remove the data present in the database and add fresh data
  await Listing.deleteMany({});

  // .map() creates a new array by transforming each element of the original array.
  //  syntax: const newArray = oldArray.map((element, index, array) => {
  //  // return transformed element });

  initData.data = initData.data.map((obj) => ({
    ...obj, // ...obj copies all key-value pairs from obj into a new object
    owner: "685c067c86eabd3687737652",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
