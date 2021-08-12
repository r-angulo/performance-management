//check if user has not already created project with this name
//on submit appear it to employees
//mark as completed project
//store current working project on session ???
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //used to encrypt passwords
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const User = require("../models/User");
const Project = require("../models/Project");
const Employee = require("../models/Employee");
const Measure = require("../models/Measures");
const mongoose = require("mongoose");
const { reset } = require("nodemon");
const { body, validationResult, oneOf } = require("express-validator");
const { check } = require("express-validator");

router.post(
  "/project/create/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newProject = new Project({
      manager: req.params.id,
      name: "",
      description: "",
    });
    newProject.save().then((project) => {
      console.log("cuurpojrct", project._id);
      //TODO: on client side do this
      // sessionStorage.setItem("currentWorkingProjectID", project._id);
      res.json({ id: project._id });
    });
  }
);
router.delete(
  "/project/delete/:projectID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findOneAndRemove({ _id: req.params.projectID })
      .then(() => {
        res.json({ status: "Success" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ status: "Failed" });
      });
  }
);
// @route  POST api/manager/project/name
// @desc   create new project,just with name and store curr project in session
// @access Private
router.post(
  "/project/name",
  passport.authenticate("jwt", { session: false }),
  [
    check("name")
      .trim()
      .escape()
      .isLength({ min: 3, max: 64 })
      .withMessage("Project name must be within 3 to 64 characters")
      .not()
      .isEmpty()
      .withMessage("Project name is required"),

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
    Project.findById(req.body.projectID)
      .then((project) => {
        project.name = req.body.name;
        project.description = req.body.description;
        console.log(project);
        project
          .save()
          .then((project) => {
            res.json({ id: project._id });
          })
          .catch((err) => {
            res
              .status(400)
              .json({ errors: "failed to update employees for project" });
          });
      })
      .catch((err) => console.log(err));
    //TODO:
    //if project already exist throw back error

    //TODO: add current user as manager for the project, get it from the session
    // const newProject = new Project({
    //   name: req.body.name,
    //   description: req.body.description,
    //   manager: req.body.currUser,
    // });

    //TODO: encrypt current working project
    // newProject
    //   .save()
    //   .then((project) => {
    //     console.log("cuurpojrct", project._id);
    //     //TODO: on client side do this
    //     // sessionStorage.setItem("currentWorkingProjectID", project._id);
    //     res.json(project);
    //   })
    // .catch((err) => {
    //   errors.uploadFail = "failed to save to DB. Try again";
    //   res.status(400).json(errors);
    // });

    //store obj id in session
  }
);

//get the list of ids that manager added and add them to this project
//do all the adding on the server side
//INPUTS: object id of project being reffered to, and csv string of employees
router.post(
  "/project/employees",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //a csv string of employee object ids split into a js array
    // let employeesArray = req.body.employeesStringedList.split(",");
    // employeesArray = employeesArray.map((employeeID) =>
    //   mongoose.Types.ObjectId(employeeID)
    // );

    //change to above if error
    let employeesArray = req.body.employeesArray;

    const projectID = req.body.projectID;
    Project.findById(projectID)
      .then((project) => {
        project.employees = employeesArray;
        console.log(project);
        project
          .save()
          .then((project) => {
            res.json(project);
          })
          .catch((err) => {
            res
              .status(400)
              .json({ errors: "failed to update employees for project" });
          });
      })
      .catch((err) => {
        res.status(400).json({ error: "failed to find update project" });
      });
  }
);

//adding measures to the project
router.post(
  "/project/measures",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //a csv string of employee object ids split into a js array
    // let measuresArray = req.body.measuresStringedList.split(",");
    let measuresArray = req.body.measuresArray;

    //fix this mess
    const equalWeight = 1 / measuresArray.length;
    measuresArray = measuresArray.map(function (id) {
      return {
        measureID: mongoose.Types.ObjectId(id),
        weight: equalWeight * 100,
      };
    });

    const projectID = req.body.projectID;
    Project.findById(projectID)
      .then((project) => {
        project.measures = measuresArray;
        console.log(project);
        project
          .save()
          .then((project) => {
            res.json(project);
          })
          .catch((err) => {
            res
              .status(400)
              .json({ errors: "failed to update measures for project" });
          });
      })
      .catch((err) => {
        res.status(400).json({ error: "failed to find update project" });
      });
  }
);

//get the measures for project, to be used for fetching when updating weights
//input: project id
//output: json object with measures for a project
router.get(
  "/project/measures/:projectID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //TODO: check for empty project id
    //TODO: populate here, but still keep the ids to update them later
    console.log("Get project measures");
    console.log(req.params.projectID);
    Project.findById(req.params.projectID)
      .lean()
      .populate({ path: "measures.measureID" })
      .then((project) => {
        res.json(project.measures);
      })
      .catch((err) =>
        res
          .status(400)
          .json({ error: "Failed to get project measures from DB" })
      );
  }
);

