import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

import Layout from "../../components/layout";
import { getAllPostIds, getPostData, TPostsData } from "../../lib/posts";
import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";

interface IPostProps {
  postData: TPostsData;
}

const Post: FC<IPostProps> = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  IPostProps,
  { id: string }
> = async ({ params }) => {
  const postData =
    params?.id != null
      ? await getPostData(params.id)
      : ({} as IPostProps["postData"]);

  return {
    props: {
      postData,
    },
  };
};
