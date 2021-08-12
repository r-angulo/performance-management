import React, { Component } from "react";
import Cell from "../../display/Cell";
import {
  getProjectMeasures,
  addMeasuresAndWeightsToProject,
} from "../../../actions/managerActions";
import { connect } from "react-redux";
import axios from "axios";

//TODO: render is called multiple times when onchange, is this bc render is called when state changes and you are chjanging state multiples times
//when calleing to create the elements
//TODO: add the 100% checking in the background
//TODO: slack intergratio
///TODO: add posiblity of editing live project
//NOTE: there is an error where if the user goes the previosu page and does not add a measure, then goes forward it recalcualtes the measures wieghts, even if user already played with them
//ERROR PROBALBY BC THEY STILL NEED TO GET UPLOADED
//TODO: do a loading thing
class ProjectSetupWeights extends Component {
  // TODO: MAKE ALL WEIGHTS === ONLOAD DEPENDING ON NUMBER OF SCORES
  //TODO: make a right detail input
  constructor(props) {
    super(props);

    this.state = {
      measureData: [],
      measureElements: [],
      currentTotal: 0,
      errors: {},
    };
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.saveMeasureWeights = this.saveMeasureWeights.bind(this);
  }

  componentDidMount() {
    //get the current measures for the project with preset weights
    this.props.getProjectMeasures(localStorage.getItem("currentProjectID"));
  }

  componentWillReceiveProps(newProps) {
    console.log("received new props");
    console.log(newProps.mananger.thisProjectMeasures);
    this.setState(
      { measureData: newProps.mananger.thisProjectMeasures },
      () => {
        this.createEmployeeElements(this.state.measureData);
      }
    );
    //why is it not receiveing the new props
  }

  //TODO: still have to import the rest of the style from mockup
  createEmployeeElements(dataArray) {
    let tempItems = dataArray.map((measure) => (
      <React.Fragment key={measure._id}>
        <Cell
          title={measure.measureID.name}
          description={measure.measureID.description}
          data-index={measure._id}
          rightSide={
            <input
              type="number"
              min={0}
              onChange={this.handleWeightChange}
              value={measure.weight}
              data-index={measure._id}
              style={{
                width: "95%",
                fontSize: "1.2em",
                fontWeight: "bold",
                backgroundColor: "rgb(189,189,189)",
                border: "3px solid black",
              }}
            />
          }
        ></Cell>
      </React.Fragment>
    ));
    this.setState({ measureElements: tempItems }, () => {
      let totalSum = 0;
      this.state.measureData.forEach((measure) => {
        totalSum += measure.weight;
      });
      this.setState({ currentTotal: totalSum });
      console.log(totalSum);
    });
  }

  handleWeightChange(e) {
    let newWeight = isNaN(e.target.value) ? 0 : Number(e.target.value);

    let newMeasureData = this.state.measureData;
    newMeasureData.forEach((measureObj) => {
      if (measureObj._id === e.target.dataset.index) {
        measureObj.weight = newWeight;
      }
    });

    this.setState({ measureData: newMeasureData }, () => {
      this.createEmployeeElements(this.state.measureData);
    });
  }

  saveMeasureWeights() {
    console.log("save clicked");
    console.log(this.state.measureData);
    let measuresIDsList = this.state.measureData.map((measureObj) => {
      return measureObj.measureID._id;
    });

    let measureWeightsList = this.state.measureData.map((measureObj) => {
      return measureObj.weight;
    });
    console.log(measuresIDsList);
    console.log(measureWeightsList);
    if (this.state.currentTotal === 100) {
      //create the action to post the meaasure and wieghgst ass array , look at psotman for format
      //   this.props.addMeasuresAndWeightsToProject(
      // {
      //   projectID: localStorage.getItem("currentProjectID"),
      //   measureIDsStringedList: measuresIDsList,
      //   measureWeights: measureWeightsList,
      // },
      //     this.props.history
      //   );
      // }
      axios
        .post("/api/manager/project/weights", {
          projectID: localStorage.getItem("currentProjectID"),
          measureIDsStringedList: measuresIDsList,
          measureWeights: measureWeightsList,
        })
        .then((res) => {
          console.log("Added weights successfully");
          console.log(res.data);
          console.log(measureWeightsList);
          console.log(measureWeightsList.reduce((a, b) => a + b, 0));
          this.props.nextClicked();
        })
        .catch((err) => {
          console.log("err");
          console.log(err.response.data);
          if (err.response.data) {
            this.setState({ errors: err.response.data });
          }
        });
    }
  }
  render() {
    return (
      <div className="container">
        <h2 style={{ width: "100%", textAlign: "center" }}>
          Assign Weights to Measures
        </h2>

        <h4>All measure weights must add up to 100%</h4>
        {this.state.measureElements}
        <h2
          style={{
            width: "100%",
            textAlign: "center",
            color: this.state.currentTotal !== 100 ? "#ff4d4d" : "#4dffa6",
          }}
        >
          Total: {this.state.currentTotal}%
        </h2>
        {this.state.errors.weights && (
          <h4
            style={{
              width: "100%",
              textAlign: "center",
              color: "#ff4d4d",
            }}
          >
            {"Error: " + this.state.errors.weights}
          </h4>
        )}

        <div className="simple-container">
          <button
            className="button"
            type="submit"
            onClick={() => {
              this.props.prevClicked();
            }}
          >
            Previous
          </button>
          <button
            className="button"
            type="submit"
            onClick={this.saveMeasureWeights}
            style={{
              visibility:
                this.state.currentTotal === 100 ? "visible" : "hidden",
            }}
          >
            Save and Finish
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  mananger: state.mananger,
  admin: state.admin,
});

export default connect(mapStateToProps, {
  getProjectMeasures,
  addMeasuresAndWeightsToProject,
})(ProjectSetupWeights);
