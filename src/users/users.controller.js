const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("../_middleware/validate-request");
const Role = require("../_helpers/role");
const authorize = require("../_middleware/authorize");
const userService = require("./user.service");

// routes

router.post("/authenticate", authenticateSchema, authenticate);
router.post("/register", createSchema, create);
router.get("/", authorize(), getAll);
router.get("/:id", authorize(), getById);
router.get("/current", authorize(), getCurrent);
router.post("/:id", authorize(), updateSchema, update);
router.get("/delete/:id", authorize(), _delete);

module.exports = router;

// route functions

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "Usuario creado" }))
    .catch(next);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Usuario actualizado" }))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "Usuario eliminado" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    clave: Joi.string().required(),
    status: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    clave: Joi.string().empty(""),
    status: Joi.string().empty(""),
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    role: Joi.string().valid(Role.Admin, Role.User).empty(""),
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
  }).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
  });
  validateRequest(req, next, schema);
}
