import React, { Component } from "react";
import { connect } from "react-redux";

import TextField from "../../display/TextField";
import Checkbox from "../../display/Checkbox";
import { Prompt } from "react-router";
import axios from "axios";
import { header } from "express-validator";
import { v4 as uuid } from "uuid";
import { updateNavTitle } from "../../../actions/navActions";

var validator = require("validator");

//TODO: how to add more rows after component did mount while keeping same data
//TODO: create random password
//TODO: update only filled in cells
//TODO: make sure keyid is right, old mainatsins state
//TODO: make this prevStte
//TODO: create x new employees, only employees that have been filled in
//TODO: make sure you only tell user validate to finish filling out a row
//16personalities autoscroll when finish one
//TELL USER NOT TO LEAVE PAGE WHILE UPLOADING, delete
//Todo: add route to this and to the csv version
//TODO: only make the x appear if error from db, green if if passes all checks and is uploaded, then disable firelds
//TODO: animate disapper
//TODO: how to check if email already exists
class CreateManyNewAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newEmployeeData: [],
      numRows: 10,
    };
    this.onNumberChange = this.onNumberChange.bind(this);
    this.createNewRows = this.createNewRows.bind(this);
    this.submitted = this.submitted.bind(this);
  }

  componentDidMount() {
    let newArr = [];
    for (let i = 0; i < 5; i++) {
      newArr.push({
        keyid: uuid(),
        firstName: "",
        lastName: "",
        email: "",
        manager: false,
        admin: false,
        state: "editing",
        errors: {},
      });
    }
    this.setState({ newEmployeeData: newArr });
    this.props.updateNavTitle("Create Multiple New Accounts");
  }

  onChange(keyid, e) {
    let arr = this.state.newEmployeeData.map((obj) =>
      obj.keyid === keyid
        ? Object.assign(obj, {
            [e.target.name]: validator.trim(e.target.value),
          })
        : obj
    );
    this.setState({ newEmployeeData: arr });
  }

  handleToggle(keyid, e) {
    console.log(keyid, e.target.name);
    // this.setState((s) => ({ ...s, [target.name]: !s[target.name] }));
    let arr = this.state.newEmployeeData.map((obj) =>
      obj.keyid === keyid
        ? Object.assign(obj, { [e.target.name]: !obj[e.target.name] })
        : obj
    );
    this.setState({ newEmployeeData: arr });
  }
  onNumberChange(e) {
    console.log(this.state.numRows);
    this.setState({ numRows: e.target.value });
  }

  createNewRows() {
    let newArr = [];
    for (let i = 0; i < this.state.numRows; i++) {
      newArr.push({
        keyid: uuid(),
        firstName: "",
        lastName: "",
        email: "",
        manager: false,
        admin: false,
        state: "editing",
        errors: {},
      });
    }
    this.setState({
      newEmployeeData: [...this.state.newEmployeeData, ...newArr],
    });
  }

  submitted(e) {
    // this.state.newEmployeeData.forEach((formElement) => {
    //   if (
    //     formElement.firstName !== "" &&
    //     formElement.lastName !== "" &&
    //     formElement.email !== ""
    //   ) {
    //     var newObj = {
    //       firstName: formElement.firstName,
    //       lastName: formElement.lastName,
    //       email: formElement.email,
    //       password: "123456",
    //       manager: formElement.manager,
    //       admin: formElement.admin,
    //     };
    //     this.registerUser(newObj,formElement.keyid);
    //   }
    // });

    //change symbol
    let arr = this.state.newEmployeeData.map((employee) => {
      if (
        !validator.isEmpty(employee.firstName) &&
        !validator.isEmpty(employee.lastName) &&
        !validator.isEmpty(employee.email)
      ) {
        employee.state = "uploading";
        employee.errors = {};
      }
      return employee;
    });
    this.setState({ newEmployeeData: arr });

    //validate
    let _newEmployeeData = this.state.newEmployeeData;
    _newEmployeeData.forEach((employee, index) => {
      if (
        employee.firstName !== "" &&
        employee.lastName !== "" &&
        employee.email !== ""
      ) {
        //do validation in here
        if (!validator.isEmail(employee.email)) {
          _newEmployeeData[index].errors["email"] = "Invalid Email";
        }

        if (!validator.isLength(employee.firstName, { min: 3, max: 32 })) {
          _newEmployeeData[index].errors["firstName"] =
            "Must be 3-32 characters long";
        }
        if (!validator.isLength(employee.lastName, { min: 3, max: 32 })) {
          _newEmployeeData[index].errors["lastName"] =
            "Must be 3-32 characters long";
        }

        if (validator.isEmpty(employee.firstName)) {
          _newEmployeeData[index].errors["firstName"] = "First Name Required";
        }
        if (validator.isEmpty(employee.lastName)) {
          _newEmployeeData[index].errors["lastName"] = "Last Name Required";
        }
        if (validator.isEmpty(employee.email)) {
          _newEmployeeData[index].errors["email"] = "Email Required";
        }
        //passed all test
        if (
          Object.keys(_newEmployeeData[index].errors).length === 0 &&
          _newEmployeeData[index].errors.constructor === Object
        ) {
          var newObj = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: "123456",
            manager: employee.manager,
            admin: employee.admin,
          };
          this.registerUser(newObj, employee.keyid);
        } else {
          _newEmployeeData[index].state = "failed";
        }
      }
    });
    this.setState({ newEmployeeData: _newEmployeeData });
  }

  registerUser(userData, uuid) {
    axios
      .post("/api/admin/registerEmployee", userData)
      .then((res) => {
        let _newEmployeeData = this.state.newEmployeeData;
        _newEmployeeData = _newEmployeeData.filter((employee) => {
          return employee.keyid !== uuid;
        });
        this.setState({ newEmployeeData: _newEmployeeData });
      })
      .catch((err) => {
        let arr = this.state.newEmployeeData.map((employee) => {
          if (employee.keyid === uuid) {
            employee.state = "dbfailed";
            Object.keys(err.response.data).forEach((key) => {
              console.log(key, err.response.data[key]);
              employee.errors[key] = err.response.data[key];
            });
          }
          return employee;
        });
        this.setState({ newEmployeeData: arr });
      });
  }

  clearData(id) {
    this.setState((state, props) => ({
      newEmployeeData: state.newEmployeeData.map((employee) => {
        if (employee.keyid === id) {
          return {
            keyid: employee.keyid,
            firstName: "",
            lastName: "",
            email: "",
            manager: false,
            admin: false,
            state: "editing",
            errors: {},
          };
        } else {
          return employee;
        }
      }),
    }));
  }

  render() {
    let formElements = this.state.newEmployeeData.map((employee) => {
      return (
        <div
          className="container"
          style={{ flexWrap: "nowrap", alignItems: "center" }}
          key={employee.keyid}
        >
          <TextField
            style={{ borderRadius: "0" }}
            placeholder="First Name"
            name="firstName"
            onChange={(e) => {
              this.onChange(employee.keyid, e);
            }}
            width={"25%"}
            value={employee.firstName}
            error={employee.errors.firstName}
          ></TextField>
          <TextField
            style={{ borderRadius: "0" }}
            width={"25%"}
            placeholder="Last Name"
            name="lastName"
            onChange={(e) => {
              this.onChange(employee.keyid, e);
            }}
            value={employee.lastName}
            error={employee.errors.lastName}
          ></TextField>
          <TextField
            style={{ borderRadius: "0" }}
            placeholder="Email"
            width={"25%"}
            name="email"
            onChange={(e) => {
              this.onChange(employee.keyid, e);
            }}
            error={employee.errors.email}
            value={employee.email}
          ></TextField>
          <Checkbox
            name="manager"
            value="true"
            onChange={(e) => {
              this.handleToggle(employee.keyid, e);
            }}
            checked={employee.manager}
            style={{ width: "10%" }}
          ></Checkbox>
          <Checkbox
            name="admin"
            value="true"
            onChange={(e) => {
              this.handleToggle(employee.keyid, e);
            }}
            checked={employee.admin}
            style={{ width: "10%" }}
          ></Checkbox>
          {employee.state === "editing" && (
            <div
              style={{
                height: "35px",
                width: "35px",
              }}
              onClick={() => {
                this.clearData(employee.keyid);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="#dadee2"
                  d="M53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 96H32zm47.18-221.47l84-81.59c8.84-8.59 23.61-2.24 23.61 10.47v41.67c82.47.8 144 18.36 144 103.92 0 34.29-20.14 68.26-42.41 86-6.95 5.54-16.85-1.41-14.29-10.4 23.08-80.93-6.55-101.74-87.3-102.72v44.69c0 12.69-14.76 19.07-23.61 10.47l-84-81.59a14.69 14.69 0 0 1-.13-20.79l.13-.13z"
                ></path>
                <path
                  fill="#adb5bd"
                  d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM208 216.08v-41.67c0-12.71-14.77-19.06-23.61-10.47l-84 81.59a14.7 14.7 0 0 0-.15 20.79l.15.15 84 81.59c8.85 8.6 23.61 2.22 23.61-10.47V292.9c80.75 1 110.38 21.79 87.3 102.72-2.56 9 7.34 15.94 14.29 10.4C331.86 388.26 352 354.29 352 320c0-85.56-61.53-103.12-144-103.92z"
                ></path>
              </svg>
            </div>
          )}
          {employee.state === "uploading" && (
            <div
              style={{
                height: "45px",
                width: "45px",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path
                  fill="#adb5bd"
                  d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z"
                ></path>
              </svg>
            </div>
          )}
          {employee.state === "failed" && (
            <div
              style={{
                // height: "20px",
                width: "45px",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  fill="red"
                  d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm42-104c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42zm-81.37-211.401l6.8 136c.319 6.387 5.591 11.401 11.985 11.401h41.17c6.394 0 11.666-5.014 11.985-11.401l6.8-136c.343-6.854-5.122-12.599-11.985-12.599h-54.77c-6.863 0-12.328 5.745-11.985 12.599z"
                ></path>
              </svg>
            </div>
          )}

          {employee.state === "dbfailed" && (
            <div
              style={{
                width: "32px",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
                <path
                  fill="red"
                  d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      );
    });
    return (
      <React.Fragment>
        <div className="container">
          <h1 style={{ width: "100%", textAlign: "center" }}>
            Register many accounts at once
          </h1>
          <h4 style={{ width: "100%", textAlign: "center" }}>
            *(passwords will be auto-generated)
          </h4>
        </div>
        <div className="container" style={{ borderRadius: "0" }}>
          <div style={{ width: "25%", textAlign: "center" }}>First Name</div>
          <div style={{ width: "25%", textAlign: "center" }}>Last Name</div>
          <div style={{ width: "25%", textAlign: "center" }}>Email</div>
          <div style={{ width: "10%", textAlign: "center" }}>Manager</div>
          <div style={{ width: "10%", textAlign: "center" }}>Admin</div>
        </div>
        {formElements}
        <div className="container">
          <h3 style={{ width: "100%", textAlign: "center" }}>Add New Rows</h3>
          <input
            type="number"
            min={0}
            onChange={this.onNumberChange}
            value={this.state.numRows}
            style={{
              width: "80%",
              height: "50px",
              textAlign: "center",
              fontSize: "1.2em",
              fontWeight: "bold",
              backgroundColor: "rgb(189,189,189)",
              border: "3px solid black",
            }}
          />
          <button
            className="button"
            style={{
              height: "50px",
              margin: "10px",
            }}
            onClick={this.createNewRows}
          >
            Add!
          </button>
        </div>

        <div className="simple-container">
          <button
            type="button"
            className="button inverted-button"
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            Go Back
          </button>{" "}
          <button
            className="button"
            onClick={this.submitted}
            style={{ backgroundColor: "dodgerblue" }}
          >
            Create new employees
          </button>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  nav: state.nav,
});

export default connect(mapStateToProps, {
  updateNavTitle,
})(CreateManyNewAccounts);
