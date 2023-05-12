const express = require("express");
const router = express.Router();

// routes

router.get("/", getAll);
router.get("/:id", getById);

module.exports = router;

function getAll(req, res, next) {
  res.render("<h1>Hello</h1>");
}

function getById(req, res, next) {
  res.render(`<h1>Hello ${req.params.id} </h1>`);
}
