const express = require("express");
const { handler } = require("./profile-handler");
const app = express.Router();

app.post("/login", handler.login);
app.post("/signUp", handler.signUp);
app.post("/", handler.createUser);
app.put("/:id", handler.updateUser);
app.get("/:id", handler.getUser);
app.get("/", handler.searchUser);
module.exports = app;
