const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //used to encrypt passwords
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const User = require("../models/User");
const Project = require("../models/Project");
const Employee = require("../models/Employee");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const { response } = require("express");
const { body, validationResult, oneOf } = require("express-validator");
const { check } = require("express-validator");
//TODO:
//get projects
//get employees for this project except self
//get score. find remained scores for this employee=>proect
//post score

//NOTE: for ?id=# its req.query.id
//for /user/number its req.params.id

//input: userid
//outputs: for now, project names this person is in

router.get("/projectsfor/:id", (req, res) => {
  console.log("req.params.id + " + req.params.id);
  User.findById(req.params.id)
    .populate({ path: "participatedProjects" })
    .then((user) => {
      res.json(user.participatedProjects);
    })
    .catch((err) => res.json({ error: "Could not find employee profile" }));
});

//TODO: tell user they have 500 words left
//TODO: make sure from is actual current logged in user
//TODO: add view where manager can see all feedback and user can see anon comments made to them
//TODO: make sure score between 0-5
//MAKE SURE HASNT ALREADY MADE THIS FEEDBACK or if edit allowed make sure dont overwire other ppls comments
//input: projectID, fromID, toID, measureID, score(number),comment(string)
//summary, find project, get feedback list, simply append this to that
// router.post("/feedback", (req, res) => {
//   //look into find by id and update
//   Project.findById(req.body.projID)
//     .then((proj) => {
//       let feedback = proj.feedback;
//       const newFeedbackObj = {
//         from: mongoose.Types.ObjectId(req.body.fromID),
//         to: mongoose.Types.ObjectId(req.body.toID),
//         measure: mongoose.Types.ObjectId(req.body.measureID),
//         score: req.body.score,
//         comment: req.body.comment,
//       };
//       feedback.push(newFeedbackObj);
//       proj
//         .save()
//         .then((p) => res.json(p))
//         .catch((err) =>
//           res.status(400).json({ error: "failed to save projec:" + err })
//         );
//       //save
//     })
//     .catch((err) => res.status(400).json({ error: "could not find project" }));
// });

//TODO: shouldnt this be created when the project is created
//summary, find this feedback entry, if not exist create a new one
//to that combination copy the feedback and append or overwrite this one
//INPUTS: projID, fromID,toID, measureID, score, comment
router.post(
  "/pushfeedback/",
  [
    check("score")
      .isNumeric()
      .withMessage("Score must be a number.")
      .not()
      .isEmpty()
      .withMessage("Score is required"),
    check("comment")
      .escape()
      .isLength({ min: 3, max: 1000 })
      .withMessage("Description must be between 3 and 1000 characters.")
      .not()
      .isEmpty()
      .withMessage("Description is required"),
  ],
  (req, res) => {
    Project.findById(req.body.projID)
      .then((thisProj) => {
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

        let projectFeedback = thisProj.feedback;
        let isFound = false;
        let i = 0;
        console.log(projectFeedback);
        while (!isFound && i < projectFeedback.length) {
          if (
            projectFeedback[i].from.equals(req.body.fromID) &&
            projectFeedback[i].to.equals(req.body.toID)
          ) {
            console.log("found this comb at " + i);
            isFound = true;
          } else {
            console.log("projectFeedback[i] from " + projectFeedback[i].from);
            console.log("equals body fromId" + req.body.fromID);
            console.log("projectFeedback[i] to " + projectFeedback[i].to);
            console.log("equals body toID" + req.body.toID);

            i += 1;
          }
        }

        //if still not found after looking at all the items
        if (!isFound) {
          let newFeedbackObj = {
            from: mongoose.Types.ObjectId(req.body.fromID),
            to: mongoose.Types.ObjectId(req.body.toID),
            responses: [
              {
                measure: mongoose.Types.ObjectId(req.body.measureID),
                score: req.body.score,
                comment: req.body.comment,
              },
            ],
          };
          projectFeedback.push(newFeedbackObj);
        }

        if (isFound) {
          //get measures array and push to there
          //make sure accessing right element
          //delete al lbefore trying
          let newResponses = projectFeedback[i].responses;
          newResponses = newResponses.filter((response) => {
            return !response.measure.equals(req.body.measureID);
          });
          newResponses.push({
            measure: mongoose.Types.ObjectId(req.body.measureID),
            score: req.body.score,
            comment: req.body.comment,
          });
          projectFeedback[i].responses = newResponses;
        }

        thisProj
          .save()
          .then((proj) => {
            res.json(proj);
          })
          .catch((err) => {
            res
              .status(400)
              .json({ error: "failed to update project with feedback" });
          });
      })
      .catch((err) =>
        res
          .status(400)
          .json({ error: "error occured while adding feedback " + err })
      );
  }
);

//return all peers and their respective performance
//INPUTS: PROJECTID, CURR USER
//summary: return all peers,except self, with percent completion per pear
//todo: consider not returning peers that have been complted
router.get("/projectpeers", (req, res) => {
  Project.findById(req.query.projID)
    .populate({ path: "employees" })
    .then((thisProj) => {
      const measuresCount = thisProj.measures.length;

      ////responses
      let thisUsersResponses = [];
      thisProj.feedback.forEach((responseObj) => {
        if (responseObj.from.equals(req.query.currUser)) {
          thisUsersResponses.push(responseObj);
        }
      });
      //thisprojempployees

      let peers = thisProj.employees.filter(
        (employee) => !employee._id.equals(req.query.currUser)
      );

      peers = peers.map((peer) => {
        return {
          empID: peer._id,
          completion: 0,
          fullName: peer.firstName + " " + peer.lastName,
        };
      });

      //the usersresoinsbes.to has to match the peer.id, update that competletion
      thisUsersResponses.forEach((peer) => {
        peers.forEach((thisPeer, i) => {
          if (thisPeer.empID.equals(peer.to)) {
            let thisCompletion = peer.responses.length / measuresCount;
            console.log(thisCompletion);
            peers[i].completion = thisCompletion;
          }
        });
      });
      res.json({
        projName: thisProj.name,
        projDescription: thisProj.description,
        employees: peers,
      });
    })

    .catch((err) => {
      res
        .status(400)
        .json({ error: "error occured while getting peers" + err });
    });
});

