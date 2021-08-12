import React, { Component } from "react";
import "../../css/slider.css";

class Slider extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div class="slider-description">
          <p>
            Please select a score where 1 is weak and 5 is strong in this
            measure
          </p>
        </div>

        <div class="slide-container">
          <input
            type="range"
            min="0"
            max="10"
            step="0.01"
            class="slider"
            id="myRange"
            value={this.props.value}
            onChange={this.props.onChange}
          />
          <br></br>
          <br></br>
          <div id="score" className="slider-score">
            {this.props.sliderValue}
          </div>
        </div>
      </div>
    );
  }
}

export default Slider;
