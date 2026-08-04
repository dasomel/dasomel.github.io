import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { Mermaid } from '@/components/ui/mermaid';

interface MDXContentProps {
  source: string;
}

const rehypeOptions = {
  theme: 'github-light',
  keepBackground: true,
  filterMetaString: (meta: string) => meta.replace(/mermaid/g, ''),
};

// 표는 열 개수만큼 최소 폭을 요구해서, 좁은 화면에서는 본문을 넘어 페이지 전체를
// 가로로 밀어낸다(모바일 실측: 표 하나가 뷰포트를 73px 초과). 표를 좁히는 대신
// 표만 따로 스크롤되게 감싸서 페이지 자체는 넘치지 않게 한다.
const components = {
  Mermaid,
  table: (props: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        blockJS: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
        },
      }}
    />
  );
}
