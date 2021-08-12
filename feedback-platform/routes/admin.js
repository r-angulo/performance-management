const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //used to encrypt passwords
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const User = require("../models/User");
const Employee = require("../models/Employee");
const toTitleCase = require("../utils/inputCleaning");
const mongoose = require("mongoose");
const { body, validationResult, oneOf } = require("express-validator");
const { check } = require("express-validator");

// @route  GET api/admin/test
// @desc   TESTS get route for admin
// @access Public
router.get("/test", (req, res) => res.json({ msg: "admin access works" })); //its going to output json

// @route  POST api/admin/registerEmployee
// @desc   TESTS get route for admin
// @access Public
router.post(
  "/registerEmployee",
  [
    check("firstName")
      .trim()
      .escape()
      .isLength({ min: 3, max: 32 })
      .withMessage("First Name must be between 3 and 32 characters.")
      .isAlpha()
      .withMessage("First Name must contain letters only")
      .not()
      .isEmpty()
      .withMessage("First Name is required"),
    check("lastName")
      .trim()
      .escape()
      .isLength({ min: 3, max: 32 })
      .withMessage("Last Name must be between 3 and 32 characters.")
      .isAlpha()
      .withMessage("Last Name must contain letters only")
      .not()
      .isEmpty()
      .withMessage("Last Name is required"),
    check("email")
      .isEmail()
      .withMessage("Must be an Email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address is already registered!");
          }
        });
      })
      .normalizeEmail()
      .trim(),
    check("password")
      .trim()
      .isLength({ min: 6, max: 32 })
      .withMessage("Password must be between 6 and 32 characters")
      .custom((value) => !/\s/.test(value))
      .withMessage("No spaces are allowed in the password")
      .not()
      .isEmpty()
      .withMessage("Password is required"),
  ],
  (req, res) =>
    User.findOne({ email: req.body.email }).then((user) => {
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
      let levels = [];

      levels.push("employee");

      if (req.body.manager == true) {
        levels.push("manager");
      }
      if (req.body.admin == true) {
        levels.push("admin");
      }
      const newUser = new User({
        firstName: toTitleCase(req.body.firstName),
        lastName: toTitleCase(req.body.lastName),
        email: req.body.email,
        password: req.body.password,
        levels: levels,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              //TODO: do for other types and
              //WHAT ABOUT WHEN YOU EDIT AND ADD OR DELETE THIs position type
              if (req.body.employee == "true") {
                const newEmployee = new Employee({
                  user: user._id,
                });
                //TODO: do a fail for this, doesnt need to do then()
                newEmployee.save();
              }
              return res.json({ status: "success" });
            })
            .catch((err) => console.log(err));
        });
      });
      // }
    })
); //its going to output json

router.post("/registerManyEmployees", (req, res) => {
  console.log(req.body.newEmployeesArray);
});

//GET LIST OF ALL EMPLOYEES and their levels
router.get(
  "/allemployees",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .then((users) => {
        const numUsers = users.length;
        let returnArray = [];
        users.forEach((user, index) => {
          let returnObject = {
            _id: user._id,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            levels: user.levels,
          };
          returnArray.push(returnObject);
          if (index == numUsers - 1) {
            res.json(returnArray);
          }
        });
      })
      .catch((err) => {
        res.status(400).json({ failure: "Could not fetch all employees" });
      });
  }
);

router.get(
  "/employeedata/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params.id);
    User.findById(req.params.id)
      .then((userData) => {
        const returnObj = {
          levels: userData.levels,
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        };

        res.json(returnObj);
      })
      .catch((err) =>
        res.status(400).json({ error: "Employee not found in database" })
      );
  }
);