//inputs: projectID,csv string of measureIDs, csv string of weights, of equal lengths
//output: updated project with weights
//summary: take the csv strings and map them to an new object and update the project
router.post(
  "/project/weights",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};
    //TODO: make sure weights add up to one
    let { measureIDsStringedList, measureWeights } = req.body;
    // measureIDsStringedList = measureIDsStringedList.split(",");
    // measureWeights = measureWeights.split(",");

    if (measureWeights.reduce((a, b) => a + b, 0) !== 100) {
      //exit this INNER unction if it goes in here
      errors.weights = "The weights do not add up to 100";
      return res.status(400).json(errors);
    }
    if (measureIDsStringedList.length !== measureWeights.length) {
      //exit this INNER unction if it goes in here
      errors.weights =
        "The number of measures does not match number of weights";
      return res.status(400).json(errors);
    }

    const newMeasureObj = measureIDsStringedList.map(function (id, i) {
      return {
        measureID: mongoose.Types.ObjectId(id),
        weight: measureWeights[i],
      };
    });

    Project.findById(req.body.projectID).then((project) => {
      project.measures = newMeasureObj;
      project
        .save()
        .then((proj) => res.json(proj))
        .catch((err) =>
          res.status(400).json({
            error: "failed to update project with new measure weights",
          })
        );
    });
  }
);

//TODO: add more settings and update them in thje moodle too
//inputs: projectID, booleans for isLive, canViewComments
//outputs: project with updated settings
router.post(
  "/project/settings",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const settingsObj = {
      isLive: req.body.isLive,
      canViewComments: req.body.canViewComments,
    };

    Project.findById(req.body.projectID)
      .then((project) => {
        project.settings = settingsObj;
        project
          .save()
          .then((proj) => res.json(proj))
          .catch((err) =>
            res.json({ errors: "error updating settings to db" })
          );
      })
      .catch();
  }
);

//TODO: some how add this project id to the employees listed on it
// TODO: clean this up and make it so that everything is in ssteps and not async
///summary: makes project is save to true, add this id to prjects
//inputs: projectID
router.post(
  "/project/save",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.body.projectID)
      .then((proj) => {
        console.log("proj");
        console.log(proj.employees.length);
        proj.isPublished = true;
        //add this curruser to list of managers and to each manager add a list of projects they created
        for (let i = 0; i < proj.employees.length; i++) {
          const userID = proj.employees[i];
          console.log("userID");
          console.log(userID);
          console.log(typeof element);
          User.findById(userID)
            .then((user) => {
              console.log("user fetched obj:");
              console.log(user);
              let updated_participatedProjects = user.participatedProjects;
              updated_participatedProjects.push(
                mongoose.Types.ObjectId(req.body.projectID)
              );
              user.participatedProjects = updated_participatedProjects;
              user.save();
            })
            .catch((err) => console.log(err));
          if (i === proj.employees.length - 1) {
            proj
              .save()
              .then((p) => res.json(p))
              .catch((err) =>
                res.json({ error: "failed to save project, try again" })
              );
          }
        }
        // */
      })
      .catch((err) =>
        res.status(400).json({ error: "could not find project" })
      );
  }
);

//route api/mananager/projects/id
//return {_id:projectID, name: projName, completionRate: number}
router.get(
  "/projects/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.find({ manager: req.params.id })
      .then((projects) => {
        let responseArray = [];
        projects.forEach((project) => {
          let currentTotal = 0;
          project.feedback.forEach((oneFeedbackObj) => {
            currentTotal += oneFeedbackObj.responses.length;
          });
          let projectTotal =
            (project.employees.length * project.employees.length -
              project.employees.length) *
            project.measures.length;

          responseArray.push({
            name: project.name,
            _id: project._id,
            completion: currentTotal / projectTotal,
            isPublished: project.isPublished,
            isLive: project.settings.isLive,
          });
        });
        res.json(responseArray);
      })
      .catch((err) => res.status(400).json(err));
  }
);

//TODO: route get subordinates
//TODO: i dont think this is needed anymore, may be used in admin though for assigning relationships
router.get("/subordinates/:id", (req, res) => {
  User.findById(req.params.id)
    .populate({ path: "subordinates" })
    .then((user) => {
      //TODO: try with non managers to see if it crashes
      let subordinatesArray = user.subordinates.map((user) => {
        return {
          id: user._id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        };
      });
      res.json(subordinatesArray);
    })
    .catch((err) =>
      console.log("error occured while fetching employee subordinates")
    );
});

