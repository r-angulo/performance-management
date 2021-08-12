import React, { Component } from "react";

class ToggableButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayingAlt: false,
    };
  }
  toggleState() {
    this.setState({ isDisplayingAlt: !this.state.isDisplayingAlt });
  }
  render() {
    const {
      title,
      altTitle,
      svgData,
      altSvgData,
      viewBox,
      altViewBox,
      onClick,
    } = this.props;
    return (
      <button
        type="button"
        style={{
          margin: "20px",
          backgroundColor: this.state.isDisplayingAlt ? "black" : "dodgerblue",
          border: "3px solid #fff",
          borderRadius: "10px",
          color: " #fff",
        }}
        onClick={() => {
          onClick();
          this.toggleState();
        }}
      >
        <div
          className=""
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={this.state.isDisplayingAlt ? altViewBox : viewBox}
            style={{
              width: "30px",
              height: "30px",
              margin: "2px",
            }}
          >
            <path
              fill=" #fff"
              d={this.state.isDisplayingAlt ? altSvgData : svgData}
            ></path>
          </svg>
          <p
            style={{
              display: "inline-block",
              fontWeight: "bolder",
              fontSize: "1.1em",
            }}
          >
            {this.state.isDisplayingAlt ? altTitle : title}
          </p>
        </div>
      </button>
    );
  }
}

export default ToggableButton;
