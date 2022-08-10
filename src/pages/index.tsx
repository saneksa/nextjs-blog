import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import Date from "../components/date";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData, TAllPostsData } from "../lib/posts";
import utilStyles from "../styles/utils.module.css";

interface IHomeProps {
  allPostsData: TAllPostsData;
}

const Home: FC<IHomeProps> = ({ allPostsData }) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I am frontend developer</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IHomeProps> = async () => {
  const allPostsData = await getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
};