//update everything but user
router.post(
  "/updateemployee/:id",
  passport.authenticate("jwt", { session: false }),
  [
    check("firstName")
      .trim()
      .escape()
      .isLength({ min: 3, max: 32 })
      .withMessage("First Name must be between 3 and 32 characters.")
      .isAlpha()
      .withMessage("First Name must contain letters only")
      .not()
      .isEmpty()
      .withMessage("First Name is required"),
    check("lastName")
      .trim()
      .escape()
      .isLength({ min: 3, max: 32 })
      .withMessage("Last Name must be between 3 and 32 characters.")
      .isAlpha()
      .withMessage("Last Name must contain letters only")
      .not()
      .isEmpty()
      .withMessage("Last Name is required"),
    check("email")
      .isEmail()
      .withMessage("Must be an Email")
      .not()
      .isEmpty()
      .withMessage("Email is required")

      .normalizeEmail()
      .trim(),
  ],
  (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
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
        console.log("update employee line hit");
        console.log(req.body.firstName);
        console.log(req.body.lastName);
        let levels = [];

        levels.push("employee");
        if (req.body.manager == true) {
          levels.push("manager");
        }
        if (req.body.admin == true) {
          levels.push("admin");
        }

        user.firstName = toTitleCase(req.body.firstName);
        user.lastName = toTitleCase(req.body.lastName);
        user.email = req.body.email;
        user.levels = levels;

        user
          .save()
          .then(res.json({ success: true }))
          .catch(() => {
            res.status(400).json({ failure: "could not update employee data" });
          });
      })
      .catch(() => {
        res.status(404).json({ error: "could not find employee to update" });
      });
  }
);

//returns a list of managers and their ids
router.get(
  "/allmanagers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({ levels: { $in: ["manager"] } })
      .then((users) => {
        let responseArray = users.map((user) => {
          return {
            id: user._id,
            fullName: user.firstName + " " + user.lastName,
            email: user.email,
          };
        });
        res.json(responseArray);
      })
      .catch((err) =>
        res
          .status(400)
          .json({ error: "error occured while fetching managers: " + err })
      );
  }
);

//adds a list of employees
//TODO: thhis is slow bc it ads all at once
router.post(
  "/subordinates/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        //check if managere
        //add this to model
        if (!user.levels.includes("manager")) {
          res.status(400).json({ error: "This user is not a manager" });
        }
        user.subordinates = req.body.subordinatesIDs.map((id) =>
          mongoose.Types.ObjectId(id)
        );
        console.log(req.body.subordinatesIDs);
        // user.subordinates = [
        //   mongoose.Types.ObjectId("5eec492ffa8a582a2823f8dd"),
        //   mongoose.Types.ObjectId("5eec4938fa8a582a2823f8df"),
        // ];

        user
          .save()
          .then(() => res.json({ success: "Added subordinates successfully" }))
          .catch((err) =>
            res
              .status(400)
              .json({ error: "error occured while adding subordinates" })
          );
      })
      .catch((err) =>
        res
          .status(400)
          .json({ error: "error occured while adding subordinates" + err })
      );
  }
);

//returns object. contains id list of subordinates, and id list of non employee subordinates
router.get(
  "/subordinates/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id)
      .populate({ path: "subordinates" })
      .then((manager) => {
        let nonInList = manager.subordinates.map((obj) => obj); //creates deep copy to avoid adding manager to list when push below
        nonInList.push(mongoose.Types.ObjectId(req.params.id));
        User.find({ _id: { $nin: nonInList } })
          .then((others) => {
            let subordinates = manager.subordinates.map((employee) => {
              return {
                id: employee._id,
                fullName: `${employee.firstName} ${employee.lastName}`,
                email: employee.email,
              };
            });

            let nonSubordinates = others.map((employee) => {
              return {
                id: employee._id,
                fullName: `${employee.firstName} ${employee.lastName}`,
                email: employee.email,
              };
            });
            res.json({
              managerName: `${manager.firstName} ${manager.lastName}`,
              subordinates: subordinates,
              nonSubordinates: nonSubordinates,
            });
          })
          .catch((err) =>
            res.status(400).json({
              error: "error occured while looking for non subordinates" + err,
            })
          );
      })
      .catch((err) =>
        res.status(400).json({ error: "failed to find manager" + err })
      );
  }
);
//delete a user,also delete their projects and ask admin if they want to delete their feedback too
// router.delete("");
module.exports = router;

//1. Project setup name
//2. employees
//3. measure
//4. score weights
//5. settings
