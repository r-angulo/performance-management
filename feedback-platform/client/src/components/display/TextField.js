import React, { Component } from "react";
import "../../css/textfield.css";

class TextField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.maxChars) {
      this.setState({ value: newProps.value.substring(0, newProps.maxChars) });
    } else {
      this.setState({ value: newProps.value });
    }
  }
  render() {
    const {
      placeholder,
      name,
      onChange,
      type,
      value,
      onFocus,
      onBlur,
      style,
      error,
      maxChars,
      width,
      isDisabled,
    } = this.props;
    return (
      <div style={{ width: width }}>
        <input
          type="text"
          className={error ? "input-text-box input-error" : "input-text-box"}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          type={type}
          value={this.state.value}
          style={style}
          disabled={isDisabled ? "disabled" : ""}
        ></input>
        {maxChars && (
          <p style={{ textAlign: "right", width: "100%" }}>
            {maxChars - this.state.value.length}/{maxChars} characters left
          </p>
        )}
        {error ? (
          <p style={{ width: "100%", textAlign: "center", color: "#ff4f60" }}>
            {error}
          </p>
        ) : null}
      </div>
    );
  }
}

TextField.defaultProps = {
  width: "100%",
  isDisabled: false,
};

export default TextField;
