const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User model

const User = require("../models/Users");

// login page
router.get("/login", (req, res) => res.render("Login"));

// Register page
router.get("/register", (req, res) => res.render("Register"));

// Register handle
router.post("/register", (req, res) => {
  const {
    name,
    email,
    password,
    password2,
    productName,
    productType,
    state,
    city,
    zip,
    productDescription,
    contact,
  } = req.body;
  let errors = [];

  // Check require fields
  if (
    !name ||
    !email ||
    !password ||
    !password2 ||
    !productName ||
    !productType ||
    !state ||
    !city ||
    !zip ||
    !productDescription ||
    !contact
  ) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check Password Match
  if (password != password2) {
    errors.push({ msg: "Password do not match" });
  }

  // Check Password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      productName,
      productType,
      state,
      city,
      zip,
      productDescription,
      contact,
    });
  } else {
    // Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // user exists
        errors.push({ msg: "Email is already registerd" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
          productName,
          productType,
          state,
          city,
          zip,
          productDescription,
          contact,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          productName,
          productType,
          state,
          city,
          zip,
          productDescription,
          contact,
        });

        //   Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //    set password to hash
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => cpnsole.log(err));
          })
        );
      }
    });
  }
});
//  Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/buyers", (req, res) => {
  User.find();
  res.render("buyers");
});

module.exports = router;
