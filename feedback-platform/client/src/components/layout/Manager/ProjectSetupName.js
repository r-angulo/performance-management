import React, { Component } from "react";
import TextField from "../../display/TextField";
import CollectionView from "../../display/CollectionView";
import { connect } from "react-redux";
import { createProjectName } from "../../../actions/managerActions";
import TextAreaDescription from "../../display/TextAreaDescription";
import axios from "axios";

class ProjectSetupName extends Component {
  // TODO: CREATE CAROUSEL OF PRESET PROJECT IMAGES
  // TODO: ADD PROGRESS BAR AT THE TOP SPECIFIING WHICH ARE NEXT
  // TODO: 1. name 2. project settings(due date, rank?) 3. employees(import from old) 4. Scores
  //TODO: edit so cannot be empty
  //TODO: not there will be an error with retrieveing the name bc it will get the old one or crash if doesnt exist
  //NOTE: ONLY CALL CREATE IF NOTING IS SET, otherwise it deletes a new project everytiem yo go bakc and forth
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      errors: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  getNameAndDescription() {
    axios
      .get(
        "/api/manager/project/nameAndDescription/" +
          localStorage.getItem("currentProjectID")
      )
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        this.setState({
          name: res.data.name,
          description: res.data.description,
        });
      })
      .catch((err) => {
        console.log("error occured while fetching name: " + err);
      });
  }

  componentDidMount() {
    //TODO: this must be done on the page that appears before this and delete it when main controller unmounte
    // if (localStorage.getItem("currentProjectID") !== null) {
    //   localStorage.removeItem("currentProjectID");
    // }
    this.getNameAndDescription();
  }

  onSubmit(e) {
    console.log("clicked submit");
    e.preventDefault();

    axios
      .post("/api/manager/project/name", {
        projectID: localStorage.getItem("currentProjectID"),
        name: this.state.name,
        description: this.state.description,
      })
      .then((res) => {
        console.log("receuved response submit");

        this.props.nextClicked();
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

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit} noValidate>
          <div className="container">
            <h2>Project Name</h2>
            <TextField
              name="name"
              placeholder="Project Name"
              onChange={this.onChange}
              value={this.state.name}
              maxChars={64}
              error={this.state.errors.name}
            ></TextField>
          </div>
          <div className="container">
            <h2 style={{ width: "100%", textAlign: "center" }}>Description</h2>

            <TextAreaDescription
              description="What was this project about?"
              onChange={this.handleDescriptionChange}
              value={this.state.description}
              maxChars={500}
              error={this.state.errors.description}
            ></TextAreaDescription>
          </div>

          <div className="simple-container center-justified ">
            <button className="button" type="submit">
              Save and Continue
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  manager: state.manager,
  auth: state.auth,
});

export default connect(mapStateToProps, { createProjectName })(
  ProjectSetupName
);
