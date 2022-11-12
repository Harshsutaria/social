const express = require("express");
const { handler } = require("./post-handler");
const app = express.Router();

app.post("/", handler.createPost);
app.post("/like/:id", handler.like);
app.post("/unlike/:id", handler.dislike);
app.post("/comment/:id", handler.comment);
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

// {
//     "id": "9bcba5fc-6247-44d1-b015-52fbfe2ab3c4",
//     "title": "vamos argertina",
//     "description": "all set for the world cup!!",
//     "image": "argentina.png",
//     "CT": "2022-11-12T07:46:20.801Z",
//     "LUT": "2022-11-12T07:46:20.801Z",
//     "likeCount": 10,
//     "commentCount": 20,
//     "authorId": "1",
//     "authorName": "messi"
// }
