import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { updateNavTitle } from "../../actions/navActions";

//TODO: major problem when user refereshed it loggs them out
// https://levelup.gitconnected.com/using-jwt-in-your-react-redux-app-for-authorization-d31be51a50d2
///NOTE SECURITY BREACH USER CAN CREAT THEIR OWN TOKEN NAMED THE SAME AND LOGIN TO BACK END HOW TO SALVE
class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/login");
  }

  onSwitchClick(e) {
    e.preventDefault();
    this.props.history.push("/switch");
  }

  componentDidMount() {
    this.props.updateNavTitle("Account Settings");
  }

  render() {
    let switchAccount = null;
    console.log("Account props");
    console.log(this.props);
    if (
      Object.values(this.props.auth.user.accountLevels).indexOf("manager") >
        -1 ||
      Object.values(this.props.auth.user.accountLevels).indexOf("admin") > -1
    ) {
      switchAccount = (
        <button
          className="button inverted-button"
          style={{
            backgroundColor: "dodgerblue",
            width: "100%",
            margin: "10px",
          }}
          onClick={this.onSwitchClick.bind(this)}
        >
          Switch Account Type{" "}
        </button>
      );
    }
    return (
      <div className="container">
        <h1 style={{ width: "100%", textAlign: "center" }}>
          Account Information
        </h1>
        <h2 style={{ width: "100%", textAlign: "center" }}>
          {"Name: " +
            this.props.auth.user.firstName +
            " " +
            this.props.auth.user.lastName}
        </h2>

        <h2 style={{ width: "100%", textAlign: "center" }}>
          {"email: " + this.props.auth.user.email}
        </h2>

        {switchAccount}
        <button
          className="button inverted-button"
          style={{ backgroundColor: "#ff4d4d", width: "100%", margin: "10px" }}
          onClick={this.onLogoutClick.bind(this)}
        >
          LOGOUT
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  nav: state.nav,
});

export default connect(mapStateToProps, { logoutUser, updateNavTitle })(
  Account
);
