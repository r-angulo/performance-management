import Papa from "papaparse";
import React, { Component } from "react";
import HeaderDescription from "../../display/HeaderDescription";

//TODO: handle extra columns
//TODO: provide user with template
//TODO: dont submit all employees until all rows are clean
//TODO: make sure sample employees are not included in data
//TODO: make sure csv
//TODO: make sure column names standarize capital letters or if statement capital letters
///TODO: create the new eomployees, but first analyze file
class FileReader extends Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
  };

  updateData(result) {
    var data = result.data;
    console.log(data);
    let employeeData = [];
    if (data) {
      data.forEach((row) => {
        if (
          row["First Name"] !== "" &&
          row["Last Name"] !== "" &&
          row["Email"] !== ""
        ) {
          let manager = row["Manager"] == "TRUE" ? true : false;
          let admin = row["Admin"] == "TRUE" ? true : false;

          var newObj = {
            firstName: row["First Name"],
            lastName: row["Last Name"],
            email: row["Email"],
            password: "123456",
            manager: manager,
            admin: admin,
          };
          console.log(newObj);
        }
      });
    }
  }

  render() {
    console.log(this.state.csvfile);
    let text = (
      <div>
        <h3 style={{ textAlign: "center" }}>
          <b>Please upload a CSV file with the following columns</b>
        </h3>
        <br />
        "First Name": Employees First Name
        <br />
        <br />
        "Last Name": Employees Last Name
        <br />
        <br />
        "Email": Employees Email
        <br />
        <br />
        "Manager": Write "True" if the Employee is a manager otherwise write
        "False"
        <br />
        <br />
        "Admin": Write "True" if the Employee is an administrator otherwise
        write "False"
      </div>
    );

    return (
      <div>
        <HeaderDescription
          title="Import CSV File"
          description={text}
        ></HeaderDescription>
        <div className="container">
          <div class="file-button-wrapper">
            <span>Choose File</span>
            <input
              type="file"
              class="input-file-upload"
              ref={(input) => {
                this.filesInput = input;
              }}
              name="file"
              placeholder={null}
              onChange={this.handleChange}
            />
            <button
              className="button"
              onClick={this.importCSV}
              style={{ margin: "15px", width: "150px" }}
            >
              {" "}
              Import File
            </button>
          </div>
        </div>
        <div className="container">
          <button
            className="button"
            onClick={this.importCSV}
            style={{ margin: "15px", width: "150px" }}
          >
            {" "}
            Create New Employees
          </button>
        </div>
      </div>
    );
  }
}

export default FileReader;
