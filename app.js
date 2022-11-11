const express = require("express");
const app = express();
const post = require("./src/api/post/post-router");
const profiles = require("./src/api/profile/profile-router");
// port at which server is running
let port = 5000;
// parse request body as JSON
app.use(express.json());

app.use("/profiles", profiles);
app.use("/posts", post);

app.listen(port, (port) => {
  console.log("SERVER RUNNING AT PORT");
});
