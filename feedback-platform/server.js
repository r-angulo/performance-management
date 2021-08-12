const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//route handlers
const admin = require("./routes/admin");
const shared = require("./routes/shared");
const manager = require("./routes/manager");
const employee = require("./routes/employee");

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); //parses form data request
app.use(bodyParser.json()); //parser incoming json request

const db = require("./config/keys").mongoURI; //START DB with password

//TODO:

//connect mongodb through mongoose and password
mongoose
  .connect(db)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

//passpowrt middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//main routes
app.use("/api/admin", admin);
app.use("/api/shared", shared);
app.use("/api/manager", manager);
app.use("/api/employee", employee);

const port = process.env.PORT || 5000; //run on port 5000

app.listen(port, () => console.log(`Server running on port ${port}`));
//note concurrelyn and must go into client json and add proxy line
