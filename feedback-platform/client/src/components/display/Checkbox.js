import React from "react";
import "../../css/checkbox.css";
const Checkbox = ({ title, name, value, onChange, checked, style }) => {
  return (
    <div className="one-checkbox-group" style={style}>
      <input
        type="checkbox"
        name={name}
        value={value}
        className="checkbox"
        onChange={onChange}
        checked={checked}
      />
      <h3>{title}</h3>
    </div>
  );
};

Checkbox.defaultProps = {
  checked: false,
};

export default Checkbox;
