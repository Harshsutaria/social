const postgres = require("../../../utils/postgresDB/postgres-singledb");
const constants = require("../../constants/service-constants");
const dynamo = require("../../../utils/Dynamo");
/**
 * Container for profile DAO.
 */
const dao = {};

dao.createUser = async (UserData) => {
  console.log("INSIDE CREATE USER DAO LAYER WITH", JSON.stringify(UserData));
  //insert in postgres
  await dao.createUserInPostgres(UserData);
  //insert in dynamo
  await dao.insertUpdateInDynamo(UserData.id, UserData);
  console.log("USER CREATION SUCCESSFULLY COMPLETED");
  return UserData;
};

dao.updateUser = async (UserData) => {
  console.log("INSIDE update USER DAO LAYER WITH", JSON.stringify(UserData));
  //insert in postgres
  await dao.updateUserInPostgres(UserData);
  //insert in dynamo
  await dao.insertUpdateInDynamo(UserData.id, UserData);
  console.log("USER CREATION SUCCESSFULLY COMPLETED");
  return UserData;
};

dao.getUser = async (id) => {
  console.log("INSIDE GET USER DAO LAYER WITH", JSON.stringify(id));
  let result;
  try {
    result = await dao.getUserFromDynamo(id);
  } catch (error) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM DYNAMO");
  }
  console.log("Fetched user successfully", JSON.stringify(result));
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
  console.log("USER PROFILE UPDATED IN DYNAMO");
  return result;
};

dao.getLoginUserInfo = async function (id) {
  console.log("INSIDE getLoginUserInfo WITH", id);
  let result;

  let sql = `select * from ${constants.PG_PROFILE_LOGIN_TABLE} where id = ${id} `;
  console.log("PREPARED SQL QUERY IS ", sql);
  try {
    result = await postgres.execute(sql);
  } catch (err) {
    console.log("GETTING ERROR WHILE FETCHING LOGIN INFO FROM", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
  console.log("USER LOGIN INFO IS", result);
  return result[0];
};

dao.insertUserLoginInfo = async function (userData) {
  console.log("INSIDE insertUserLoginInfo WITH", userData);
  let result;

  let sql = `insert into ${constants.PG_PROFILE_LOGIN_TABLE} (id, name ,password) values ($1,$2 ,$3) `;
  console.log("PREPARED SQL QUERY IS ", sql);
  try {
    result = await postgres.execute(sql, [
      userData.emailId,
      userData.name,
      userData.password,
    ]);
  } catch (err) {
    console.log("GETTING ERROR WHILE INSERTING LOGIN INFO FROM", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
  console.log("USER LOGIN INFO INSERTED", result);
  return result;
};

dao.createUserInPostgres = async function (UserData) {
  console.log("INSIDE CREATE USER DAO LAYER WITH", JSON.stringify(UserData));

  let query = `Insert into ${constants.PG_PROFILE_TABLE} (id,name,emailId,gender,state,ct,image,description,lut) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  console.log("Insert User Query ::", query);
  let result;
  try {
    result = await postgres.executeInsertOrUpdate(query, [
      UserData.id,
      UserData.name,
      UserData.emailId,
      UserData.gender,
      UserData.state,
      UserData.ct,
      UserData.image,
      UserData.description,
      UserData.lut,
    ]);
  } catch (err) {
    console.log("Error caught :: ", err);
    throw new Error("Getting Error While Inserting User Into Postgres", err);
  }

  return result;
};

dao.updateUserInPostgres = async function (UserData) {
  console.log("INSIDE UPDATE USER DAO LAYER WITH", JSON.stringify(UserData));

  let query = `update ${constants.PG_PROFILE_TABLE} set , name = $2  , description = $3 , state = $4 , image=$5 ,lut = $6  where id:$1`;

  console.log("UPdate User Query ::", query);
  let result;
  try {
    result = await postgres.executeInsertOrUpdate(query, [
      UserData.id,
      UserData.name,
      UserData.description,
      UserData.state,
      UserData.image,
      UserData.lut,
    ]);
  } catch (err) {
    console.log("Error caught :: ", err);
    throw new Error("Getting Error While Inserting User Into Postgres");
  }
  return result;
};

dao.getUserFromDynamo = async function (id) {
  console.log("INSIDE getUserFromDynamo WITH", id);
  let result;
  try {
    result = await dynamo.getItem(id, constants.DYNAMO_PROFILE_TABLE);
  } catch (err) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM DYNAMO", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
  console.log("USER PROFILE UPDATED IN DYNAMO");
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
