const AWS = require("aws-sdk");
const uuid = require("uuid4");
const dynamo = {};

// creating dynamo db instance
const dynamoDBInstance = () =>
  new AWS.DynamoDB({
    region: "ap-south-1",
  });

// creating generic connection with the aws infra
AWS.config.update({});

// method used to insert in dynamo
dynamo.putItem = async function putItem(id, data, tableName) {
  console.log("inside putData in dynamo with data as ", id, data);
  // console.log("id is", id);

  // creating aws connection
  AWS.config.update({});

  // creating put request
  const putRequest = {
    TableName: `${tableName}`,
    Item: {
      id: {
        S: id, //S stands for the data type for the key to be stored!! PS in whole project we have used S as it symbolizes that we have stored data of type string in id field
      },
      data: {
        S: JSON.stringify(data),
      },
    },
  };

  console.log("put item request ", JSON.stringify(putRequest));

  try {
    //@ts-ignore
    await dynamoDBInstance().putItem(putRequest).promise();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error"),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    info: "record inserted successfully in dynamo",
  };
};

dynamo.getItem = async function getItem(id, tableName) {
  console.log("Invoked for ", id);
  console.log(`Fetching item from DB with id: ${id}`);
  let query = {
    Key: {
      id: {
        S: id,
      },
    },
    TableName: tableName,
  };

  try {
    //@ts-ignore
    const response = await dynamoDBInstance().getItem(query).promise();
    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify("Not found"),
      };
    }

    console.log("RESPONSE IS ::", JSON.stringify(response));
    return JSON.parse(response.Item.data["S"]);
  } catch (error) {
    console.log(error);
    console.log("Error while getting data. Please check the ID");
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error"),
    };
  }
};

dynamo.deleteItem = async function deleteItem(id, tableName) {
  console.log("inside delete from dynamodb with id", id);

  //trying ti create delete params
  let deleteParams = {
    TableName: tableName,
    Key: {
      id: { S: id },
    },
  };

  // creating aws connection

  console.log("delete request params is ", JSON.stringify(deleteParams));

  let res = await dynamoDBInstance().deleteItem(deleteParams).promise();
  console.log("res is ", res);
};

module.exports = dynamo;
