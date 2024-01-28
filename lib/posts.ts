//마크다운 파일에서 데이터를 추출해 페이지에 출력해줄 것
import fs from 'fs';
import path from "path"
import matter from 'gray-matter'
import { remark } from 'remark';
import remarkHtml from 'remark-html';


//process.cwd()는 nodejs 명령을 호출하는 디렉토리의 절대 경로, 즉 여기선 "/NEXTJS_APP" 디렉토리를 말함
console.log('process.cwd()', process.cwd());

//join으로 /NEXTJS_APP과 /posts를 합쳐줌
//So, postsDirectory = /nextjs_app/posts/ 로 설정된다.
const postsDirectory = path.join(process.cwd(), 'posts');
console.log('postsDirectory', postsDirectory);

export function getSortedPostsData() {

    //fs.readdirSync => 디렉토리 읽어오기
    const fileNames = fs.readdirSync(postsDirectory);
    console.log('fileNames', fileNames);
    //output: fileNames ['pre-rendering.md', 'ssg-ssr.md']

    //모든 파일들에 대해 맵핑 돌려준다.
    const allPostsData = fileNames.map(fileName => {
        //파일별 고유한 ID가 필요하기 때문에, 확장자명을 땐 id 문자열 만들어줌
        const id = fileName.replace(/\.md$/, '');

        //nextjs_app/posts/파일명으로 fullpath 설정
        const fullPath  = path.join(postsDirectory, fileName)
        //파일 내용을 string으로 읽어옴
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        //gray-matter 라이브러리의 matter()를 사용해, md 파일의 front-matter를 추출 가능하다. 
        //matter 사용시 반환되는 객체는 {data: md파일의 front-matter(pre-rendering.md의 경우, title과 date), content: md파일의 내용 문자열}
        const matterResult = matter(fileContents);

        return {
            id, 
            ...matterResult.data as { date: string, title: string}
            //as 키워드 => JS에는 타입 캐스팅이 따로 없다. 컴파일 타임에 타입 체크를 위해서 존재하는 것이 TS고 
            //이 때, 명시적으로 타입 체킹을 해줄 수 있는 방법 중의 하나가 as를 사용하는 것. 말 그대로 
            //data type을 명시해주는 것이다.
            //여기선 matterResult.data 즉 front-matter의 정보 중 date는 string 타입, title은 string 타입이어야 한다고 명시해준 것.
        }
    });

    //최신순으로 정렬
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    })
}

export function getAllPostIds() {
    //fs.readdirSync => 디렉토리 읽어오기
    const fileNames = fs.readdirSync(postsDirectory)

    //확장자명 땐 Id 배열 생성
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
  }

  export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    //gray-matter의 matter()를 사용해 마크다운 파일의 데이터 파싱
    const matterResult = matter(fileContents)

    //추출한 마크다운의 content 부분(front-matter를 제외한)을 html로 변환
    const processedContent = await remark().use(remarkHtml).process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        ...(matterResult.data as {data: string; title: string})
    }
  }