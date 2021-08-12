import React, { Component } from "react";
import { connect } from "react-redux";
import ProjectAddMeasure from "./ProjectAddMeasure";

class ProjectMeasuresContainer extends Component {
  render() {
    return (
      <div>
        <ProjectAddMeasure></ProjectAddMeasure>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectMeasuresContainer);
