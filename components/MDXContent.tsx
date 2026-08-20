import { MDXRemote } from 'next-mdx-remote-client/rsc';
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

// Keep wide tables scrollable without allowing them to widen the whole page.
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
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
        },
      }}
    />
  );
}
