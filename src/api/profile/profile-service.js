const tokenization = require("../../../utils/JWT");
const helper = require("./profile-helper");
const dao = require("./profile-dao");
const postService = require("../post/post-service");
const uuid = require("uuid4");

/**
 * Container for profile service.
 */
let service = {};

service.login = async (params, body) => {
  try {
    console.log("Inside login", JSON.stringify(body));
    let loginStatus = false;

    //fetching login user info from postgres
    let userData = await dao.getLoginUserInfo(body.emailId);

    if (!userData) throw new Error(`User not registered, Please sign-up`);

    if (body.password && body.password == userData.password) {
      console.log("HELLO");
      loginStatus = true;
    }

    if (!loginStatus) {
      console.log("HOLLA");
      throw new Error(`Invalid password`);
    }
    console.log("USER LOGIN SUCCESSFULLY");

    //generating jwt token
    let tokenData = await tokenization.generateUserToken(
      userData.id,
      userData.name,
      userData.password
    );

    return { status: true, token: tokenData.token, userData };
  } catch (err) {
    throw new Error(err.message || "Unable to login");
  }
};

// {
//     "id":"045c7c34-3954-48f1-9484-8262f7d0bc19",
//     "userName":"Ronaldo!",
//     "state":"maharashtrea",
//     "image":"446",
//     "gender":"male",
//     "description":"hey i am professional footballer",
//     "emailId":"ronaldo@gmail.com"
// }
service.signUp = async (params, body) => {
  try {
    console.log("Inside signUp Service WITH", JSON.stringify(body));

    //fetching login user info from postgres
    let userData = await dao.getLoginUserInfo(body.emailId);

    if (userData) throw new Error("User already registered please login");

    //inserting user info into the login table
    await dao.insertUserLoginInfo(body);
    //generating jwt token
    let tokenData = await tokenization.generateUserToken(
      body.emailId,
      body.name,
      body.password
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
  let user = await dao.getUser(params.id);
  //fetching followers list , following list , no of post
  user.followers = await dao.getFollowers(params.id);
  //fetching following list
  user.following = await dao.getFollowing(params.id);
  //fetching posts
  user.posts = await postService.getAllPost({ id: params.id });
  return user;
};

service.getUserByName = async (params) => {
  console.log("INSIDE GET USER BY NAME SERVICE WITH", JSON.stringify(params));

  //throwing error if exception occurs
  if (!params.name) {
    console.error("Invalid Request PARAMS");
    throw new Error("INVALID REQUEST PARAMS AT GET SERVICE");
  }

  //calling the dao layer for dumping profile
  let result = await dao.getUserByName(params.name);
  return result;
};

service.activity = async (params, body) => {
  console.log("INSIDE UPDATE USER ACTIVITY", JSON.stringify(params));

  let result;

  //throwing error if exception occurs
  if (!params.source_profile || !params.destination_profile) {
    console.error("Invalid Request Payload");
    throw new Error("INVALID REQUEST payload for user activity");
  }

  //calling the dao layer for dumping profile
  if (params.activityid == "FOLLOW") {
    result = await dao.insertUpdateUserActivityInSql(params, body);
  } else {
    console.log("REMOVE SOURCE AND DESTINATION ACTIVITY IN SQL");
    result = await dao.deleteUserActivityInSql(params);
  }

  return result;
};

// service.activity(
//   {
//     source_profile: "1484848454",
//     destination_profile: "2",
//     activityid: "UNFOLLOW",
//   },
//   {
//     source_profile_name: "messi",
//     destination_profile_name: "ronaldo",
//   }
// );

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
