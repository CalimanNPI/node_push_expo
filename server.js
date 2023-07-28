require("rootpath")();
require("dotenv").config({ path: "./.env" });

const express = require("express");
const app = express();
const cors = require("cors");

const errorHandler = require("./src/_middleware/error-handler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use("/node/node-push/api/users", require("./src/users/users.controller"));
app.use("/node/node-push/api/notifications", require("./src/notifications/notification.controller"));
app.use("/node/node-push/api/tokens", require("./src/tokens/token.controller"));

// global error handler
app.use(errorHandler);
 
// start server
const port = process.env.PORT;
//qprocess.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));
