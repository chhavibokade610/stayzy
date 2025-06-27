const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../conrollers/users.js");

router
  .route("/signup")
  //signup form
  .get(userController.renderSignupForm)
  //signup route
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  //to authenticate user that menas to check whether the given user exist in the database we use passport.authenticate method
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//to logout we will make use of req.logout(callback()) method of passport middleware
router.get("/logout", userController.logout);

module.exports = router;

// //signup form
// router.get("/signup", userController.renderSignupForm);

// //signup route
// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login", userController.renderLoginForm);

// //to authenticate user that menas to check whether the given user exist in the database we use passport.authenticate method
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );
