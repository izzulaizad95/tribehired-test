import express from "express";
import getPosts from "./services/getPosts.js";
import getComments from "./services/getComments.js";

const app = express();

app.use(express.json());

app.get("/posts/top", async (req, res) => {
  const posts = await getPosts();
  const comments = await getComments();

  let postIDtoCommentCount = {};

  // populate obj with postId as key with total number of comments as value
  comments.map((comment) => {
    if (comment.postId in postIDtoCommentCount) {
      postIDtoCommentCount[comment.postId]++;
    } else {
      postIDtoCommentCount[comment.postId] = 1;
    }
  });

  // format response and include total number of comments for respective posts
  const formatPosts = posts.map((post) => {
    return {
      post_id: post.id,
      post_title: post.title,
      post_body: post.body,
      total_number_of_comments: postIDtoCommentCount[post.id] ?? 0,
    };
  });

  const topPosts = formatPosts.sort(
    (a, b) => a.total_number_of_comments - b.total_number_of_comments
  );

  res.send(topPosts);
});

app.get("/posts", async (req, res) => {
  const comments = await getComments();

  const filters = req.query;
  const filteredComments = comments.filter((comment) => {
    for (let key in filters) {
      // convert param value to number if value is a number
      const filterValue =
        typeof comment[key] === "number"
          ? key.toLowerCase().includes("id")
            ? parseInt(filters[key])
            : parseFloat(filters[key])
          : filters[key];

      // if any of the param value mismatch, filter out result
      if (comment[key] !== filterValue) {
        return false;
      }
    }
    return true;
  });

  if (filteredComments.length === 0) {
    res.status(404).json({ error: "No comments found" });
  }
  res.send(filteredComments);
});

app.listen(8888, () => {
  console.log("Server is running on port 8888");
});
