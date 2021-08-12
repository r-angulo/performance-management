import React, { Component } from "react";
import TextField from "../../display/TextField";
import TextAreaDescription from "../../display/TextAreaDescription";
import CollectionView from "../../display/CollectionView";
import SegmentedControl from "../../display/SegmentedControl";
import Cell from "../../display/Cell";

class ProjectSetupMeasures extends Component {
  // TODO: ADD WEIGHTS TO MEASURE BELOW
  constructor(props) {
    super(props);

    this.state = {
      createIsActive: true,
    };

    this.handleMeasureClicked = this.handleMeasureClicked.bind(this);
    this.handleProjectMeasuresClicked = this.handleProjectMeasuresClicked.bind(
      this
    );
  }

  handleMeasureClicked() {
    this.setState({ createIsActive: !this.state.createIsActive });
  }

  handleProjectMeasuresClicked() {
    this.setState({ createIsActive: !this.state.createIsActive });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container" onClick={this.handleMeasureClicked}>
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Create Measure</h2>
            <img
              src={require("../../../images/plus-icon-colored.png")}
              style={{
                width: "50px",
              }}
            ></img>
          </div>
        </div>
        {this.state.createIsActive && (
          <React.Fragment>
            <div className="container">
              <TextField placeholder="Measure Name"></TextField>

              <TextAreaDescription description="Measure Description"></TextAreaDescription>
              <CollectionView></CollectionView>
            </div>
            <div class="simple-container">
              <button class="button" type="submit">
                Save
              </button>
              <button class="button" type="submit">
                Save and Add
              </button>
            </div>
          </React.Fragment>
        )}

        <div className="container" onClick={this.handleProjectMeasuresClicked}>
          <h2>Add Projects Measure</h2>
        </div>
        {!this.state.createIsActive && (
          <React.Fragment>
            <div className="container">
              <TextField></TextField>
              <SegmentedControl></SegmentedControl>
              <Cell title="title" description="desc"></Cell>
            </div>
            <div class="simple-container">
              <button class="button" type="submit">
                Previous
              </button>
              <button class="button" type="submit">
                Save and Continue
              </button>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ProjectSetupMeasures;
