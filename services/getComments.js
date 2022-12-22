const getComments = async () => {
  const comments = await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  ).then(async (r) => {
    return await r.json();
  });

  return comments;
};

export default getComments;
