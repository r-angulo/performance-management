import React from "react";
import "../../css/cell.css";

const Cell = (props) => {
  return (
    <div className="cell" onClick={props.onClick} style={props.style}>
      <div className="side-detail">
        {props.leftSide ? (
          props.leftSide
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              style={{ width: "50%", textAlign: "center" }}
            >
              <path
                d="M 6 2 C 2.6983746 2 0 4.6983746 0 8 L 0 37 C 0 40.301625 2.6983746 43 6 43 L 19 43 L 50 43 L 50 7 L 11.796875 7 C 11.301478 4.1897314 8.9473666 2 6 2 z M 6 4 C 8.2203746 4 10 5.7796254 10 8 L 10 32.544922 C 8.9362117 31.588387 7.5355045 31 6 31 C 4.4644955 31 3.0637883 31.588387 2 32.544922 L 2 8 C 2 5.7796254 3.7796254 4 6 4 z M 12 9 L 48 9 L 48 41 L 19 41 L 6 41 C 3.7796254 41 2 39.220375 2 37 C 2 34.779625 3.7796254 33 6 33 C 8.2203746 33 10 34.779625 10 37 L 12 37 L 12 9 z M 35 15 L 37.792969 17.792969 L 32.5 23.085938 L 27.044922 17.630859 L 18.341797 25.248047 L 19.658203 26.751953 L 26.955078 20.369141 L 32.5 25.914062 L 39.207031 19.207031 L 42 22 L 42 15 L 35 15 z M 17 32 L 17 34 L 42 34 L 42 32 L 17 32 z"
                fill="dodgerblue"
                font-weight="400"
                font-family="sans-serif"
                white-space="normal"
                overflow="visible"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="center-detail">
        <div className="cell-title">{props.title}</div>
        <div className="cell-description">{props.description}</div>
      </div>
      <div className="side-detail">{props.rightSide}</div>
    </div>
  );
};

export default Cell;
