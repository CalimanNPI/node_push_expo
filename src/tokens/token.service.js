const db = require("../_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Token.findAll();
}

async function getById(id) {
  return await getToken(id);
}

async function create(params) {
  // validate
  if (await db.Token.findOne({ where: { token: params.token } })) {
    throw 'token "' + params.token + '" is already registered';
  }

  const token = new db.Token(params);

  // save
  await token.save();
}

async function update(id, params) {
  // const token = await getToken(id);

  const token = await db.Token.findOne({ where: { token: id } });

  // copy params to user and save
  Object.assign(token, params);
  await token.save();
}

async function _delete(id) {
  const token = await getToken(id);
  await token.destroy();
}

// helper functions

async function getToken(id) {
  const token = await db.Token.findByPk(id);
  if (!token) throw "Token not found";
  return token;
}
