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

    //fetching login user info from postgres
    let userData = await dao.getLoginUserInfo(body.emailId);

    if (!userData) throw new Error(`User not registered, Please sign-up`);

    if (body.password && body.password == userData.password) {
      loginStatus = true;
    }

    if (!loginStatus) throw new Error(`Invalid password`);

    console.log("USER LOGIN SUCCESSFULLY");

    //generating jwt token
    let tokenData = await tokenization.generateUserToken(
      userData.id,
      userData.name,
      username.password
    );

    return { status: true, token: tokenData.token, userData };
  } catch (err) {
    throw new Error(err.message || "Unable to login");
  }
};

service.signUp = async (params, body) => {
  try {
    console.log("Inside signUp Service WITH", JSON.stringify(body));

    //fetching login user info from postgres
    let userData = await dao.getLoginUserInfo(body.emailId);

    if (userData) throw new Error("User already registered please login");

    //inserting user info into the login table
    await dao.insertUserLoginInfo(userData);
    //generating jwt token
    let tokenData = await tokenization.generateUserToken(
      userData.id,
      userData.name,
      username.password
    );

    return {
      status: true,
      token: tokenData.token,
      userData,
      info: "User Registration Successfully",
    };
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
