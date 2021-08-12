import React from "react";

const CellSideImage = (props) => {
  console.log(typeof props.imageURL);
  return (
    <div className="cell-image-container">
      <img src={require("../../images/next_icon_2.png")}></img>
    </div>
  );
};

export default CellSideImage;
