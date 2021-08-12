import React, { Component } from "react";

import axios from "axios";
import Cell from "../../display/Cell";
import Spinner from "../../display/Spinner";

//todo: add search
export default class ManagersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allManagers: [],
      isLoading: true,
    };
  }

  getManagers() {
    axios
      .get("/api/admin/allmanagers")
      .then((res) => {
        this.setState({ allManagers: res.data, isLoading: false });
      })
      .catch((err) =>
        console.log("error occured while getting managers" + err)
      );
  }

  componentWillMount() {
    this.getManagers();
  }

  render() {
    let managerElements = this.state.allManagers.map((manager) => {
      return (
        <Cell
          key={manager.id}
          title={manager.fullName}
          description={manager.email}
          data-index={manager.id}
          onClick={() => this.props.history.push("/subordinates/" + manager.id)}
          leftSide={
            <div style={{ textAlign: "center" }}>
              <svg
                style={{ width: "50%" }}
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="user-alt"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-user-alt fa-w-16 fa-9x"
              >
                <path
                  fill="currentColor"
                  d="M384 336c-40.6 0-47.6-1.5-72.2 6.8-17.5 5.9-36.3 9.2-55.8 9.2s-38.3-3.3-55.8-9.2c-24.6-8.3-31.5-6.8-72.2-6.8C57.3 336 0 393.3 0 464v16c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-16c0-70.7-57.3-128-128-128zm80 128H48c0-21.4 8.3-41.5 23.4-56.6C86.5 392.3 106.6 384 128 384c41.1 0 41-1.1 56.8 4.2 23 7.8 47 11.8 71.2 11.8 24.2 0 48.2-4 71.2-11.8 15.8-5.4 15.7-4.2 56.8-4.2 44.1 0 80 35.9 80 80zM256 320c88.4 0 160-71.6 160-160S344.4 0 256 0 96 71.6 96 160s71.6 160 160 160zm0-272c61.8 0 112 50.2 112 112s-50.2 112-112 112-112-50.2-112-112S194.2 48 256 48z"
                  class=""
                ></path>
              </svg>
            </div>
          }
        ></Cell>
      );
    });
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ width: "100%" }}>Managers</h1>
          <h3>Select a manager to add or remove to their subordinates list</h3>
        </div>
        <div className="container">
          {this.state.isLoading ? <Spinner></Spinner> : managerElements}
        </div>
      </div>
    );
  }
}
