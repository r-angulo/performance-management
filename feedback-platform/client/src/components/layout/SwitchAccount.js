import React, { Component } from "react";
import { connect } from "react-redux";
import TextField from "../display/TextField";
import { loginUser } from "../../actions/authActions";
import { updateNavTitle } from "../../actions/navActions";

//todo keep in mind siwthc tovegular emplotedd
//also re use this with login
//TODO: only show those which
class SwitchAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      accountLevel: "",
    };

    this.onChange = this.onChange.bind(this);
    this.switchAccount = this.switchAccount.bind(this);
  }

  switchAccount(accountLevel) {
    this.setState({ accountLevel: accountLevel }, () => {
      const userData = {
        email: this.props.auth.user.email,
        password: this.state.password,
        accountLevel: this.state.accountLevel,
      };
      console.log(userData);
      this.props.loginUser(userData, this.props.history); //we are calling dispatch using the loginUser function that was passed into the props for this componnet
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  }

  componentDidMount() {
    console.log("adminLevels");
    console.log(this.props.auth.user.currentAccountLevel);
    const { currentAccountLevel } = this.props.auth.user;
    console.log("currentAccountLevel");
    console.log(currentAccountLevel);
    if (currentAccountLevel === "employee") {
      this.setState({ employee: true });
    } else if (currentAccountLevel === "manager") {
      this.setState({ manager: true });
    } else if (currentAccountLevel === "admin") {
      this.setState({ admin: true });
    }
    this.props.updateNavTitle("Switch Account Level");
  }

  render() {
    const enabled = this.state.password.length > 0;
    return (
      <React.Fragment>
        <div className="container" style={{ flexWrap: "wrap" }}>
          <button
            style={{ width: "100%", margin: "10px" }}
            className="button inverted-button"
            onClick={() => {
              this.props.history.push("/home");
            }}
          >
            Continue as {this.props.auth.user.currentAccountLevel}
          </button>
        </div>
        <div className="container">
          <h2>Enter password to switch level</h2>
          <TextField
            name="password"
            type="password"
            placeholder="password"
            onChange={this.onChange}
            value={this.state.password}
          ></TextField>
          {Object.values(this.props.auth.user.accountLevels).indexOf(
            "employee"
          ) > -1 && "employee" != this.props.auth.user.currentAccountLevel ? (
            <button
              className="button"
              style={{
                backgroundColor: "dodgerblue",
                width: "100%",
                margin: "10px",
                display: enabled ? "block" : "none",
              }}
              onClick={() => {
                this.switchAccount("employee");
              }}
              disabled={!enabled}
            >
              Switch to regular employee
            </button>
          ) : null}
          {Object.values(this.props.auth.user.accountLevels).indexOf(
            "manager"
          ) > -1 && "manager" != this.props.auth.user.currentAccountLevel ? (
            <button
              className="button"
              style={{
                backgroundColor: "dodgerblue",
                width: "100%",
                margin: "10px",
                display: enabled ? "block" : "none",
              }}
              onClick={() => {
                this.switchAccount("manager");
              }}
              disabled={!enabled}
            >
              Switch to manager
            </button>
          ) : null}
          {Object.values(this.props.auth.user.accountLevels).indexOf("admin") >
            -1 && "admin" != this.props.auth.user.currentAccountLevel ? (
            <button
              className="button"
              style={{
                backgroundColor: "dodgerblue",
                width: "100%",
                margin: "10px",
                display: enabled ? "block" : "none",
              }}
              onClick={() => {
                this.switchAccount("admin");
              }}
              disabled={!enabled}
            >
              Switch to admin
            </button>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, { loginUser, updateNavTitle })(
  SwitchAccount
);
