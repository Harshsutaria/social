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

handler.signUp = async (req, res) => {
  console.log("INSIDE signUp USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for logging in user
  try {
    result = await service.signUp(params, body);
    return res.json(
      buildResponse(HTTPConst.success.OK, result, "USER signUp IN SUCCESSFULLY")
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE signUp USER AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER signUp FAILED"
      )
    );
  }
};

handler.login = async (req, res) => {
  console.log("INSIDE LOGIN USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for logging in user
  try {
    result = await service.login(params, body);
    return res.json(
      buildResponse(HTTPConst.success.OK, result, "USER LOGGED IN SUCCESSFULLY")
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE LOGGING USER AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER LOGGING FAILED"
      )
    );
  }
};
handler.createUser = async (req, res) => {
  console.log("INSIDE CREATE USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.createUser(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.CREATED,
        result,
        "USER CREATED SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE CREATING USER AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER CREATION FAILED"
      )
    );
  }
};

handler.updateUser = async (req, res) => {
  console.log("INSIDE update USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.updateUser(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.ACCEPTED,
        result,
        "USER updateD SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE CREATING USER AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER CREATION FAILED"
      )
    );
  }
};

handler.getUser = async (req, res) => {
  console.log("INSIDE GET USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.getUser(params);
    return res.json(
      buildResponse(HTTPConst.success.OK, result, "USER FETCHED SUCCESSFULLY")
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING USER AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER FETCHING FAILED"
      )
    );
  }
};

handler.getUser = async (req, res) => {
  console.log("INSIDE GET USER BY NAME");
  let { params } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.getUserByName(params);
    return res.json(
      buildResponse(
        HTTPConst.success.OK,
        result,
        "USER FETCHED BY NAME SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING USER AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER FETCHING FAILED"
      )
    );
  }
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
