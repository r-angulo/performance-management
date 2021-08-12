import React from "react";
import "../../css/header-description.css";
const HeaderDescription = ({ title, description }) => {
  return (
    <div className="container">
      <div className="box-header">{title}</div>
      <div className="box-description">
        <div className="image-container">
          <img src="../../images/measure-icon.png" alt=""></img>
        </div>
        <div className="text-description">{description}</div>
      </div>
    </div>
  );
};

export default HeaderDescription;
