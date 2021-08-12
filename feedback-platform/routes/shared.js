//login and create new score should go here
const express = require("express");
const User = require("../models/User");
const Measure = require("../models/Measures");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const { route } = require("./admin");
const { body, validationResult, oneOf } = require("express-validator");
const { check } = require("express-validator");
const toTitleCase = require("../utils/inputCleaning");

// @route  GET api/shared/test
// @desc   TESTS get route for admin
// @access Public
router.get("/test", (req, res) => res.json({ msg: "shared access works" })); //its going to output json

// @route  POST api/shared/login
// @desc   for logging in
// @access Public
router.post(
  "/login",
  [
    check("email")
      .normalizeEmail()
      .trim()
      .isEmail()
      .withMessage("Must be an Email")
      .not()
      .isEmpty()
      .withMessage("Email is required"),
    check("accountLevel").isIn(["employee", "manager", "admin"]),
  ],
  (req, res) => {
    let errors = {};
    if (!validationResult(req).isEmpty()) {
      let extractedErrors = [];
      validationResult(req)
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));
      console.log(validationResult(req));
      extractedErrors.forEach((field) => {
        errors[Object.keys(field)[0]] = field[[Object.keys(field)[0]]];
      });
      return res.status(422).json({
        errors: errors,
      });
    }
    const email = req.body.email;
    const password = req.body.password;
    const accountLevel = req.body.accountLevel;
    console.log("recevied request");
    console.log(email);
    User.findOne({ email }).then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).json({ error: email + " is not registered" });
      }
      //check has this level of access of account type
      console.log(user.levels);
      console.log("requested level: " + accountLevel);
      if (!user.levels.includes(accountLevel)) {
        errors.accountLevel =
          email + " is not registered as an " + accountLevel;
        return res.status(403).json({ errors: errors });
      }
      //if user exist
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            currentAccountLevel: accountLevel,
            accountLevels: user.levels,
          };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 604800 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          errors.password = "Incorrect Password";
          return res.status(401).json({ errors: errors });
        }
      });
    });
  }
);

// @route  POST api/shared/createmeasure
// @desc   for logging in
// @access Private
router.post(
  "/createmeasure",
  passport.authenticate("jwt", { session: false }),
  [
    check("name")
      .trim()
      .escape()
      .isLength({ min: 3, max: 64 })
      .withMessage("Measure name must be within 3 to 64 characters")
      .not()
      .isEmpty()
      .withMessage("Measure name is required")
      .custom((value, { req }) => {
        return Measure.findOne({ name: toTitleCase(value) }).then((doc) => {
          if (doc) {
            return Promise.reject("Measure already exists!");
          }
        });
      }),
    check("description")
      .trim()
      .escape()
      .isLength({ min: 3, max: 500 })
      .withMessage("Description must be between 3 and 500 characters.")
      .not()
      .isEmpty()
      .withMessage("Description is required"),
  ],
  (req, res) => {
    //TODO: CHECK if fields not empty
    //TODO: sanitize string and make lowercase
    //TODO: make sure employee or admin
    const { name, description } = req.body;

    let errors = {};
    if (!validationResult(req).isEmpty()) {
      let extractedErrors = [];
      validationResult(req)
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));
      console.log(validationResult(req));
      extractedErrors.forEach((field) => {
        errors[Object.keys(field)[0]] = field[[Object.keys(field)[0]]];
      });
      return res.status(400).json(errors);
    }
    const newMeasure = new Measure({
      name: toTitleCase(name),
      description: description,
    });

    //todo: add catch here, using errors
    newMeasure.save().then((measure) => res.json(measure));
  }
);

//GET LIST OF ALL measures
router.get(
  "/allmeasures",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Measure.find()
      .then((measures) => {
        res.json(measures);
      })
      .catch((err) => {
        res.status(400).json({ failure: "Could not fetch all measures" });
      });
  }
);

//if email exists GET levels
//else return email does not exist
router.get(
  "/emailexists",
  [
    check("email")
      .normalizeEmail()
      .trim()
      .isEmail()
      .withMessage("Must be an Email")
      .not()
      .isEmpty()
      .withMessage("Email is required"),
  ],
  (req, res) => {
    let errors = {};
    if (!validationResult(req).isEmpty()) {
      let extractedErrors = [];
      validationResult(req)
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));
      console.log(validationResult(req));
      extractedErrors.forEach((field) => {
        errors[Object.keys(field)[0]] = field[[Object.keys(field)[0]]];
      });
      return res.status(422).json(errors);
    }

    User.findOne({ email: req.query.email }, (err, user) => {
      if (err) {
        console.log("error: " + err);
      }
      if (!user) {
        console.log("no user found with that email");
        errors.email = `${req.query.email} is not a registered email`;

        res.status(401).json(errors);
      } else {
        console.log("email exists");
        res.json({ levels: user.levels });
      }
    });
  }
);

module.exports = router;