//get project name and description ofr an id
router.get("/project/nameAndDescription/:projectID", (req, res) => {
  Project.findById(req.params.projectID)
    .then((project) => {
      res.json({
        id: project.id,
        name: project.name,
        description: project.description,
      });
    })
    .catch((err) => res.status(400).json({ error: "failed to find employee" }));
});

//returns two list
//1. subordiante employees who have been added two this project
//2. the rest of subordinate employees who have not been added to this project
//TODO: get manager id from project populkate it
router.get("/project/employees/:projectID/", (req, res) => {
  Project.findById(req.params.projectID)
    .populate({ path: "employees" })
    .populate({ path: "manager", populate: { path: "subordinates" } })
    .then((project) => {
      let addedEmployees = project.employees;
      let subordinates = project.manager.subordinates;
      var nonAddedSubordinates = subordinates.filter(
        (o) => !addedEmployees.some((v) => v.equals(o))
      );
      addedEmployees = addedEmployees.map((user) => {
        return {
          id: user._id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        };
      });
      nonAddedSubordinates = nonAddedSubordinates.map((user) => {
        return {
          id: user._id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        };
      });

      res.json({
        addedEmployees: addedEmployees,
        nonAddedSubordinates: nonAddedSubordinates,
      });
      // res.json(project);
    })
    .catch((err) => res.status(400).json({ error: "failed to find employee" }));
});

//get two list
//a list of added measures
//a list of all other measures that have not been added
router.get("/project/addedAndNonAddedMeasures/:projectID/", (req, res) => {
  Project.findById(req.params.projectID)
    .populate({ path: "measures.measureID" })
    .then((project) => {
      let selectedMeasures = project.measures.map((measure) => {
        return {
          _id: measure.measureID._id,
          name: measure.measureID.name,
          description: measure.measureID.description,
        };
      });
      Measure.find({ _id: { $nin: selectedMeasures } })
        .then((nonSelectedMeasures) => {
          res.json({
            selectedMeasures: selectedMeasures,
            nonSelectedMeasures: nonSelectedMeasures,
          });
        })
        .catch((err) =>
          res
            .status(400)
            .json({ error: "Error occured while fetching measures:" + err })
        );
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Error occured while fetching measures: " + err })
    );
});

router.get("/project/settings/:projectID/", (req, res) => {
  Project.findById(req.params.projectID)
    .then((project) => {
      res.json(project.settings);
    })
    .catch((err) =>
      res.status(400).json("eror occured while fetching measures: " + err)
    );
});

router.delete("/project/:projectID", (req, res) => {
  Project.findByIdAndDelete(req.params.projectID, (err) => {
    if (err) {
      res.status(400).json({ error: "error occured while deleteing project" });
    } else {
      res.json({ success: "Deleted project successfully" });
    }
  });
});

router.get("/project-progress/:projectID", (req, res) => {
  Project.findById(req.params.projectID)
    .populate({ path: "employees" })
    .then((project) => {
      const totalResponsesPer =
        (project.employees.length - 1) * project.measures.length;
      let employeeProgress = project.employees.map((employee) => {
        return { employee: employee, progress: 0 };
      });
      project.feedback.forEach((feedbackObject) => {
        employeeProgress.forEach((obj, index) => {
          if (obj.employee.equals(feedbackObject.from)) {
            employeeProgress[index].progress +=
              feedbackObject.responses.length / totalResponsesPer;
          }
        });
      });

      employeeProgress = employeeProgress.map((obj) => {
        return {
          id: obj.employee._id,
          fullName: `${obj.employee.firstName} ${obj.employee.lastName}`,
          email: obj.employee.email,
          progress: obj.progress,
        };
      });

      let overallCompletionRate = 0;
      employeeProgress.forEach((obj) => {
        overallCompletionRate += obj.progress / project.employees.length;
      });

      res.json({
        projName: project.name,
        employeeProgress: employeeProgress,
        isLive: project.settings.isLive,
        overallCompletionRate: overallCompletionRate,
      });
    })
    .catch((err) => {
      res.status(400).json({ status: "failed fetching project" });
    });
});

router.put("/makeProjectLive/:projectID", (req, res) => {
  Project.findById(req.params.projectID)
    .then((project) => {
      project.settings.isLive = true;
      project
        .save()
        .then(() => {
          res.json({ status: "success" });
        })
        .catch(() => {
          res.status(400).json({ status: "fail" });
        });
    })
    .catch((err) => {
      res.status(400).json({ status: "fail" });
    });
});
module.exports = router;
