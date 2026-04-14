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

const components = {
  Mermaid,
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
        },
      }}
    />
  );
}
