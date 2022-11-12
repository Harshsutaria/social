const service = require("./post-service");
const {
  HTTPConst,
  buildResponse,
  buildError,
} = require("../../../utils/http-constants");

/**
 * Container for post handler.
 */
let handler = {};

handler.createPost = async (req, res) => {
  console.log("INSIDE CREATE USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.createPost(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.CREATED,
        result,
        "USER CREATED SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE creating AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "USER CREATION FAILED"
      )
    );
  }
};

handler.updatePost = async (req, res) => {
  console.log("INSIDE update Post HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating Post
  try {
    result = await service.updatePost(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.ACCEPTED,
        result,
        "Post updateD SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE Updating Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "Post Updation FAILED"
      )
    );
  }
};

handler.like = async (req, res) => {
  console.log("INSIDE LIKE Post HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating Post
  try {
    result = await service.like(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.ACCEPTED,
        result,
        "LIKED POST SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE LIKING Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "LIKE POST FAILED"
      )
    );
  }
};

handler.dislike = async (req, res) => {
  console.log("INSIDE dislike Post HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating Post
  try {
    result = await service.dislike(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.ACCEPTED,
        result,
        "dislike POST SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE dislike Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "dislike POST FAILED"
      )
    );
  }
};

handler.comment = async (req, res) => {
  console.log("INSIDE Comment Post HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating Post
  try {
    result = await service.comment(params, body);
    return res.json(
      buildResponse(
        HTTPConst.success.ACCEPTED,
        result,
        "Comment POST SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE comment Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "Comment POST FAILED"
      )
    );
  }
};

handler.getPost = async (req, res) => {
  console.log("INSIDE GET USER HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.getPost(params);
    return res.json(
      buildResponse(HTTPConst.success.OK, result, "Post FETCHED SUCCESSFULLY")
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "Post FETCHING FAILED"
      )
    );
  }
};

handler.getAllPost = async (req, res) => {
  console.log("INSIDE GET ALL POST HANDLER WITH");
  let { params, body } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.getAllPost(params);
    return res.json(
      buildResponse(
        HTTPConst.success.OK,
        result,
        "All Post FETCHED SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING ALL Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "Post FETCHING FAILED"
      )
    );
  }
};

handler.getUserByName = async (req, res) => {
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

handler.activity = async (req, res) => {
  console.log("INSIDE activity BY NAME");
  let { params, body } = getServiceArgs(req);
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

handler.deletePost = async (req, res) => {
  console.log("INSIDE deletePost POST HANDLER WITH");
  let { params } = getServiceArgs(req);
  let result;
  //trying to call service layer for creating user
  try {
    result = await service.deletePost(params);
    return res.json(
      buildResponse(
        HTTPConst.success.OK,
        result,
        "All Post FETCHED SUCCESSFULLY"
      )
    );
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING ALL Post AT HANDLER LAYER");
    return res.json(
      buildError(
        HTTPConst.serverError.INTERNAL_SERVER,
        error,
        "POST DELETED FAILED"
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
