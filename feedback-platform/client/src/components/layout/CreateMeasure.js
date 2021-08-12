import React, { Component } from "react";
import { connect } from "react-redux";
import TextField from "../display/TextField";
import TextAreaDescription from "../display/TextAreaDescription";
import CollectionView from "../display/CollectionView";
import EditEmployee from "./Admin/EditEmployee";
import { createNewMeasure } from "../../actions/managerActions";
import axios from "axios";
import { updateNavTitle } from "../../actions/navActions";

//TODO: add measure pictures
class CreateMeasure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      measureDescription: "",
      errors: {},
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ measureDescription: e.target.value });
  }

  componentDidMount() {
    this.props.updateNavTitle("Create New Measure");
  }

  handleSubmit(e) {
    const reqObj = {
      name: this.state.name,
      description: this.state.measureDescription,
    };
    console.log(reqObj);
    //TO0DO: PASSS IN PROPS AND where to push to

    axios
      .post("/api/shared/createmeasure", reqObj)
      .then((res) => {
        this.props.history.push("/home");
      })
      .catch((err) => {
        console.log("error occured while updating user" + err);
        console.log("err");
        console.log(err.response.data);
        if (err.response.data) {
          this.setState({ errors: err.response.data });
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}></form>
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
          </div>
        </div>

        <div className="container">
          <TextField
            name="name"
            placeholder="Meausure Name"
            onChange={this.handleNameChange}
            value={this.state.name}
            error={this.state.errors.name}
          ></TextField>

          <TextAreaDescription
            description="Measure Description"
            onChange={this.handleDescriptionChange}
            error={this.state.errors.measureDescription}
            maxChars={500}
            value={this.state.measureDescription}
          ></TextAreaDescription>
          <CollectionView></CollectionView>
        </div>
        <div className="simple-container" style={{ justifyContent: "center" }}>
          <button className="button" type="submit" onClick={this.handleSubmit}>
            Create
          </button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ nav: state.nav });

export default connect(mapStateToProps, { createNewMeasure, updateNavTitle })(
  CreateMeasure
);
