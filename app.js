if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // to display popup messages like created, updated, deleted
const passport = require("passport"); // to use passport middleware to authenticate
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); // to use User Schema define for authentication

const listingRouter = require("./routes/listing.js"); // restructuring listings routes
const reviewRouter = require("./routes/reviews.js"); // restructuring reviews routes
const userRouter = require("./routes/user.js");

//use to connect to the Stayzy database in Mongo db
// const MONGO_URL = "mongodb://127.0.0.1:27017/stayzy";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //to run ejs file from any server
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //to use method otherthan get and post for example put, patch, delete, etc
app.engine("ejs", ejsMate); //to use header or footer like code on all files without writing many times
app.use(express.static(path.join(__dirname, "public"))); //to serve static files such as style.css and all

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET, // Used to sign the session ID cookie
  resave: false, // Prevents saving unchanged sessions
  saveUninitialized: true, // Avoids saving empty sessions
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires after & days from today
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// //creating a basic api to check the connection
// app.get("/", (req, res) => {
//   // res.send is used to display text on the web browser for example hii i am root will be displayed on the web browser
//   res.send("Hii I am root!!");
// });

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize()); //Without this, Passport's login/logout/authenticate won't work.
app.use(passport.session()); //Without this, user would have to log in again on every new request.

//to use authenticate method of model (i.e. userSchema) in LocalStrategy ; passport configuration
// it is basically Without this, you’d have to manually write login logic.
passport.use(new LocalStrategy(User.authenticate()));

//Defines how user data is stored in session: Typically only stores user ID to keep session lightweight.
passport.serializeUser(User.serializeUser());

//Tells Passport how to retrieve full user details using the ID stored in session.
passport.deserializeUser(User.deserializeUser());

//popup messages for created, updated, deleted, error
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//below error handling is for the request doesn't exist ot doesn't matches with anyone of the above request
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
  //res.status(status).send(message);
  // res.send("Something went wrong!");
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

// //creating test page
// app.get("/testListing", async (req, res) => {
//   const sampleListing  = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 3000,
//     location: "Keewaydin Island, Florida",
//     country: "USA",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successful testing");
// });

// //let us create a demo user for authentication
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "cooky@gmail.com",
//     username: "Cooky97"
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld"); //.register(user, password, callback) simplifies user creation with hashed passwords
//   res.send(registeredUser);
// });
