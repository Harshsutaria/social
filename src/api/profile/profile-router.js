const express = require("express");
const app = express.Router();

function route() {
  app.get("/", (request, res) => {
    console.log("INSIDE GET USER ROUTER");
  });
}

module.exports = route;
