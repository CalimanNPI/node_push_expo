const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateRequest = require("../_middleware/validate-request");
const notificationService = require("./notification.service");

// routes

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/:id", updateSchema, update);
router.get("/delete/:id", _delete);
router.get("/send/:id", send);
router.get("/send/:id/:clave", sendClave);
router.get("/send/:id/clave/:tipo", sendTipo);

module.exports = router;

// route functions
function getAll(req, res, next) {
  notificationService
    .getAll()
    .then((notifications) => res.json(notifications))
    .catch(next);
}

function getById(req, res, next) {
  notificationService
    .getById(req.params.id)
    .then((notification) => res.json(notification))
    .catch(next);
}

function create(req, res, next) {
  notificationService
    .create(req.body)
    .then(() => res.json({ message: "Notification created" }))
    .catch(next);
}

function update(req, res, next) {
  notificationService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "Notification updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  notificationService
    .delete(req.params.id)
    .then(() => res.json({ message: "Notification deleted" }))
    .catch(next);
}

function send(req, res, next) {
  notificationService
    .send(req.params.id)
    .then(() => res.json({ message: "Notification enviada" }))
    .catch(next);
}

function sendClave(req, res, next) {
  notificationService
    .sendClave(req.params.id, req.params.clave)
    .then(() => res.json({ message: "Notification enviada" }))
    .catch(next);
}

function sendTipo(req, res, next) {
  notificationService
    .sendTipo(req.params.id, req.params.tipo)
    .then(() => res.json({ message: "Notification enviada" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    expiry: Joi.date().required(),
    type: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().empty(""),
    body: Joi.string().empty(""),
    description: Joi.string().empty(""),
    image: Joi.string().empty(""),
    expiry: Joi.date().required(),
    type: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}
