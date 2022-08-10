import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const post = await (
    await fetch("https://jsonplaceholder.typicode.com/posts/1")
  ).json();

  res.status(200).json({ post });
}
