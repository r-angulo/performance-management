import React, { Component } from "react";
import "../../../css/navbar.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// look into this
//https://stackoverflow.com/questions/57232965/what-is-the-correct-way-to-change-navbar-values-in-react-based-on-if-user-is-log
//TODO: redux refresh will delete page title save in localstorage
class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuIsDisplayed: true,
      pageTitle: "Undefined",
    };

    this.handleMenuClicked = this.handleMenuClicked.bind(this);
  }

  componentDidMount() {
    if (window.innerWidth < 600) {
      this.setState({ menuIsDisplayed: false });
    }
  }

  componentWillReceiveProps(newProps) {
    //after redux gets new state props this will be called if they are mapped
    console.log("navbar received new props: ");
    console.log(newProps.nav.pageTitle);
    this.setState({ pageTitle: newProps.nav.pageTitle });
    this.forceUpdate(); //forces update when user authenticates
  }

  handleMenuClicked() {
    if (window.innerWidth < 600) {
      this.setState({ menuIsDisplayed: !this.state.menuIsDisplayed });
    }
    window.location.reload();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div className="nav-container">
        {this.state.menuIsDisplayed && isAuthenticated && (
          <div className="nav-item" id="nav-1">
            <Link
              to="/home"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              Home
            </Link>
          </div>
        )}

        <div className="nav-item" id="nav-2" onClick={this.handleMenuClicked}>
          <h1>{this.state.pageTitle}</h1>
        </div>

        {this.state.menuIsDisplayed && isAuthenticated && (
          <div className="nav-item" id="nav-3">
            <Link
              to="/account"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              Account
            </Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
  auth: state.auth,
});

export default connect(mapStateToProps, null)(NavBar);
