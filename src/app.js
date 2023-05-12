require("rootpath")();
const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");

//middleware
const errorHandler = require("./_middleware/error-handler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
//app.use("/users", require("./users/users.controller"));
app.use("/roles", require("./roles/role.controller"));

// global error handler
app.use(errorHandler);

// setting
app.set("port", process.env.PORT || 4000);

module.exports = app;
