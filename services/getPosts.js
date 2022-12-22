const getPosts = async () => {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    async (r) => {
      return await r.json();
    }
  );

  return posts;
};

export default getPosts;
