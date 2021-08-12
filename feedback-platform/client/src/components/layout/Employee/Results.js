import React, { Component } from "react";
import "../../../css/individual/results.css";
import Cell from "../../display/Cell";
import { connect } from "react-redux";
import axios from "axios";
//TODO: what you can do to improve, also pivot towards this
//TODO: make it so that rank is only visible above if amanager want(goal: more sensitve platform)
//TODO: somehow get ppl to write more, model by behavior expected,ex wirte a lot in placeholder, ppl will geel rushed by legnth of need to fil ltho
//TODO: toggle comments make sure is viisble, manager can see all of them tho, by profile
//TODO: sort by best, sort by worst, sort by smallest  to largest or vv weight
//TODO: add drop down if comments they can see
class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overallScore: 0,
      thisRank: 69,
      totalInProject: 33,
      measures: [],
    };
  }

  getFeedback() {
    let userID = this.props.userID
      ? this.props.userID
      : this.props.auth.user.id;

    console.log("userID:" + userID);
    axios
      .get(
        `/api/employee/resultsForProject?projID=${this.props.match.params.projectID}&currUser=${userID}`
      )
      .then((res) => {
        this.setState({
          overallScore: res.data.overallScore,
          measures: res.data.measures.map((measure) => {
            return { ...measure, isShown: false, commentIndex: 0 };
          }),
        });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getFeedback();
  }
  componentWillReceiveProps(newProps) {
    this.getFeedback();
  }

  //todo update bc now you haves access to len and i
  changeComment(id, step) {
    this.setState({
      measures: this.state.measures.map((measure) => {
        let temp = Object.assign({}, measure);
        if (id === measure.measureID._id) {
          let newIndex = 0;
          let i = measure.commentIndex;
          let len = measure.responses.length;

          if (step === -1) {
            if (i === 0) {
              newIndex = len - 1;
            } else {
              newIndex = i - 1;
            }
          }

          if (step === 1) {
            if (i === len - 1) {
              newIndex = 0;
            } else {
              newIndex = i + 1;
            }
          }
          temp.commentIndex = newIndex;
        }
        return temp;
      }),
    });
  }

  //set index to 0
  //NOTE: the runtime on this is poor probably
  //NOTE: might need to use the async version of set state
  toggleDisplayComments(id) {
    this.setState({
      measures: this.state.measures.map((measure) => {
        let temp = Object.assign({}, measure);
        if (id === measure.measureID._id) {
          temp.isShown = !temp.isShown;
        }
        return temp;
      }),
    });
  }
  render() {
    const { overallScore, thisRank, totalInProject, measures } = this.state;
    const allScores = measures.map((measure) => {
      const i = 0;
      return (
        <React.Fragment key={measure.measureID._id}>
          <Cell
            onClick={() => this.toggleDisplayComments(measure.measureID._id)}
            title={measure.measureID.name}
            description={measure.measureID.description}
            style={{
              borderRadius: measure.isShown ? "5px 5px 0px 0px " : "5px",
              margin: "10px 0px 0px",
            }}
            rightSide={
              <h1
                style={{
                  color:
                    measure.averageScore >= 7
                      ? "#47ffa4"
                      : measure.averageScore < 3
                      ? "#ff7f7e"
                      : "#ffa447",
                }}
              >
                {measure.averageScore.toFixed(2)}
              </h1>
            }
          ></Cell>
          <div
            className="commentView"
            style={{
              backgroundColor: "#CCD0D5",
              width: "95%",
              margin: "0px",
              display: measure.isShown ? "flex" : "none",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "10px 40px",
              borderRadius: "0px 0px 5px 5px",
              // display: "none",
            }}
          >
            <p
              style={{
                width: "100%",
                textAlign: "center",
                color: "black",
                fontWeight: "550",
              }}
            >
              {measure.responses[measure.commentIndex].comment}
            </p>
            <button
              style={{ backgroundColor: "inherit", border: "none" }}
              onClick={() => {
                this.changeComment(measure.measureID._id, -1);
              }}
            >
              <svg
                style={{ width: "25px" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-chevron-circle-left fa-w-16 fa-7x"
              >
                <path
                  fill="dodgerblue"
                  d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256zm107.5-8.5l122.8-122.8c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17L234.2 256l91.7 91.7c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L163.5 264.5c-4.7-4.7-4.7-12.3 0-17z"
                  class=""
                ></path>
              </svg>
            </button>
            <button
              style={{ backgroundColor: "inherit", border: "none" }}
              onClick={() => {
                this.changeComment(measure.measureID._id, 1);
              }}
            >
              <svg
                style={{ width: "25px" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-chevron-circle-left fa-w-16 fa-7x"
              >
                <path
                  fill="dodgerblue"
                  d="M8 256c0 137 111 248 248 248s248-111 248-248S393 8 256 8 8 119 8 256zm448 0c0 110.5-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56s200 89.5 200 200zm-107.5 8.5L225.7 387.3c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l91.7-91.7-91.7-91.7c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l122.8 122.8c4.7 4.7 4.7 12.3 0 17z"
                ></path>
              </svg>
            </button>
          </div>
        </React.Fragment>
      );
    });
    return (
      <React.Fragment>
        <div className="container">
          <h1>Overall Score: {overallScore.toFixed(2)}</h1>
        </div>
        <div className="container">
          <h3>
            Rank: #{thisRank} out of {totalInProject}
          </h3>
        </div>
        <div
          className="simple-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {allScores}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
