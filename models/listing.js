// we will define all the schema in this file and then export this in app.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// defining listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//defining listing model
const Listing = mongoose.model("Listing", listingSchema);

// exporting listing model using modules.export
module.exports = Listing;

// an alternative for image
// image: {
//     type: String,
//     //also setting if the there is no image
//     default:
//       "https://images.unsplash.com/photo-1749493662929-c95b3be5d995?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     set: (v) =>
//       v === ""
//         ? "https://images.unsplash.com/photo-1749493662929-c95b3be5d995?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         : v, // it is used to set a default image if user does not set an image then this will be displayed ; set: is a method in mongoose
//   },
