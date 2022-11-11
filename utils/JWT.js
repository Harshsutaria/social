const jwt = require("jsonwebtoken");
const postgres = require("./postgresDB/postgres-singledb");
const dao = require("../src/api/profile/profile-dao");

const tokenSecret = "SOCIAL123";
//initializing connection with the client
postgres.clientConnect("commondb");

/** Expiry time should be in following standard
 * Ex: 1s, 1h, 1 days, 7d
 */
const expiryTime = "7d";

const tokenization = {};
const jwtLib = {};

jwtLib.generateJWT = function (tokenData, expiry) {
  const token = jwt.sign(tokenData, tokenSecret, {
    algorithm: "HS256",
    issuer: "MRIDA",
    expiresIn: expiry || "7d",
  });
  return token;
};

jwtLib.verifyJWT = function (token) {
  try {
    const tokenData = jwt.verify(token, tokenSecret);
    return tokenData;
  } catch (error) {
    if (error.name == jwt.TokenExpiredError.name) {
      return { errorMessage: "TOKEN EXPIRED" };
    } else if (error.message == "invalid signature") {
      return { errorMessage: "INVALID TOKEN" };
    } else if (error.message == "invalid token") {
      return { errorMessage: "INVALID TOKEN" };
    } else if (error.name == SyntaxError.name) {
      return { errorMessage: "INVALID TOKEN" };
    }
    throw error;
  }
};

jwtLib.decode = function (token) {
  try {
    var tokenData = jwt.decode(token);
  } catch (err) {
    throw new Error("INVALID TOKEN");
  }
  return tokenData;
};

tokenization.validateUserToken = async function (userName, token) {
  const tokenData = jwtLib.verifyJWT(token);
  console.log(tokenData);
  if (tokenData.mobileno != userName && !tokenData.errorMessage) {
    return { errorMessage: "INVALID USER" };
  }
  return tokenData;
};

/**
 * @param {string} [expiry] Ex: 1s, 1h, 1 days, 7d
 */
tokenization.generateUserToken = async function (userName, password, emailId) {
  let data = await generateUserToken1(userName, password, emailId);
  console.log(`Token Generated for ${userName} is ${data.token}`);
  return data;
};

/**
 * @param {string} [expiry] Ex: 1s, 1h, 1 days, 7d
 */
tokenization.refreshUserTokenWithExpiry = function (userName, token, expiry) {
  expiry = expiry || expiryTime;
  const tokenData = jwtLib.decode(token);
  if (tokenData.userName != userName && tokenData.sessionId != userName)
    return { errorMessage: "INVALID USER" };
  delete tokenData.exp;
  delete tokenData.iat;
  delete tokenData.iss;
  token = jwtLib.generateJWT(tokenData, expiry);
  return { tokenData, token };
};

module.exports = tokenization;

/********************************************************Required Methods *******************************************/

const generateUserToken1 = async function (
  userName,
  password,
  emailId,
  expiry
) {
  console.log("INSIDE GENERATE USER TOKEN WITH", userName, password);

  /* Preparing user payload based on the auth result*/
  const tokenData = prepareTokenData({ name: userName, password, emailId });
  /**Preparing JWT token for the user */
  const token = jwtLib.generateJWT(tokenData, expiry);
  return { token, userName };
};

function prepareTokenData(userData) {
  const result = {
    id: userData.id,
    name: userData.name,
    emailId: userData.emailId,
  };
  return result;
}
