import { MDXRemote } from 'next-mdx-remote/rsc';

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray max-w-none
      prose-headings:font-bold prose-headings:text-gray-900
      prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
      prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono
      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
      prose-blockquote:border-l-primary-400 prose-blockquote:text-gray-500
      prose-img:rounded-xl prose-img:shadow-sm">
      <MDXRemote source={source} />
    </div>
  );
}
