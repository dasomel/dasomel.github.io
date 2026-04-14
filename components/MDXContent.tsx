import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

interface MDXContentProps {
  source: string;
}

const rehypeOptions = {
  theme: 'github-light',
  keepBackground: true,
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
        },
      }}
    />
  );
}
