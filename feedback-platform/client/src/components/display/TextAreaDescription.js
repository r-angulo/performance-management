import React, { Component } from "react";
import "../../css/textarea-description.css";

class TextAreaDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value) {
      this.setState({ value: newProps.value.substring(0, newProps.maxChars) });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="">
          <p>{this.props.description}</p>
        </div>
        <textarea
          name="comments"
          class="textarea-comment"
          cols="200"
          rows="10"
          required
          onChange={this.props.onChange}
          value={this.state.value}
        ></textarea>
        <p style={{ textAlign: "right", width: "100%" }}>
          {this.props.maxChars - this.state.value.length}/{this.props.maxChars}{" "}
          characters left
        </p>
        {this.props.error ? (
          <p style={{ width: "100%", textAlign: "center", color: "#ff4f60" }}>
            {this.props.error}
          </p>
        ) : null}
      </React.Fragment>
    );
  }
}

export default TextAreaDescription;
