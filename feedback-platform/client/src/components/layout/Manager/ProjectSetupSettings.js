import React, { Component } from "react";
import Cell from "../../display/Cell";
import Checkbox from "../../display/Checkbox";
import {
  addSettingsToProject,
  saveProject,
} from "../../../actions/managerActions";
import { connect } from "react-redux";
import axios from "axios";

///TODO: add feature later where you can save w/o publishing and one where you can save and publish right away
//MAKE IT SO THAT EACH MEASURE HAS AN OPTION WHERE YOU CAN COMMENT ON IT OR NOT
class ProjectSetupSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLive: false,
      canViewComments: false,
    };
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  onCheckboxChange({ target }) {
    this.setState((s) => ({ ...s, [target.name]: !s[target.name] }));
  }

  getSettingValues() {
    axios
      .get(
        "/api/manager/project/settings/" +
          localStorage.getItem("currentProjectID")
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          isLive: res.data.isLive,
          canViewComments: res.data.canViewComments,
        });
      })
      .catch((err) => console.log(err));
  }

  handleSave() {
    //create post obj with that name
    const postObj = {
      projectID: localStorage.getItem("currentProjectID"),
      isLive: this.state.isLive,
      canViewComments: this.state.canViewComments,
    };
    this.props.addSettingsToProject(postObj, this.props.history);
    //TODO: error note note saving, remake the user object so that it has
    //participatedProjects:[refs] and createdProjects:[]
    this.props.saveProject(
      {
        projectID: localStorage.getItem("currentProjectID"),
        currUser: this.props.auth.user.id,
      },
      this.props.directToHome
    );
  }

  componentDidMount() {
    this.getSettingValues();
  }
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <div className="container">
          <Cell
            key={0}
            title={"Live Updates"}
            description={
              "Employees can see their feedback as soon as it comes in"
            }
            // onClick={() => this.handler(employee._id)}
            rightSide={
              <Checkbox
                name="isLive"
                value={this.state.isLive}
                onChange={this.onCheckboxChange}
                checked={this.state.isLive}
              ></Checkbox>
            }
          ></Cell>
          <Cell
            key={1}
            title={"Comment View"}
            description={
              "Employees can see what their colleagues commented about them in an anonymous manner"
            }
            // onClick={() => this.handler(employee._id)}
            rightSide={
              <Checkbox
                name="canViewComments"
                value={this.state.canViewComments}
                onChange={this.onCheckboxChange}
                checked={this.state.canViewComments}
              ></Checkbox>
            }
          ></Cell>
        </div>

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
          <button className="button" type="submit" onClick={this.handleSave}>
            Save and Finish
          </button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, { addSettingsToProject, saveProject })(
  ProjectSetupSettings
);
