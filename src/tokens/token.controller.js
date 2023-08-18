const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("../_middleware/validate-request");
const notificationService = require("./token.service");

// routes

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/:id", updateSchema, update);
router.get("/delete/:id", _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
  notificationService
    .getAll()
    .then((tokens) => res.json(tokens))
    .catch(next);
}

function getById(req, res, next) {
  notificationService
    .getById(req.params.id)
    .then((token) => res.json(token))
    .catch(next);
}

function create(req, res, next) {
  notificationService
    .create(req.body)
    .then(() => res.json({ message: "token created" }))
    .catch(next);
}

function update(req, res, next) {
  notificationService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "token updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  notificationService
    .delete(req.params.id)
    .then(() => res.json({ message: "token deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
    clave: Joi.string().required(),
    status: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
    clave: Joi.number().empty(""),
    status: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}
