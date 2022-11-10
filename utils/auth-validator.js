const { HTTPConst } = require("./http-constants");
const { validateUserToken } = require("./JWT");
const postgres = require("./postgresDB/postgres-singledb");

async function sessionValidate(req) {
  await postgres.clientConnect("commondb");
  console.log("Inside sessionValidate");

  /** Checking for whilelist end points which doesn't required authentication */
  const whilteListAPI = Boolean(req.headers.lambda) || authWhiteList(req);
  // console.log(`req: ${JSON.stringify(req)}, whilteListAPI: ${whilteListAPI}`);

  /* If username is not passed and is not a whileListAPI */
  if (!req.headers.username && !whilteListAPI) {
    console.log("UNAUTHORISED NO USERNAME");
    return buildResponse(
      req,
      HTTPConst.clientError.BAD_REQUEST,
      JSON.stringify({
        code: HTTPConst.clientError.BAD_REQUEST,
        message: "No userName provided",
        error: "No userName provided",
      })
    );
  }

  /* Verify Authorization and Inject author details into Lambda-Event object */
  try {
    const { username, token, password } = req.headers;

    /** IF username and token is available in headers */
    if (username && token) {
      const userBasicData = await validateUserToken(username, token);
      console.log(userBasicData);

      //If token validation returns errorMessage then throw error
      if (userBasicData.errorMessage)
        throw new Error(userBasicData.errorMessage);
      if (req.headers.password) {
        userBasicData.password = req.headers.password;
      }

      let author = {
        profileKey: userBasicData.id,
        name: userBasicData.name,
        mobileNo: userBasicData.mobileno,
        emailId: userBasicData.emailid,
        profilePicUrl: userBasicData.image,
        ageGroup: userBasicData.ageGroup,
        state: userBasicData.state,
        gender: userBasicData.gender,
        userName: username,
      };

      req.stageVariables = { author, session: {} };
      console.log(`token validated ` + userBasicData.username);
      //return the success response
      return { code: HTTPConst.success.OK, data: req, status: true };
    } else if (!token && !whilteListAPI && username && password) {
      /** if token is not available and noCheck but username and password is available
       * then authenticate using username and password
       */
      const sessionValidateResult = await validate(
        username,
        password,
        whilteListAPI
      );

      //if session validation failed throw error
      if (!sessionValidateResult.status) {
        console.log(`Returning UNAUTHORISED`);
        throw new Error(sessionValidateResult.msg);
      }
      console.log(
        `session validated using username and password ` +
          sessionValidateResult.mobileno
      );
      req.stageVariables = {
        author: {
          profileKey: sessionValidateResult.id,
          name: sessionValidateResult.name,
          mobileNo: sessionValidateResult.mobileno,
          emailId: sessionValidateResult.emailid,
          profilePicUrl: sessionValidateResult.image,
          ageGroup: sessionValidateResult.ageGroup,
          state: sessionValidateResult.state,
          gender: sessionValidateResult.gender,
          userName: username,
        },
      };

      return { code: HTTPConst.success.OK, data: req, status: true };
    } /** If its no-check endpoint */ else if (whilteListAPI) {
      req.stageVariables = { author: {}, session: {} };
      return { code: HTTPConst.success.OK, data: req, status: true };
    } /** default throwing UNAUTHORISED error */ else {
      return lambdaHandlerUtils.buildResponse(
        req,
        HTTPConst.clientError.UNAUTHORIZED,
        JSON.stringify({
          code: HTTPConst.clientError.UNAUTHORIZED,
          message: "NO TOKEN OR USERNAME/PASSWORD PROVIDED",
          error: "Its not a whitelist API",
        })
      );
    }
  } catch (error) {
    console.error("TOKEN VERIFICATION ERROR :: ", error);
    return buildResponse(
      req,
      HTTPConst.clientError.UNAUTHORIZED,
      JSON.stringify({
        code: HTTPConst.clientError.UNAUTHORIZED,
        message: error.message || "INVALID TOKEN",
        error: "AUTHENTICATION FAILED",
      })
    );
  }
}

module.exports = {
  sessionValidate,
};
