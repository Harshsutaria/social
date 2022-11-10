const jwt = require("jsonwebtoken");
const postgres = require("./postgresDB/postgres-singledb");

const tokenSecret = "SOCIAL123";
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
tokenization.generateUserToken = async function (userName, password) {
  let data = await generateUserToken1(userName, password, false, expiryTime);
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
  isWhiteListed = false,
  expiry
) {
  if (!userName) {
  } else if (!password && isWhiteListed) {
  }

  const authResult = await authenticateUser(userName, password);

  if (!authResult.status && authResult.error) {
    return { errorMessage: authResult.error.message };
  }

  /* Generate new token with fetched user data */
  const tokenData = prepareTokenData(authResult);
  const token = jwtLib.generateJWT(tokenData, expiry);
  return { token, userName };
};

const authenticateUser = async function (userName, password) {
  let result;
  const ErrorResult = {
    status: false,
    error: {},
  };

  if (!userName) {
    ErrorResult.error = Error("USERNAME IS INVALID");
    return ErrorResult;
  }

  userName = userName.replace(/^(\+91|)/u, "+91");

  try {
    result = await dao.getPlayerData(userName, true, false, true);
  } catch (error) {
    console.error("UNABLE TO GET USER-DATA :: ", error);
    return { error: error, status: false };
  }

  if (!result || typeof result != "object" || Object.keys(result).length <= 0) {
    ErrorResult.error = Error("USER-DATA NOT FOUND");
    return ErrorResult;
  } else if (!result.password) {
    ErrorResult.error = Error("FETCHED INVALID USER-DATA");
    return ErrorResult;
  }

  if (password == result.password) {
    result.status = true;
  } else {
    result.status = false;
    result.error = Error("INCORRECT PASSWORD");
  }
  return result;
};

function prepareTokenData(userData) {
  const result = {
    id: userData.id,
    name: userData.name,
    // password: userData.decryptedPassword,
    mobileno: userData.mobileno,
    image: userData.image,
    gender: userData.gender,
    state: userData.state,
    agegroup: userData.agegroup,
  };
  return result;
}
