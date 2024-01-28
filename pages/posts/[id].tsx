//Next.js에서는 pages 디렉토리에 새로운 파일을 추가하면 경로가 생성되는 파일 기반 라우팅 시스템을 갖는다.
//지금 이 파일의 url은 "localhost:포트번호/posts/:id"가 될 것

import { getAllPostIds, getPostData } from '@/lib/posts'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import homeStyles from '@/styles/Home.module.css'
import postStyles from '@/styles/Post.module.css'

const Posts = ({postData}: {postData: {
    title: string,
    date: string,
    contentHtml: string
}}) => {
  return (
    <div className={postStyles.container}>
        <Head>
            <title>{postData.title}</title>
        </Head>
        <article>
            <h1 className={homeStyles.headingXl}>{postData.title}</h1>
            <div className={homeStyles.lightText}>{postData.date}</div>
            {/* XSS(사이트간 스크립팅 공격)을 피하기 위해 dangerouslySetInnerHTML 속성(위험을 상기시켜주는 역할임)을 활용해 __html키로 객체를 전달 */}
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/>
        </article>

    </div>
  )
}

export default Posts

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

    const postData = await getPostData(params?.id as string)
    return {
        props: {
            postData
        }
    }
}