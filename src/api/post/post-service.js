const helper = require("./post-helper");
const dao = require("./post-dao");
const uuid = require("uuid4");

/**
 * Container for profile service.
 */
let service = {};

// {
//     "id":"045c7c34-3954-48f1-9484-8262f7d0bc19",
//     "userName":"Ronaldo!",
//     "state":"maharashtrea",
//     "image":"446",
//     "gender":"male",
//     "description":"hey i am professional footballer",
//     "emailId":"ronaldo@gmail.com"
// }

service.createPost = async (params, body) => {
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
  let result = await dao.createPost(userData);
  return result;
};

service.updatePost = async (params, body) => {
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
  let result = await dao.updatePost(body);
  return result;
};

service.getPost = async (params) => {
  console.log("INSIDE GET POST SERVICE WITH", JSON.stringify(params));
  //adding basic validation
  let validation = helper.validateGetRequestParam(params);
  //throwing error if exception occurs
  if (!validation.status) {
    console.error("Invalid Request PARAMS");
    throw new Error("INVALID REQUEST PARAMS AT CREATE SERVICE");
  }

  //calling the dao layer for dumping profile
  let result = await dao.getPost(params.id);
  return result;
};

service.getAllPost = async (params) => {
  console.log("INSIDE GET ALL POST SERVICE WITH", JSON.stringify(params));
  //adding basic validation
  let validation = helper.validateGetRequestParam(params);
  //throwing error if exception occurs
  if (!validation.status) {
    console.error("Invalid Request PARAMS");
    throw new Error("INVALID REQUEST PARAMS AT CREATE SERVICE");
  }

  //calling the dao layer for dumping profile
  let result = await dao.getAllPost(params.id);
  return result;
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
  if (params.activityid == "LIKE") {
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
    title: body.title,
    description: body.description || "",
    image: body.image || "",
    CT: new Date().toISOString(),
    LUT: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    authorId: body.authorId,
    authorName: body.authorName,
  };
}

module.exports = service;
