const AWS = require("aws-sdk");
const uuid = require("uuid4");

// creating dynamo db instance
const dynamoDBInstance = () =>
  new AWS.DynamoDB({
    region: "ap-south-1",
  });

// creating generic connection with the aws infra
AWS.config.update({
  accessKeyId: "AKIAYBHRY7N53OWSYPOW",
  secretAccessKey: "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",
  region: "ap-south-1",
});

// method used to insert in dynamo
async function putItem(data) {
  console.log("inside putData in dynamo with data as ", data);
  const id = uuid();
  console.log("id is", id);

  // creating aws connection
  AWS.config.update({
    accessKeyId: "AKIAYBHRY7N53OWSYPOW",
    secretAccessKey: "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",
    region: "ap-south-1",
  });

  // creating put request
  const putRequest = {
    TableName: "",
    Item: {
      id: {
        S: id, //S stands for the data type for the key to be stored!! PS in whole project we have used S as it symbolizes that we have stored data of type string in id field
      },
      data: {
        S: data,
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
}

//putItem("mango cheems singh!!");

async function getItem(id) {
  console.log("Invoked for ", id);
  console.log(`Fetching item from DB with id: ${id}`);
  let query = {
    Key: {
      id: {
        S: id,
      },
    },
    TableName: "",
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
    return response.Item;
  } catch (error) {
    console.log(error);
    console.log("Error while getting data. Please check the ID");
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error"),
    };
  }
}

async function deleteItem(id) {
  console.log("inside delete from dynamodb with id", id);

  //trying ti create delete params
  let deleteParams = {
    TableName: "",
    Key: {
      id: { S: id },
    },
  };

  // creating aws connection

  console.log("delete request params is ", JSON.stringify(deleteParams));

  let res = await dynamoDBInstance().deleteItem(deleteParams).promise();
  console.log("res is ", res);
}
