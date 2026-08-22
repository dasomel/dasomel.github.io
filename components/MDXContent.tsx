import type { ComponentPropsWithoutRef } from 'react';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { Mermaid } from '@/components/ui/mermaid';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Badge } from '@/components/ui/badge';
import { EvidenceCallout } from '@/components/patterns/EvidenceCallout';
import { BenchmarkGrid } from '@/components/patterns/BenchmarkGrid';
import { DigestCard } from '@/components/patterns/DigestCard';

interface MDXContentProps {
  source: string;
}

const rehypeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: true,
  filterMetaString: (meta: string) => meta.replace(/mermaid/g, ''),
};

// Keep wide tables scrollable without allowing them to widen the whole page.
const components = {
  Mermaid,
  Badge,
  EvidenceCallout,
  BenchmarkGrid,
  DigestCard,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <CodeBlock {...props} />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
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
