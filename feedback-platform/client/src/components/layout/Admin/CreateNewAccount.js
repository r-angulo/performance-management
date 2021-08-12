import React, { Component } from "react";
import TextField from "../../display/TextField";
import Checkbox from "../../display/Checkbox";
import "../../../css/checkbox.css";
import { connect } from "react-redux";
import axios from "axios";
import { updateNavTitle } from "../../../actions/navActions";

import ToggableButton from "../../display/ToggableButton";

//TODO: WHEN user clicks off the field, check for errors before it goes to db
//TODO: if users always click create random password make this the default , us ml for this
class CreateNewAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isUsingRandomPwd: false,
      manager: false,
      admin: false,
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("submit clicked");
    const userData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,

      manager: this.state.manager,
      admin: this.state.admin,
      errors: {},
    };
    console.log(userData);
    axios
      .post("/api/admin/registerEmployee", userData)
      .then((res) => {
        console.log(res);
        this.props.history.push("/editemployees");
      })
      .catch((err) => {
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

  handleToggle({ target }) {
    this.setState((s) => ({ ...s, [target.name]: !s[target.name] }));
  }

  componentDidMount() {
    this.props.updateNavTitle("Create New Account");
  }

  createRandomPassword() {
    //also clear it
    if (this.state.isUsingRandomPwd) {
      this.setState({ password: "", isUsingRandomPwd: false });
    } else {
      var length = 16,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        randPwd = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        randPwd += charset.charAt(Math.floor(Math.random() * n));
      }
      this.setState({ password: randPwd, isUsingRandomPwd: true });
    }
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

            <h2>First Name</h2>
            <TextField
              name="firstName"
              placeholder="Employees First Name"
              onChange={this.onChange}
              value={this.state.firstName}
              error={this.state.errors.firstName}
            ></TextField>

            <h2>Last Name</h2>
            <TextField
              name="lastName"
              placeholder="Employees Last Name"
              onChange={this.onChange}
              value={this.state.lastName}
              error={this.state.errors.lastName}
            ></TextField>

            <h2>Email Address</h2>
            <TextField
              name="email"
              placeholder="Employees Email"
              onChange={this.onChange}
              value={this.state.email}
              error={this.state.errors.email}
            ></TextField>

            <h2>Password</h2>
            <TextField
              name="password"
              placeholder="Employees Password"
              onChange={this.onChange}
              value={this.state.password}
              error={this.state.errors.password}
              isDisabled={this.state.isUsingRandomPwd}
              type="password"
            ></TextField>
            <ToggableButton
              title={"Generate Random Password"}
              altTitle={"Create Custom Password"}
              svgData={
                "M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"
              }
              altSvgData={
                "M528 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm8 336c0 4.411-3.589 8-8 8H48c-4.411 0-8-3.589-8-8V112c0-4.411 3.589-8 8-8h480c4.411 0 8 3.589 8 8v288zM170 270v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm-336 82v-28c0-6.627-5.373-12-12-12H82c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm384 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zM122 188v-28c0-6.627-5.373-12-12-12H82c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm96 0v-28c0-6.627-5.373-12-12-12h-28c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12zm-98 158v-16c0-6.627-5.373-12-12-12H180c-6.627 0-12 5.373-12 12v16c0 6.627 5.373 12 12 12h216c6.627 0 12-5.373 12-12z"
              }
              viewBox={"0 0 512 512"}
              altViewBox={"0 0 576 512"}
              onClick={() => {
                this.createRandomPassword();
              }}
            ></ToggableButton>
          </div>

          <div className="container">
            <h2 style={{ width: "100%", textAlign: "center" }}>
              Special Access
            </h2>
            <div className="all-checkboxes-container">
              <Checkbox
                title="Manager"
                name="manager"
                value="true"
                onChange={this.handleToggle}
                checked={this.state.manager}
              ></Checkbox>
              <Checkbox
                title="Administrator"
                name="admin"
                value="true"
                onChange={this.handleToggle}
                checked={this.state.admin}
              ></Checkbox>
            </div>
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
            </button>{" "}
            <button type="submit" className="button">
              Save and Continue
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, {
  updateNavTitle,
})(CreateNewAccount);
