import React, { Component } from "react";
import { loginUser } from "../../actions/authActions";
import { connect } from "react-redux";
import TextField from "../display/TextField";
import axios from "axios";
import RadioButton from "../display/RadioButton";
import { updateNavTitle } from "../../actions/navActions";

//TODO: strip white spaces
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",

      passedEmail: false,
      levels: [],
      isManager: false,
      isAdmin: false,
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("submit clicked");
    let accountLevel = null;
    if (this.state.isManager) {
      accountLevel = "manager";
    } else if (this.state.isAdmin) {
      accountLevel = "admin";
    } else {
      accountLevel = "employee";
    }

    const userData = {
      email: this.state.email,
      password: this.state.password,
      accountLevel: accountLevel,
    };
    this.props.loginUser(userData, this.props.history); //we are calling dispatch using the loginUser function that was passed into the props for this componnet
    console.log(userData);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      //when this login componebt appears if the user is autenticated, set the user to dashboard
      this.props.history.push("/home");
    }
    this.props.updateNavTitle("Login");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      //if user is granted login, then send them to dashboard
      this.props.history.push("/home");
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  checkEmail(e) {
    console.log("check email clicked");
    console.log(this.state.email);
    if (this.state.email === "") {
      this.setState({
        errors: { ...this.state.errors, email: "Email is required" },
      });
    } else {
      axios
        .get("/api/shared/emailexists?email=" + this.state.email)
        .then((res) => {
          console.log("res.data");
          console.log(res);

          if (res.data.levels) {
            console.log(res.data.levels);
            this.setState({
              errors: { ...this.state.errors, email: "" },
              levels: res.data.levels,
              passedEmail: true,
            });
          }
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

  toggleRadio(value) {
    if (value === "manager") {
      if (this.state.isAdmin) {
        this.setState({ isAdmin: false });
      }

      this.setState({ isManager: !this.state.isManager });
    }
    if (value === "admin") {
      if (this.state.isManager) {
        this.setState({ isManager: false });
      }
      this.setState({ isAdmin: !this.state.isAdmin });
    }
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.passedEmail && (
          <div className="container" style={{ width: "50%" }}>
            <h2>Email</h2>
            <TextField
              name="email"
              placeholder="Email"
              onChange={this.onChange}
              value={this.state.email}
              error={this.state.errors.email}
            ></TextField>

            <button className="button" onClick={this.checkEmail}>
              Next
            </button>
          </div>
        )}
        {this.state.passedEmail && (
          <div className="container" style={{ width: "50%" }}>
            <h2 style={{ width: "100%", textAlign: "center" }}>
              Email: {this.state.email}
            </h2>
            <h2>Password</h2>
            <TextField
              name="password"
              placeholder="Password"
              onChange={this.onChange}
              value={this.state.password}
              error={this.state.errors.password}
            ></TextField>
            {(this.state.levels.includes("manager") ||
              this.state.levels.includes("admin")) && <h2>Special Access: </h2>}
            {this.state.levels.includes("manager") && (
              <RadioButton
                checked={this.state.isManager}
                title={"Manager"}
                onClick={() => this.toggleRadio("manager")}
              ></RadioButton>
            )}
            {this.state.levels.includes("admin") && (
              <RadioButton
                checked={this.state.isAdmin}
                title={"Admin"}
                onClick={() => this.toggleRadio("admin")}
              ></RadioButton>
            )}
            <button className="button" onClick={this.onSubmit}>
              Login
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, { loginUser, updateNavTitle })(Login);
