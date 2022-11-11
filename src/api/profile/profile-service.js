const tokenization = require("../../../utils/JWT");
const helper = require("./profile-helper");
const {
  HTTPConst,
  buildResponse,
  buildError,
} = require("../../../utils/http-constants");
const dao = require("./profile-dao");
const uuid = require("uuid4");

/**
 * Container for profile service.
 */
let service = {};

service.login = async (params, body) => {
  try {
    console.log("Inside login");
    let loginStatus = false;

    let userData = await dao.getuserData(body.emailId, true, false, true);

    if (!userData) throw new Error(`Player not registered, Please sign-up`);

    if (body.password && body.password == userData.password) {
      loginStatus = true;
    }

    if (!loginStatus)
      throw new Error(`${body.password ? `Invalid password` : `Invalid OTP`}`);

    console.log(userData, loginStatus);

    //generating jwt token
    let tokenData = await tokenization.generateUserToken(
      userData.mobileno,
      userData.password
    );
    return { status: true, token: tokenData.token, playerId: playerData.id };
  } catch (err) {
    throw new Error(err.message || "Unable to login");
  }
};

service.createUser = async (params, body) => {
  console.log("INSIDE CREATE USER SERVICE WITH", JSON.stringify(body));
  //adding basic validation
  let validation = helper.validateCreateRequestPayload(body);
  //throwing error if exception occurs
  if (!validation.status) {
    console.error("Invalid Request Payload");
    throw new Error("INVALID REQUEST PAYLOAD AT CREATE SERVICE");
  }
  // Preparing the user profile payload
  let userData = createRequestPayload(body);
  //calling the dao layer for dumping profile
  let result = await dao.createUser(userData);
  return result;
};

service.updateUser = async (params, body) => {
  console.log("INSIDE UPDATE USER SERVICE WITH", JSON.stringify(body));
  //adding basic validation
  let validation = helper.validateCreateRequestPayload(body);
  //throwing error if exception occurs
  if (!validation.status) {
    console.error("Invalid Request Payload");
    throw new Error("INVALID REQUEST PAYLOAD AT UPDATE SERVICE");
  }
  // Preparing the user profile payload
  body.LUT = new Date().toISOString();
  //calling the dao layer for dumping profile
  let result = await dao.updateUser(body);
  return result;
};

service.getUser = async (params) => {
  console.log("INSIDE GET USER SERVICE WITH", JSON.stringify(params));
  //adding basic validation
  let validation = helper.validateGetRequestParam(params);
  //throwing error if exception occurs
  if (!validation.status) {
    console.error("Invalid Request PARAMS");
    throw new Error("INVALID REQUEST PARAMS AT CREATE SERVICE");
  }

  //calling the dao layer for dumping profile
  let result = await dao.getUser(params.id);
  return result;
};

/*********************Required Methods****************/
function createRequestPayload(body) {
  return {
    id: uuid(),
    emailId: body.emailId,
    CT: new Date().toISOString(),
    LUT: new Date().toISOString(),
    name: body.userName,
    description: body.description || "",
    image: body.image || "",
    state: body.state || "",
    gender: body.gender || "",
  };
}

module.exports = service;
