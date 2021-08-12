import React, { Component } from "react";
import { connect } from "react-redux";
import TextAreaDescription from "../../display/TextAreaDescription";
import HeaderDescription from "../../display/HeaderDescription";
import TextArea from "../../display/TextAreaDescription";
import Slider from "../../display/Slider";
import "../../../css/button.css";
// import { getMeasures, postOneFeedback } from "../../../actions/employeeActions";
import axios from "axios";
import { updateNavTitle } from "../../../actions/navActions";

//TODO: make sure in server that has access to this to and project since its stored in session
//TODO: WHEN calling this fomr previous page in the same request, state which is the current index, do calcualtion in the server
//TODO: make sure user wrote comment and note empty when clicking next
//TODO" make sure score actually shows up in the db right
class Score extends Component {
  constructor(props) {
    super(props);

    this.state = {
      score: 0,
      comment: "",
      projectMeasures: [],
      currentMeasureIndex: 0,
      errors: {},
    };

    this.handleSliderChanged = this.handleSliderChanged.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleNextClicked = this.handleNextClicked.bind(this);
    this.handlePrevClicked = this.handlePrevClicked.bind(this);
  }

  getMeasures(projID) {
    axios
      .get(`/api/employee/projectMeasures/${projID}`)
      .then((res) => {
        this.setState({ projectMeasures: res.data.measures }, () => {
          this.getFeedbackData();
        });
      })
      .catch((err) =>
        console.log("could not get remaining measures, err: " + err)
      );
  }

  //TODO: since the func is in here now, you dont even need to pass in a query obj
  getFeedbackData() {
    console.log(
      `/api/employee/oneresponse/?projID=${localStorage.getItem(
        "projID"
      )}&fromID=${localStorage.getItem("fromID")}&toID=${localStorage.getItem(
        "toID"
      )}&measureID=${
        this.state.projectMeasures[this.state.currentMeasureIndex].measureID._id
      }`
    );
    axios
      .get(
        `/api/employee/oneresponse/?projID=${localStorage.getItem(
          "projID"
        )}&fromID=${localStorage.getItem("fromID")}&toID=${localStorage.getItem(
          "toID"
        )}&measureID=${
          this.state.projectMeasures[this.state.currentMeasureIndex].measureID
            ._id
        }`
      )
      .then((res) => {
        this.setState({
          comment: res.data.res.comment,
          score: res.data.res.score,
          errors: {},
        });
      })
      .catch((err) =>
        console.log("could not get remaining measures, err: " + err)
      );
  }

  postOneFeedback(callbackAction) {
    axios
      .post("/api/employee/pushfeedback/", {
        projID: localStorage.getItem("projID"),
        fromID: localStorage.getItem("fromID"),
        toID: localStorage.getItem("toID"),
        measureID: this.state.projectMeasures[this.state.currentMeasureIndex]
          .measureID._id,
        score: this.state.score,
        comment: this.state.comment,
      })
      .then((res) => {
        callbackAction();
      })
      .catch((err) => {
        console.log("error occured while updating user" + err);
        console.log("err");
        console.log(err.response.data);
        if (err.response.data) {
          this.setState({ errors: err.response.data });
        }
        console.log(err);
      });
  }

  componentDidMount() {
    this.getMeasures(localStorage.getItem("projID"));
    this.props.updateNavTitle("Provide Review");
  }

  handleSliderChanged(e) {
    this.setState({ score: e.target.value });
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value });
  }

  handlePrevClicked(e) {
    console.log("prev clicked");
    this.postOneFeedback(() => {});
    if (this.state.currentMeasureIndex !== 0) {
      this.setState(
        {
          currentMeasureIndex: this.state.currentMeasureIndex - 1,
        },
        () => {
          this.getFeedbackData();
        }
      );
    }
  }

  handleNextClicked(e) {
    // this.postOneFeedback();
    if (
      this.state.currentMeasureIndex !==
      this.state.projectMeasures.length - 1
    ) {
      this.postOneFeedback(() => {
        this.setState(
          {
            currentMeasureIndex: this.state.currentMeasureIndex + 1,
          },
          () => {
            this.getFeedbackData();
          }
        );
      });
    } else {
      this.postOneFeedback(() => {
        this.props.history.push(`/project/${localStorage.getItem("projID")}`);
      });
    }
  }

  render() {
    let nextBtnTitle = "";
    if (
      this.state.currentMeasureIndex ===
      this.state.projectMeasures.length - 1
    ) {
      nextBtnTitle = "Save and Submit";
    } else {
      nextBtnTitle = "Next";
    }

    let measureName = "";
    let measureDescription = "";

    if (this.state.projectMeasures.length !== 0) {
      measureName = this.state.projectMeasures[this.state.currentMeasureIndex]
        .measureID.name;
      measureDescription = this.state.projectMeasures[
        this.state.currentMeasureIndex
      ].measureID.description;
    }

    return (
      <div>
        <HeaderDescription
          title={measureName}
          description={measureDescription}
        ></HeaderDescription>

        <Slider
          sliderValue={this.state.score}
          value={this.state.score}
          onChange={this.handleSliderChanged}
        ></Slider>
        <h4>{this.state.errors.score}</h4>
        <div className="container">
          <TextAreaDescription
            description="Your feedback"
            onChange={this.handleCommentChange}
            value={this.state.comment}
            error={this.state.errors.comment}
            maxChars={1000}
          ></TextAreaDescription>
        </div>
        <div className="simple-container">
          <button
            className="button"
            type="submit"
            onClick={this.handlePrevClicked}
            style={{
              visibility:
                this.state.currentMeasureIndex === 0 ? "hidden" : "visible",
            }}
          >
            Previous
          </button>
          <button
            className="button"
            type="submit"
            onClick={this.handleNextClicked}
          >
            {nextBtnTitle}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  employee: state.employee,
  nav: state.nav,
});

export default connect(mapStateToProps, { updateNavTitle })(Score);
