const getPost = async (id) => {
  const post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then(async (r) => {
    return await r.json();
  });

  return post;
};

export default getPost;
