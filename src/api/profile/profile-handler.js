const app = require("express");
const service = require("./profile-service");
const {
  HTTPConst,
  buildResponse,
  buildError,
} = require("../../../utils/http-constants");

/**
 * Container for profile handler.
 */
let handler = {};

handler.login = async (req, res) => {
  console.log("INSIDE LOGIN HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  return res.json({ code: 200, info: "login successfully completed" });
};

handler.createUser = async (req, res) => {
  console.log("INSIDE CREATE USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  try {
    result = await service.createUser(params, body);
  } catch (error) {}
};

/**utility method to fetch service args */
function getServiceArgs(req) {
  console.log("request is ", req.headers);
  const author = req.headers;
  const body = req.body || {};
  const params = { ...req.query, ...req.params };
  console.log("author is", author, params, body);
  return { author, params, body };
}

module.exports = { handler };
