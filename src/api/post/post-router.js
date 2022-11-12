const express = require("express");
const { handler } = require("./post-handler");
const app = express.Router();

app.post("/", handler.createPost);
app.put("/:id", handler.updatePost);
app.get("/:id", handler.getPost);
app.get("/", handler.getAllPost);

module.exports = app;

// {
//     "authorId" : "1",
//     "authorName":"messi",
//     "title":"vamos argertina",
//     "image":"argentina.png",
//     "tags": "[football]",
//     "description":"all set for the world cup",

// }
