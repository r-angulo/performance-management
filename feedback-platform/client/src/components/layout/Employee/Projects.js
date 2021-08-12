import React, { Component } from "react";
import Cell from "../../display/Cell";
import CellSideImage from "../../display/CellSideImage";

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [
        {
          id: 1,
          projectName: "Project 1",
          projectDescription: "descdescdec",
          imageURL: "../../images/next_icon_2.png",
        },
        {
          id: 2,
          projectName: "Project 1",
          projectDescription: "descdescdec",
          imageURL: "../../images/next_icon_2.png",
        },
        {
          id: 3,
          projectName: "Project 3",
          projectDescription: "descdescdec",
          imageURL: "../../images/next_icon_2.png",
        },
        {
          id: 4,
          projectName: "Project 4",
          projectDescription: "descdescdec",
          imageURL: "../../images/next_icon_2.png",
        },
      ],
    };
  }

  render() {
    var { projects } = this.state;
    const projectCells = projects.map((project) => (
      <Cell
        key={project.id}
        title={project.projectName}
        description={project.projectDescription}
        rightSide={<CellSideImage imageURL={project.imageURL}></CellSideImage>}
      ></Cell>
    ));
    return <div className="container">{projectCells}</div>;
  }
}

export default Projects;
