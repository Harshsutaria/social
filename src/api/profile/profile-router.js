const express = require("express");
const handler = require("./profile-handler");
const app = express.Router();

console.log("INSIDE AUTH ROUTER");

app.post("/login", handler.login);
app.post("/", handler.createUser);

module.exports = app;
