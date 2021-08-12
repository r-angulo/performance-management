import React, { Component } from "react";
import TextField from "../../display/TextField";
import Checkbox from "../../display/Checkbox";
import "../../../css/checkbox.css";
import { getEmployeeData } from "../../../actions/adminActions";
import { updateNavTitle } from "../../../actions/navActions";
import axios from "axios";

import { connect } from "react-redux";
import Spinner from "../../display/Spinner";

//TODO: DELETE employee and and project information they were involved in
//TODO: nothing is done for changing password
//TODO: note backend doesnt check if actual email already exists with another use but needs to take into account this user, or original email

//TODO: find a way to do the isloading and make it work, note if checkinmg for === "" then wil lload when user retypes in name
class EditEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      // employee: false,
      manager: false,
      admin: false,
      _id: "",
      errors: {},
      isLoading: true,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("submit clicked");
    const userData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      // employee: this.state.employee,
      manager: this.state.manager,
      admin: this.state.admin,
      _id: this.state._id,
    };

    axios
      .post(`/api/admin/updateemployee/${userData._id}`, userData)
      .then((res) => {
        console.log(res);
        this.props.history.push("/editemployees");
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

  handleDelete() {}

  componentDidMount() {
    // this.props.getEmployeeData(this.props.match.params.id);
    axios
      .get(`/api/admin/employeedata/${this.props.match.params.id}`)
      .then((res) => {
        console.log("res");
        console.log(res);
        this.setState(
          {
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            _id: res.data._id,
          },
          () => {
            if (
              res.data.email !== undefined ||
              res.data.email !== null ||
              res.data.email.trim().length !== 0
            ) {
              console.log("not emplty props");
              console.log(res.data.email);
              this.setState({ isLoading: false });
            }
          }
        );

        if (res.data.levels != undefined) {
          if (res.data.levels.includes("manager")) {
            this.setState({ manager: true });
          } else {
            this.setState({ manager: false });
          }
        }
        if (res.data.levels != undefined) {
          if (res.data.levels.includes("admin")) {
            this.setState({ admin: true });
          } else {
            this.setState({ admin: false });
          }
        }
      })
      .catch((err) => {
        console.log("could not get data for this employee");
      });

    this.props.updateNavTitle("Edit Employee");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleToggle({ target }) {
    this.setState((s) => ({ ...s, [target.name]: !s[target.name] }));
  }

  // todo: add picture
  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.onSubmit} noValidate>
          <div className="container">
            <h2 style={{ width: "100%", textAlign: "center" }}>
              Employee Information
            </h2>

            {this.state.isLoading ? (
              <Spinner></Spinner>
            ) : (
              <React.Fragment>
                <h2 style={{ width: "100%", textAlign: "center" }}>
                  First Name
                </h2>
                <TextField
                  name="firstName"
                  placeholder="Employees First Name"
                  onChange={this.onChange}
                  value={this.state.firstName}
                  error={this.state.errors.firstName}
                ></TextField>

                <h2 style={{ width: "100%", textAlign: "center" }}>
                  Last Name
                </h2>
                <TextField
                  name="lastName"
                  placeholder="Employees Last Name"
                  onChange={this.onChange}
                  value={this.state.lastName}
                  error={this.state.errors.lastName}
                ></TextField>

                <h2 style={{ width: "100%", textAlign: "center" }}>
                  Email Address
                </h2>
                <TextField
                  name="email"
                  placeholder="Employees email Name"
                  onChange={this.onChange}
                  value={this.state.email}
                  error={this.state.errors.email}
                ></TextField>
              </React.Fragment>
            )}
          </div>

          <div className="container">
            <h2 style={{ width: "100%", textAlign: "center" }}>
              Employee Type
            </h2>
            {this.state.isLoading ? (
              <Spinner></Spinner>
            ) : (
              <div className="all-checkboxes-container">
                <Checkbox
                  title="Manager"
                  name="manager"
                  value={this.state.manager}
                  onChange={this.handleToggle}
                  checked={this.state.manager}
                ></Checkbox>
                <Checkbox
                  title="Administrator"
                  name="admin"
                  value="true"
                  value={this.state.admin}
                  onChange={this.handleToggle}
                  checked={this.state.admin}
                ></Checkbox>
              </div>
            )}
          </div>

          <div className="simple-container  ">
            <button
              type="button"
              className="button inverted-button"
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              Go Back
            </button>
            {!this.state.isLoading && (
              <button type="submit" className="button">
                Update
              </button>
            )}
          </div>

          <div className="container" style={{ marginTop: "100px" }}>
            <button
              onClick={this.handleDelete}
              type="button"
              className="button"
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "3px solid white",
              }}
            >
              DELETE Employee
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
  nav: state.nav,
});

export default connect(mapStateToProps, {
  getEmployeeData,
  updateNavTitle,
})(EditEmployee);
