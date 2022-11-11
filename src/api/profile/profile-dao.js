const postgres = require("../../../utils/postgresDB/postgres-singledb");
const constants = require("../../constants/service-constants");

const dao = {};

dao.getUserData = async function (id) {
  console.log("INSIDE getUserData WITH", id);
  let result;
  try {
    result = await dynamo.GetDataJson(id);
  } catch (err) {
    console.log("GETTING ERROR WHILE FETCHING DATA FROM DYNAMO", err);
    throw new Error(`RECORD NOT FOUND ${err}`);
  }
};

dao.createUser = async function (UserData) {
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

dao.updateUser = async function (UserData) {
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

module.exports = dao;
