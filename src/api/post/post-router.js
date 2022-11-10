const express = require("express");
const app = express.Router();

app.get("/", (request, res) => {
  console.log("INSIDE GET POST ROUTER");
});

module.exports = app;
