const postgres = require("../../../utils/postgresDB/postgres-singledb");
const constants = require("../../constants/service-constants");
const dynamo = require("../../../utils/Dynamo");
/**
 * Container for profile DAO.
 */
const dao = {};

dao.createPost = async (postData) => {
  console.log("INSIDE CREATE USER DAO LAYER WITH", JSON.stringify(postData));
  //insert in postgres
  await dao.createPostInPostgres(postData);
  //insert in dynamo
  await dao.insertUpdateInDynamo(postData.id, postData);
  console.log("POST CREATION SUCCESSFULLY COMPLETED");
  return postData;
};

dao.updatePost = async (postData) => {
  console.log("INSIDE update POST DAO LAYER WITH", JSON.stringify(postData));
  //insert in postgres
  await dao.updatePostInPostgres(postData);
  //insert in dynamo
  await dao.insertUpdateInDynamo(postData.id, postData);
  console.log("POST UPDATION SUCCESSFULLY COMPLETED");
  return postData;
};

dao.getPost = async (id) => {
  console.log("INSIDE GET POST DAO LAYER WITH", JSON.stringify(id));
  let result;
  try {
    result = await dao.getPostFromDynamo(id);
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM DYNAMO");
  }
  console.log("Fetched user successfully", JSON.stringify(result));
  return result;
};

dao.getPostByName = async (name) => {
  console.log("INSIDE  getPostByName DAO LAYER WITH", JSON.stringify(name));
  let sql = `select * from ${constants.PG_POST_PROFILE} where title ilike '${name}%'`;
  console.log("PREPARED SQL QUERY AS ", sql);
  let result;
  try {
    result = await postgres.execute(sql);
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM POSTGRES");
  }
  console.log("Fetched user successfully", JSON.stringify(result));
  return result;
};

dao.getAllPost = async (authorId) => {
  console.log("INSIDE  getAllPost DAO LAYER WITH", authorId);

  //preparing sql query as
  let sql = `select count(*) over() , *  from ${constants.PG_POST_PROFILE} where authorid = '${authorId}'`;

  console.log("PREPARED SQL QUERY AS ", sql);
  //preparing base response object
  let result = {
    count: 0,
    posts: [],
  };

  let data;
  try {
    data = await postgres.execute(sql);
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM POSTGRES");
  }
  console.log("Fetched all post successfully", JSON.stringify(data));

  //returning response object
  if (Array.isArray(data) && data.length > 0) {
    result.count = data[0].count;
    result.posts = data;
  }

  console.log("RESULT IS result", JSON.stringify(result));
  return result;
};

dao.insertLikePostRecord = async function (postId, body) {
  console.log("INSIDE insertLikePostRecord WITH", postId, JSON.stringify(body));
  let result;

  let sql = `insert into ${constants.PG_POST_LIKE} (postid, activity,profilekey ,profilename,ct) values ($1,$2,$3,$4,$5)`;

  console.log("PREPARED SQL QUERY IS ", sql);
  try {
    result = await postgres.execute(sql, [
      postId,
      "LIKE",
      body.profileKey,
      body.profileName,
      new Date().toISOString(),
    ]);
  } catch (err) {
    console.log("GETTING ERROR WHILE INSERTING LIKE INFO FROM", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
  console.log("USER LIKE INFO INSERTED", result);
  return result;
};

dao.deleteLikePostRecord = async (postId, body) => {
  console.log(
    "INSIDE deleteLikePostRecord DAO LAYER WITH",
    JSON.stringify(postId, body)
  );

  let sql = `delete from ${constants.PG_POST_LIKE} where activity ='LIKE' and postid=$1 
            and profilekey = $2`;

  console.log("PREPARED SQL QUERY AS ", sql);
  let result;

  //trying to execute sq query
  try {
    result = await postgres.execute(sql, [postId, body.profileKey]);
  } catch (error) {
    console.log(
      "GETTING ERROR WHILE DELETE ACTIVITY DATA FROM POSTGRES",
      error
    );
  }
  console.log("RESULT IS result", JSON.stringify(result));
  return result;
};

dao.insertUpdateInDynamo = async function (id, data) {
  console.log("INSIDE insertUpdateInDynamo WITH", id);
  let result;

  try {
    result = await dynamo.putItem(id, data, constants.DYNAMO_PROFILE_TABLE);
  } catch (err) {
    console.log("GETTING ERROR WHILE UPDATING DATA FROM DYNAMO", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
  console.log("POST UPDATED IN DYNAMO");
  return result;
};

dao.createPostInPostgres = async function (postData) {
  console.log("INSIDE CREATE post DAO LAYER WITH", JSON.stringify(postData));

  let query = `Insert into ${constants.PG_POST_PROFILE} (id,title,description,ct,lut,likecount,commentcount,image , authorid , authorname) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  console.log("Insert post Query ::", query);
  let result;
  try {
    result = await postgres.executeInsertOrUpdate(query, [
      postData.id,
      postData.title,
      postData.description,
      postData.CT,
      postData.LUT,
      postData.likeCount,
      postData.commentCount,
      postData.image,
      postData.authorId,
      postData.authorName,
    ]);
  } catch (err) {
    console.log("Error caught :: ", err);
    throw new Error(`Getting Error While Inserting post Into Postgres ${err}`);
  }

  console.log("POST INSERTED INTO POSTGRES", result);

  return result;
};

dao.updatePostInPostgres = async function (postData) {
  console.log(
    "INSIDE UPDATE BASE POST DAO LAYER WITH",
    JSON.stringify(postData)
  );

  //prepare update query
  let query = `update ${constants.PG_POST_PROFILE} set title = $2  ,description = $3 , image = $4 ,lut = $5 , likecount = $6 , commentcount = $7  where id =$1`;

  console.log("Update User Query ::", query);
  let result;
  try {
    result = await postgres.executeInsertOrUpdate(query, [
      postData.id,
      postData.title,
      postData.description,
      postData.image,
      postData.LUT,
      postData.likeCount,
      postData.commentCount,
    ]);
  } catch (err) {
    console.log("Error caught :: ", err);
    throw new Error("Getting Error While Inserting User Into Postgres");
  }
  console.log("PRODUCT BASE UPDATION SUCCESSFULLY", JSON.stringify(result));

  return result;
};

dao.getPostFromDynamo = async function (id) {
  console.log("INSIDE getPostFromDynamo WITH", id);
  let result;
  try {
    result = await dynamo.getItem(id, constants.DYNAMO_PROFILE_TABLE);
  } catch (err) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM DYNAMO", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
  console.log("FETCHED POST FROM  DYNAMO");
  return result;
};

// dynamo.putItem(
//   "1",
//   { name: "share a thought ", type: "post" },
//   constants.DYNAMO_PROFILE_TABLE
// );

// dynamo.getItem("1", constants.DYNAMO_PROFILE_TABLE).then((data) => {
//   console.log("data is ", JSON.stringify(data.name));
// });

module.exports = dao;
