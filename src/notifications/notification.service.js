const { Expo } = require("expo-server-sdk");
const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  send,
  sendClave,
  sendTipo,
};

async function getAll() {
  return await db.Notification.findAll();
}

async function getById(id) {
  return await getNotification(id);
}

async function create(params) {
  // validate
  if (await db.Notification.findOne({ where: { title: params.title } })) {
    throw 'Title "' + params.title + '" is already registered';
  }

  const notification = new db.Notification(params);

  // save
  await notification.save();
}

async function update(id, params) {
  const notification = await getNotification(id);

  // copy params to user and save
  Object.assign(notification, params);
  await notification.save();
}

async function _delete(id) {
  const notification = await getNotification(id);
  await notification.destroy();
}

// helper functions
async function getNotification(id) {
  const notification = await db.Notification.findByPk(id);
  if (!notification) throw "Notification not found";
  return notification;
}

// send notification
async function send(id) {
  let messages = [];
  let _tokens = [];

  const notification = await db.Notification.findOne({
    where: { id },
    attributes: ["title", "body"],
  });

  const tokens = await db.Token.findAll({
    where: { status: "A" },
    attributes: ["token"],
  });

  messages.push({
    title: notification.get().title,
    body: notification.get().body,
    data: { withSome: id },
    sound: "default",
  });

  _tokens = tokens.map((value) => value.get().token);

  if (_tokens.length == 0) throw "Tokens not found";

  await serverExpo(messages, _tokens);
}

// send notification clave
async function sendClave(id, clave) {
  let messages = [];
  let _tokens = [];

  const notification = await db.Notification.findOne({
    where: { id },
    attributes: ["title", "body"],
  });

  const tokens = await db.Token.findAll({
    where: { status: "A", clave: clave },
    attributes: ["token"],
  });

  messages.push({
    title: notification.get().title,
    body: notification.get().body,
    data: { withSome: id },
    sound: "default",
  });

  _tokens = tokens.map((value, index) => value.get().token);

  if (_tokens.length == 0) throw "Tokens not found";

  await serverExpo(messages, _tokens);
}

// send notification tipo de clave
async function sendTipo(id, tipo) {
  let messages = [];
  let _tokens = [];

  const notification = await db.Notification.findOne({
    where: { id },
    attributes: ["title", "body"],
  });

  const tokens = await db.Token.findAll({
    where: { status: "A" },
    attributes: ["token", "clave"],
  });

  _tokens = tokens
    .filter((value) => value.clave.substring(0, 3) == tipo)
    .map((value) => value.get().token);

  if (_tokens.length == 0) throw "Tokens not found";

  messages.push({
    title: notification.get().title,
    body: notification.get().body,
    data: { withSome: id },
    sound: "default",
  });

  await serverExpo(messages, _tokens);
}

async function serverExpo(message, somePushTokens) {
  let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

  let messages = [];
  for (let pushToken of somePushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: pushToken,
      body: message[0].body,
      data: message[0].data,
      sound: "default",
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  //console.log(chunks);

  for (let chunk of chunks) {
    try {
      //console.log(chunk);
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      //console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(tickets);
}