//inputs: projID, fromID,toID
//return: all (Scoreid, scorename, scoredesc) and users to from response if exists
router.get("/feedbackresponses", (req, res) => {
  const { projID, fromID, toID } = req.query;
  Project.findById(projID)
    .populate({ path: "measures.measureID" })
    .then((thisProj) => {
      let fromToFeedback = {};
      thisProj.feedback.forEach((feedbackObj) => {
        if (
          feedbackObj.from.equals(req.query.fromID) &&
          feedbackObj.to.equals(req.query.toID)
        ) {
          console.log(feedbackObj);
          fromToFeedback = feedbackObj;
        }
      });
      res.json({ measures: thisProj.measures, fromToFeedback: fromToFeedback });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "error occured while fetching responses: " + err });
    });
});
//inputs: projID, fromID,toID
//return: all (Scoreid, scorename, scoredesc) and users to from response if exists
router.get("/projectMeasures/:projID", (req, res) => {
  const { projID } = req.params;
  Project.findById(projID)
    .populate({ path: "measures.measureID" })
    .then((thisProj) => {
      // let fromToFeedback = {};
      // thisProj.feedback.forEach((feedbackObj) => {
      //   if (
      //     feedbackObj.from.equals(req.query.fromID) &&
      //     feedbackObj.to.equals(req.query.toID)
      //   ) {
      //     console.log(feedbackObj);
      //     fromToFeedback = feedbackObj;
      //   }
      // });
      res.json({ measures: thisProj.measures });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "error occured while fetching responses: " + err });
    });
});

//inputs: projID, fromID,toID
//return: return one (Scoreid, scorename, scoredesc) and users to from response if exists, otherwise return empty strings
router.get("/oneresponse", (req, res) => {
  const { projID, fromID, toID, measureID } = req.query;
  Project.findById(projID)
    .populate({ path: "measures.measureID" })
    .then((thisProj) => {
      let fromToFeedback = {};
      thisProj.feedback.forEach((feedbackObj) => {
        if (
          feedbackObj.from.equals(req.query.fromID) &&
          feedbackObj.to.equals(req.query.toID)
        ) {
          console.log(feedbackObj);
          fromToFeedback = feedbackObj;
        }
      });
      let response = { measure: measureID, score: 0, comment: "" };
      if (fromToFeedback.responses) {
        fromToFeedback.responses.forEach((thisResponse) => {
          if (thisResponse.measure.equals(measureID)) {
            response = thisResponse;
          }
        });
      }
      // res.json({ res: fromToFeedback.responses });
      res.json({ res: response });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "error occured while fetching responses: " + err });
    });
});

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//eventually check isLive or 100% complete,
//take INTO CONSIDERATION weights
//TODO: try to convert as many foreaches to a while loop
router.get("/resultsForProject", (req, res) => {
  Project.findById(req.query.projID)
    .lean()
    .populate({ path: "measures.measureID" })
    .then((project) => {
      let measures = project.measures;

      let myFeedback = project.feedback.filter((obj) =>
        obj.to.equals(req.query.currUser)
      );

      myFeedback.forEach((feedbackObj) => {
        feedbackObj.responses.forEach((response) => {
          measures.forEach((measure) => {
            if (measure.measureID._id.equals(response.measure)) {
              console.log(response);
              if (!measure.responses) {
                measure.responses = [];
              }
              measure.responses.push(response);
            }
          });
        });
      });
      //here you have the connected array
      let overallScore = 0;
      measures.forEach((measure) => {
        let totalScore = 0;
        measure.responses.forEach((response) => {
          totalScore += response.score;
        });
        const averageScore = totalScore / measure.responses.length;
        measure.averageScore = averageScore;

        overallScore += (measure.weight / 100.0) * averageScore;
      });

      ///shuffle the responses
      measures.forEach((measureObj) => {
        measureObj.responses = shuffle(measureObj.responses);
      });

      res.json({ measures: measures, overallScore: overallScore });
      //TODO: add each measurs to its respoince spot in measujres do with 3
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Failed to get project measures from DB:" + err })
    );
});

router.get("/projectcompletionrates/:id", (req, res) => {
  console.log("req.params.id + " + req.params.id);
  User.findById(req.params.id)
    .populate({ path: "participatedProjects" })
    .then((user) => {
      let response = [];
      user.participatedProjects.forEach((project) => {
        console.log("new project");
        console.log(project.name);
        console.log("measures.length " + project.measures.length);
        console.log("employees.length " + project.employees.length);
        let currentResponses = 0;
        project.feedback.forEach((response) => {
          if (response.from.equals(req.params.id)) {
            console.log(response);
            console.log(response.responses.length);
            currentResponses += response.responses.length;
          }
        });
        let responsesRequired =
          (project.employees.length - 1) * project.measures.length;
        console.log(
          req.params.id,
          currentResponses,
          responsesRequired,
          currentResponses / responsesRequired
        );
        response.push({
          id: project._id,
          name: project.name,
          completionRate: currentResponses / responsesRequired,
          isLive: project.settings.isLive,
        });
      });
      res.json(response);
    })
    .catch((err) => res.json({ error: "Could not find employee profile" }));
});
module.exports = router;
