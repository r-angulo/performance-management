import React from "react";
import "../../css/gauge.css";
const Gauge = (props) => {
  const { title, value } = props;
  return (
    <div className="one-gauge-container">
      <p className="gauge-title">{title}</p>
      <div className="gauge">
        <p>{value}</p>
      </div>
    </div>
  );
};

export default Gauge;
