import fs from "node:fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src", "posts");

export type TAllPostsData = {
  id: string;
  content?: string;
  title: string;
  date: string;
}[];

export type TPostsData = TAllPostsData[number] & { contentHtml: string };

type TMatterResult = matter.GrayMatterFile<string> & {
  data: Omit<TAllPostsData[number], "id" | "content">;
};

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = await fs.readdir(postsDirectory);

  const allPostsData: TAllPostsData = [];

  for await (const fileName of fileNames) {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents) as TMatterResult;

    allPostsData.push({
      id,
      content: matterResult.content,
      ...matterResult.data,
    });
  }

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getAllPostIds() {
  const fileNames = await fs.readdir(postsDirectory);

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ""),
    },
  }));
}

export async function getPostData(id: string): Promise<TPostsData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = await fs.readFile(fullPath, "utf8");

  const matterResult = matter(fileContent) as TMatterResult;

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
