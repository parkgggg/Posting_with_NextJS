import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import homeStyles from "../styles/Home.module.css";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";


//Static props로 전달되는 allPoostsData는(마크다운 파일들의 front-matter) {data, title, id} 객체의 배열로 이루어져있다고 명시
const Home = ({ allPostsData }: {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}) => {
  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Gu Park</title>
      </Head>
      <section className={homeStyles.headingMd}>
        <p>[Gu Park Introduction]</p>
        <p>(This is a website)</p>
      </section>
      <section className={`${homeStyles.headingMd} ${homeStyles.padding1px}`}>
        <h2 className={homeStyles.headingLg}>Blog</h2>
        <ul className={homeStyles.list}>
          {/* allPostsData 구조 분해 할당으로 매핑 */}
          {allPostsData.map(({ id, date, title }) => (
            <li className={homeStyles.listItem} key={id}>
              {/* next13 버전 이후로는 Link 태그 내부에는 a 태그를 사용할 수 없기에, legacyBeahvior 속성을 넣어 해결한다 */}
              <Link href={`/posts/${id}`} legacyBehavior>
                <a>{title}</a>
              </Link>
              <br />
              <small className={homeStyles.lightText}>
                {date}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  }
}
