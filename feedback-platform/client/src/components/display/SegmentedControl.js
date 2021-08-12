import "../../css/segmented-control.css";

import React, { Component } from "react";

class SegmentedControl extends Component {
  constructor(props) {
    super(props);

    this.onClickCombiner = this.onClickCombiner.bind(this);
  }

  toggleTouchedClass(e) {
    e.target.parentNode.childNodes.forEach((element) => {
      if (e.target === element) {
        if (!element.classList.contains("segmented-control-activeTab")) {
          element.classList.add("segmented-control-activeTab");
        }
      } else {
        if (element.classList.contains("segmented-control-activeTab")) {
          element.classList.remove("segmented-control-activeTab");
        }
      }
    });
  }

  onClickCombiner(e) {
    this.props.onClick(e);
    this.toggleTouchedClass(e);
  }

  render() {
    return (
      <div className="segmented-control">
        <div
          className="segmented-control-action segmented-control-activeTab"
          data-segment="search"
          // onClick={this.props.onClick}
          onClick={this.onClickCombiner}
        >
          Search
        </div>
        <div
          className="segmented-control-action"
          data-segment="added"
          // onClick={this.props.onClick}
          onClick={this.onClickCombiner}
        >
          Added
        </div>
      </div>
    );
  }
}

export default SegmentedControl;
