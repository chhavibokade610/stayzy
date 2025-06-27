const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  //in this schema we don't have to define username and password field because password package auto matically defines it
});

userSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model("User", userSchema);
