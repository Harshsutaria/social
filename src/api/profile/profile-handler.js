const service = require("./profile-service");
const {
  HTTPConst,
  buildResponse,
  buildError,
} = require("../../../utils/http-constants");
const tokenization = require("../../../utils/JWT");

/**
 * Container for profile handler.
 */
let handler = {};

handler.signUp = async (req, res) => {
  console.log("INSIDE signUp USER HANDLER WITH");
  let { params, body } = await getServiceArgs(req);
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
  let { params, body } = await getServiceArgs(req);
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
  let { params, body } = await getServiceArgs(req);
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
  let { params, body } = await getServiceArgs(req);
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
  let { params, body } = await getServiceArgs(req);
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

handler.getUserByName = async (req, res) => {
  console.log("INSIDE GET USER BY NAME");
  let { params } = await getServiceArgs(req);
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

handler.activity = async (req, res) => {
  console.log("INSIDE activity BY NAME");
  let { params, body } = await getServiceArgs(req);
  let result;
  //trying to call service layer for fetching user
  try {
    result = await service.activity(params, body);
    return res.json(
      buildResponse(HTTPConst.success.OK, result, "USER ACTIVITY UPDATED")
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE UPDATING USER ACTIVITY AT HANDLER LAYER");
    return res.json(
      buildError(HTTPConst.success.ACCEPTED, error, "USER ACTIVITY UPDATED")
    );
  }
};

/**utility method to fetch service args */
async function getServiceArgs(req) {
  console.log("request is ", req.headers);
  const author = req.headers;

  if (!author.username || !author.token) {
    throw new Error("INVALID REQUEST HEADERS!!!!");
  }

  if (author.password) {
    req.body.password = author.password || "";
  }

  //validating jwt token
  await validateUserToken(author.username, author.token);

  const body = req.body || {};
  const params = { ...req.query, ...req.params };
  console.log("author is", author, params, body);
  return { author, params, body };
}

async function validateUserToken(name, token) {
  let data = await tokenization.validateUserToken(name, token);

  //adding basic validation
  if (data.errorMessage) {
    console.log("INVALID JWT TOKEN");
    throw new Error("INVALID USER TOKEN");
  }

  return data;
}

module.exports = { handler };
