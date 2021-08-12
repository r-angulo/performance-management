import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

//if there is no relationship between a manager and employee, put a message in the admins inbox to add it
//and then just make it a one click go
//TO sustain competitve advantage: make it so that we seem like experst by being the top researches and hiriing the best researchers in this field\
//CRUD score types
//TODO: create add many employees at once with random password
//csv import
//TODO: make it so that employee type in create and edit autimatically have employee
//TODO: add edit measures
class AdminHome extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          className=""
          style={{
            display: "flex",
            flexWrap: "wrap",
            paddingLeft: "0",
            maxWidth: "1200px",
            // border: "1px solid green",
            margin: "0 auto",
          }}
        >
          <div
            className=""
            style={{
              listStyleType: "none",
              // flex: "0 0 33.3333333333%",
              display: "flex",
              width: "33.333%",
              justifyContent: "center",
            }}
          >
            <div
              className="box"
              onClick={() => this.props.history.push("/register-one-employee")}
              style={{
                backgroundColor: "#232426",
                width: "75%",
                borderRadius: "30px",
                backgroundImage:
                  "linear-gradient(to bottom right,#d05e5e, #d0735e)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "75px 10px",
                boxSizing: "content-box",
                margin: "10px 0px",
                flexWrap: "wrap",
              }}
            >
              <div className="" style={{ width: "40%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <g>
                    <path
                      fill="white"
                      d="M640 224v32a16 16 0 0 1-16 16h-64v64a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-64h-64a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h64v-64a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16v64h64a16 16 0 0 1 16 16z"
                    ></path>
                    <path
                      fill="white"
                      d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm89.6 32h-16.7a174.08 174.08 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6A134.43 134.43 0 0 0 313.6 288z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                }}
              >
                Create New Account
              </div>
            </div>
          </div>

          <div
            className=""
            style={{
              listStyleType: "none",
              // flex: "0 0 33.3333333333%",
              display: "flex",
              width: "33.333%",
              justifyContent: "center",
            }}
          >
            <div
              className="box"
              onClick={() => this.props.history.push("/editemployees")}
              style={{
                backgroundColor: "#232426",
                width: "75%",
                borderRadius: "30px",
                backgroundImage:
                  "linear-gradient(to bottom right,#1abc9c, #76c3b4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "75px 10px",
                boxSizing: "content-box",
                margin: "10px 0px",
                flexWrap: "wrap",
              }}
            >
              <div className="" style={{ width: "40%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <g>
                    <path
                      fill="white"
                      d="M358.9 433.3l-6.8 61a15.92 15.92 0 0 0 17.6 17.6l60.9-6.8 137.9-137.9-71.7-71.7zM633 268.9L595.1 231a24 24 0 0 0-33.8 0l-37.8 37.8-4.1 4.1 71.8 71.7 41.8-41.8a24.08 24.08 0 0 0 0-33.9z"
                    ></path>
                    <path
                      fill="white"
                      d="M313.6 288h-16.7a174.08 174.08 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h274.9a48 48 0 0 1-2.6-21.3l6.8-60.9 1.2-11.1 85.2-85.2c-24.5-27.7-60-45.5-99.9-45.5zM224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                }}
              >
                Edit Employees
              </div>
            </div>
          </div>

          <div
            className=""
            style={{
              listStyleType: "none",
              // flex: "0 0 33.3333333333%",
              display: "flex",
              width: "33.333%",
              justifyContent: "center",
            }}
          >
            <div
              className="box"
              onClick={() =>
                this.props.history.push("/register-many-employees")
              }
              style={{
                backgroundColor: "#232426",
                width: "75%",
                borderRadius: "30px",
                backgroundImage:
                  "linear-gradient(to bottom right,#ff521b,#f3815d)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "75px 10px",
                boxSizing: "content-box",
                margin: "10px 0px",
                flexWrap: "wrap",
              }}
            >
              <div className="" style={{ width: "40%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <g>
                    <path
                      fill="white"
                      d="M96 224a64 64 0 1 0-64-64 64.06 64.06 0 0 0 64 64zm480 32h-64a63.81 63.81 0 0 0-45.1 18.6A146.27 146.27 0 0 1 542 384h66a32 32 0 0 0 32-32v-32a64.06 64.06 0 0 0-64-64zm-512 0a64.06 64.06 0 0 0-64 64v32a32 32 0 0 0 32 32h65.9a146.64 146.64 0 0 1 75.2-109.4A63.81 63.81 0 0 0 128 256zm480-32a64 64 0 1 0-64-64 64.06 64.06 0 0 0 64 64z"
                    ></path>
                    <path
                      fill="white"
                      d="M396.8 288h-8.3a157.53 157.53 0 0 1-68.5 16c-24.6 0-47.6-6-68.5-16h-8.3A115.23 115.23 0 0 0 128 403.2V432a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48v-28.8A115.23 115.23 0 0 0 396.8 288zM320 256a112 112 0 1 0-112-112 111.94 111.94 0 0 0 112 112z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                }}
              >
                Create Many New Accounts
              </div>
            </div>
          </div>

          <div
            className=""
            style={{
              listStyleType: "none",
              // flex: "0 0 33.3333333333%",
              display: "flex",
              width: "33.333%",
              justifyContent: "center",
            }}
          >
            <div
              className="box"
              onClick={() => this.props.history.push("/allmanagers")}
              style={{
                backgroundColor: "#33518c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "75px 10px",
                boxSizing: "content-box",
                width: "75%",
                borderRadius: "30px",
                backgroundImage:
                  "linear-gradient(to bottom right,#446aaf, #547d90)",
                flexWrap: "wrap",
              }}
            >
              <div className="" style={{ width: "40%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <g>
                    <path
                      fill="lightgray"
                      d="M104 320H56v-57.59A38.45 38.45 0 0 1 94.41 224H296v-64h48v64h201.59A38.46 38.46 0 0 1 584 262.41V320h-48v-48H344v48h-48v-48H104z"
                    ></path>
                    <path
                      fill="white"
                      d="M128 352H32a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h96a32 32 0 0 0 32-32v-96a32 32 0 0 0-32-32zM384 0H256a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h128a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zm224 352h-96a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h96a32 32 0 0 0 32-32v-96a32 32 0 0 0-32-32zm-240 0h-96a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h96a32 32 0 0 0 32-32v-96a32 32 0 0 0-32-32z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                }}
              >
                Edit Hierarchy
              </div>
            </div>
          </div>
          <div
            className=""
            style={{
              listStyleType: "none",
              // flex: "0 0 33.3333333333%",
              display: "flex",
              width: "33.333%",
              justifyContent: "center",
            }}
          >
            <div
              className="box"
              onClick={() => this.props.history.push("/createmeasure")}
              style={{
                backgroundColor: "#33518c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "75px 10px",
                boxSizing: "content-box",
                width: "75%",
                borderRadius: "30px",
                backgroundImage:
                  "linear-gradient(to bottom right,#9b59b6,#a175b3)",
                flexWrap: "wrap",
              }}
            >
              <div className="" style={{ width: "40%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path
                    fill="white"
                    d="M635.7 179.2L543.2 16.3c-7.6-13.5-26.5-22-43.7-11.9L16 288.3c-15.3 9-20.6 28.9-11.7 44.5l92.5 162.9c7.6 13.4 26.5 22 43.7 11.9L624 223.7c15.3-9 20.5-28.9 11.7-44.5zm-505.4 278L53.9 322.5l46-27 34.2 60.3c2.2 3.9 7.1 5.2 10.9 3l26.6-15.6c3.8-2.2 5.1-7.2 2.9-11.1l-34.2-60.3 40.4-23.7 18.7 32.9c2.2 3.9 7.1 5.2 10.9 3l26.6-15.6c3.8-2.2 5.1-7.2 2.9-11.1l-18.7-32.9 40.4-23.7 34.2 60.3c2.2 3.9 7.1 5.2 10.9 3l26.6-15.6c3.8-2.2 5.1-7.2 2.9-11.1L302 176.8l40.4-23.7 18.7 32.9c2.2 3.9 7.1 5.2 10.9 3l26.6-15.6c3.8-2.2 5.1-7.2 2.9-11.1l-18.7-32.9 40.4-23.7 34.2 60.3c2.2 3.9 7.1 5.2 10.9 3l26.6-15.6c3.8-2.2 5.1-7.2 2.9-11.1L463.6 82l46-27 76.5 134.7-455.8 267.5z"
                    class=""
                  ></path>
                </svg>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                }}
              >
                Create New Measure
              </div>
            </div>
          </div>

          <div
            className=""
            style={{
              listStyleType: "none",
              // flex: "0 0 33.3333333333%",
              display: "flex",
              width: "33.333%",
              justifyContent: "center",
            }}
          >
            <div
              className="box"
              // onClick={() => this.props.history.push("/createmeasure")}
              style={{
                backgroundColor: "#232426",
                backgroundImage:
                  "linear-gradient(to bottom right,#FC5C7D,#b37085)",
                width: "75%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "75px 10px",
                boxSizing: "content-box",
                margin: "10px 0px",
                flexWrap: "wrap",
                borderRadius: "30px",
                backgroundColor: "#33518c",
              }}
            >
              <div className="" style={{ width: "40%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <g>
                    <path
                      fill="white"
                      d="M138.25 127.05a7.92 7.92 0 0 1-11.2 0l-11.21-11.21a7.92 7.92 0 0 1 0-11.21L177.5 43 143.87 9.3A31.73 31.73 0 0 0 99 9.3L9.29 99a31.74 31.74 0 0 0 0 44.86l100.17 100.19L244 109.49l-44.08-44.12zm364.46 241.1l-33.63-33.64-61.68 61.68a7.92 7.92 0 0 1-11.21 0L385 385a7.92 7.92 0 0 1 0-11.21l61.68-61.68L402.52 268 267.94 402.51l100.21 100.2a31.7 31.7 0 0 0 44.85 0L502.71 413a31.72 31.72 0 0 0 0-44.85z"
                    ></path>
                    <path
                      fill="white"
                      d="M497.94 59.32l-45.25-45.25a48.05 48.05 0 0 0-67.95 0l-46 46 113.21 113.2 46-46a48 48 0 0 0-.01-67.95zM19.08 379.68L.33 487.12a21.23 21.23 0 0 0 24.59 24.56l107.45-18.84 296.92-296.93L316.08 82.72z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                }}
              >
                Edit Measures
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AdminHome);
//TODO: later make it so that it looks like real css but keep in mind css is affected level wide
