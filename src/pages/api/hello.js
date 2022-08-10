export default async function handler(req, res) {
  const post = await (
    await fetch("https://jsonplaceholder.typicode.com/posts/1")
  ).json();

  res.status(200).json({ post });
}
