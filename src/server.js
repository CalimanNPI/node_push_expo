//const app = require("./app");
//const http = require("http");
//const server = http.createServer(app);
//
////server listen
//
//server.listen(app.get("post"), () => {
//  console.log("server on port, ", app.get("port"));
//});

require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');

const errorHandler = require('./_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use("/roles", require("./roles/role.controller"));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
 