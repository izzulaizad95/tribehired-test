import express from "express";
import getPosts from "./services/getPosts.js";
import getComments from "./services/getComments.js";

const app = express();

app.use(express.json());

app.get("/top", async (res, req) => {
  const posts = await getPosts();
  const comments = await getComments();

  let postIDtoCommentCount = {};

  await comments.map((comment) => {
    if (comment.postId in postIDtoCommentCount) {
      postIDtoCommentCount[comment.postId]++;
    } else {
      postIDtoCommentCount[comment.postId] = 1;
    }
  });

  const formatPosts = await posts.map((post) => {
    return {
      post_id: post.id,
      post_title: post.title,
      post_body: post.body,
      total_number_of_comments: postIDtoCommentCount[post.id] ?? 0,
    };
  });

  const topPosts = await formatPosts.sort(
    (a, b) => a.total_number_of_comments - b.total_number_of_comments
  );

  res.send(topPosts);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
