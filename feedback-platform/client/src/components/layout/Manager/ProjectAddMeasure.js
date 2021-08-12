import React, { Component } from "react";
import { connect } from "react-redux";
import TextField from "../../display/TextField";
import SegmentedControl from "../../display/SegmentedControl";
import Cell from "../../display/Cell";
import { addMeasuresToProject } from "../../../actions/managerActions";
import axios from "axios";
//TODO: PASS IN CONTAINER PROPS TO THIS COMPNENT SO THAT THE HISTOTY PUSH WORKS
class ProjectAddMeasure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonSelectedMeasures: [],
      selectedMeasures: [],
      searchData: [],
      isTyping: false,
      isAdding: true,
      searchTerm: "",
    };

    this.handleSegmentClicked = this.handleSegmentClicked.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.saveMeasuresAdded = this.saveMeasuresAdded.bind(this);
  }

  componentDidMount() {
    this.getMeasures();
  }

  //TODO: COPY AND EDIT COMPONENT WILL RECEIVE PROPS FROM EDIT EMPLOYEES
  componentWillReceiveProps(newProps) {
    //once returned from redux
    //note this is async
    // console.log("received new props: " + newProps);
    // console.log(newProps);
    this.setState({ nonSelectedMeasures: newProps.mananger.allMeasures });
  }

  getMeasures() {
    axios
      .get(
        "/api/manager/project/addedAndNonAddedMeasures/" +
          localStorage.getItem("currentProjectID")
      )
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        this.setState({
          nonSelectedMeasures: res.data.nonSelectedMeasures,
          selectedMeasures: res.data.selectedMeasures,
        });
      })
      .catch((err) =>
        console.log("error occured while getting measures: " + err)
      );
  }

  searchHandler(e) {
    let searchTerm = e.target.value.toLowerCase();
    console.log("searchHandlerCalled: " + searchTerm);
    this.setState({ searchTerm });
    console.log(searchTerm);
    if (this.state.isAdding) {
      var searchedMeasures = this.state.nonSelectedMeasures.filter((measure) =>
        measure.name.toLowerCase().includes(searchTerm)
      );
      this.setState({ searchData: searchedMeasures });
      // this.createMeasureElements(searchedMeasures, "Add");
    } else {
      var searchedMeasures = this.state.selectedMeasures.filter((measure) =>
        measure.name.toLowerCase().includes(searchTerm)
      );
      this.setState({ searchData: searchedMeasures });

      // this.createMeasureElements(searchedMeasures, "Remove");
    }
  }
  handler(e) {
    console.log("something clicked:" + e);
    console.log(e);
    this.setState({ searchTerm: "" });

    if (this.state.isAdding) {
      //add selected element to
      this.setState(
        {
          selectedMeasures: [...this.state.selectedMeasures, e],
        },
        () => {
          this.setState({
            nonSelectedMeasures: this.state.nonSelectedMeasures.filter(
              (measure) => measure !== e
            ),
          });
        }
      );
    }
    if (!this.state.isAdding) {
      //add selected element to
      this.setState(
        {
          nonSelectedMeasures: [...this.state.nonSelectedMeasures, e],
        },
        () => {
          this.setState({
            selectedMeasures: this.state.selectedMeasures.filter(
              (measure) => measure !== e
            ),
          });
        }
      );
    }
  }

  handleSegmentClicked(e) {
    const { classList } = e.target;

    const { segment } = e.target.dataset;
    if (segment === "added") {
      this.setState({ isAdding: false });
    } else if (segment === "search") {
      this.setState({ isAdding: true });
    }
  }

  saveMeasuresAdded() {
    let addedMeasuresIDs = this.state.selectedMeasures.map(
      (measure) => measure._id
    );
    //TODO: later retrive this id from main main container
    let postObject = {
      projectID: localStorage.getItem("currentProjectID"),
      measuresArray: addedMeasuresIDs,
    };

    //TODO: crate
    console.log("save measures added");
    // this.props.addMeasuresToProject(postObject, this.props.history);
    axios
      .post("/api/manager/project/measures", postObject)
      .then((res) => {
        console.log("Added measures successfully");
        console.log(res);
        // history.push("/projectsetup/weights");
        this.props.nextClicked();
      })
      .catch((err) => console.log("error occured adding measures: " + err));
    console.log(addedMeasuresIDs);
  }
  createMeasureElements(dataArray, buttonTitle) {
    let tempMeasureItems = dataArray.map((measure) => (
      // <Cell
      //   key={measure._id}
      //   title={measure.name}
      //   description={measure.description}
      //   data-index={measure._id}
      //   rightSide={
      //     <button onClick={() => this.handler(measure)}>{buttonTitle}</button>
      //   }
      // ></Cell>
      <Cell
        key={measure._id}
        title={measure.name}
        description={measure.description}
        data-index={measure._id}
        leftSide={
          <div
            style={{
              width: "100%",
              // border: "1px solid red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              style={{ width: "50%", textAlign: "center" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 144 144"
            >
              <mask
                id="tech-leadership"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="144"
                height="144"
              >
                <path
                  d="M72 144c39.765 0 72-32.235 72-72 0-39.764-32.235-72-72-72C32.236 0 0 32.236 0 72c0 39.765 32.236 72 72 72z"
                  fill="#fff"
                />
              </mask>
              <g mask="url(#tech-leadership)">
                <path
                  d="M72 140c37.555 0 68-30.445 68-68S109.555 4 72 4 4 34.445 4 72s30.445 68 68 68z"
                  fill="#FFCE7E"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M72 0C32.24 0 0 32.24 0 72c0 19.307 7.602 36.84 19.975 49.771l39.331 21.113A72.44 72.44 0 0072 144c39.76 0 72-32.24 72-72S111.76 0 72 0zm63 72c0-34.74-28.26-63-63-63C37.26 9 9 37.26 9 72c0 34.74 28.26 63 63 63 34.74 0 63-28.26 63-63z"
                  fill="#343799"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M67.07 15.39l-3.86 1.03.092 5.409a21.347 21.347 0 00-3.99 2.299L54.68 21.35l-2.83 2.83 2.78 4.635a21.618 21.618 0 00-2.302 3.987l-5.408-.092-1.03 3.86 4.722 2.626a21.331 21.331 0 00.005 4.605L45.89 46.43l1.03 3.86 5.413-.092a21.329 21.329 0 002.297 3.986l-2.78 4.636 2.83 2.83 4.643-2.784a21.622 21.622 0 003.979 2.295l-.092 5.419 3.86 1.03 2.632-4.732a21.332 21.332 0 004.594-.005l2.634 4.737 3.86-1.03-.092-5.423a21.347 21.347 0 003.978-2.292l4.644 2.785 2.83-2.83-2.788-4.648a21.612 21.612 0 002.295-3.974l5.423.092 1.03-3.86-4.732-2.632a21.342 21.342 0 00-.003-4.595l4.735-2.633-1.03-3.86-5.419.092a21.345 21.345 0 00-2.293-3.983l2.782-4.639-2.83-2.83-4.641 2.783a21.615 21.615 0 00-3.98-2.3l.091-5.413-3.86-1.03-2.627 4.724a21.347 21.347 0 00-4.604.002l-2.63-4.726zm4.94 11.77c6.47 0 12.15 4.37 13.83 10.63.99 3.7.48 7.56-1.43 10.88a14.227 14.227 0 01-8.7 6.68c-1.22.33-2.48.49-3.72.49-6.47 0-12.15-4.37-13.83-10.63-.99-3.7-.48-7.56 1.43-10.88 1.91-3.32 5.01-5.69 8.7-6.68 1.22-.32 2.48-.49 3.72-.49z"
                  fill="#343799"
                />
                <path
                  d="M124.01 121.76L72 69.17l-52.01 52.59C33.1 135.46 51.55 144 72 144s38.9-8.54 52.01-22.24z"
                  fill="#343799"
                />
                <path d="M0 144h59.13L72 69.17l-72 72.8V144z" fill="#fff" />
              </g>
            </svg>
          </div>
        }
        rightSide={
          <div
            style={{
              width: "100%",
              // border: "1px solid red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div onClick={() => this.handler(measure)} style={{ width: "50%" }}>
              {this.state.isAdding ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <g>
                    <path
                      fill="green"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276a12 12 0 0 1-12 12h-92v92a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12v-92h-92a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h92v-92a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v92h92a12 12 0 0 1 12 12z"
                    ></path>
                    <path
                      fill="white"
                      d="M400 284a12 12 0 0 1-12 12h-92v92a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12v-92h-92a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h92v-92a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v92h92a12 12 0 0 1 12 12z"
                    ></path>
                  </g>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <g class="fa-group">
                    <path
                      fill="#ff4f60"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276a12 12 0 0 1-12 12H124a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h264a12 12 0 0 1 12 12z"
                    ></path>
                    <path
                      fill="white"
                      d="M400 284a12 12 0 0 1-12 12H124a12 12 0 0 1-12-12v-56a12 12 0 0 1 12-12h264a12 12 0 0 1 12 12z"
                    ></path>
                  </g>
                </svg>
              )}
            </div>
          </div>
        }
      ></Cell>
    ));
    // this.setState({ measureElements: tempMeasureItems });
    return tempMeasureItems;
  }
  render() {
    console.log(this.state);
    let measureElements = [];
    if (this.state.isAdding && this.state.isTyping) {
      measureElements = this.createMeasureElements(
        this.state.searchData,
        "Add"
      );
    }

    if (this.state.isAdding && !this.state.isTyping) {
      measureElements = this.createMeasureElements(
        this.state.nonSelectedMeasures,
        "Add"
      );
    }

    if (!this.state.isAdding && this.state.isTyping) {
      measureElements = this.createMeasureElements(
        this.state.searchData,
        "Remove"
      );
    }
    if (!this.state.isAdding && !this.state.isTyping) {
      measureElements = this.createMeasureElements(
        this.state.selectedMeasures,
        "Remove"
      );
    }
    return (
      <React.Fragment>
        <div className="container" onClick={this.handleProjectMeasuresClicked}>
          <h2>Add Projects Measure</h2>
        </div>
        <div className="container">
          <TextField
            name="search"
            placeholder="Search for measures"
            onChange={this.searchHandler}
            value={this.state.searchTerm}
            onFocus={() => {
              this.setState({ isTyping: true });
            }}
            onBlur={() => {
              this.setState({ isTyping: false });
            }}
          ></TextField>
          <SegmentedControl
            onClick={this.handleSegmentClicked}
          ></SegmentedControl>
          {measureElements}
        </div>
        <div class="simple-container">
          <button
            class="button"
            type="submit"
            onClick={() => {
              this.props.prevClicked();
            }}
          >
            Previous
          </button>
          <button class="button" type="submit" onClick={this.saveMeasuresAdded}>
            Save and Continue
          </button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  mananger: state.mananger,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, {
  addMeasuresToProject,
})(ProjectAddMeasure);
