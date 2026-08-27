'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { isValidElement, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ResponsiveTextDiagram } from '@/components/ui/ResponsiveTextDiagram';

const BOX_DRAWING = /[┌┐└┘├┤┬┴┼│─╔╗╚╝╠╣╦╩╬║═]/u;

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children);
  return '';
}

export function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const source = nodeText(children);
  const isDiagram = BOX_DRAWING.test(source) && source.includes('\n');
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  if (isDiagram) return <ResponsiveTextDiagram source={source} />;

  const copy = async () => {
    const text = ref.current?.querySelector('code')?.textContent ?? ref.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 1800);
    }
  };

  return (
    <div className="group relative my-6">
      <pre ref={ref} {...props}>{children}</pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
        style={{ color: 'var(--code-action)', borderColor: 'var(--code-border)', backgroundColor: 'var(--code-action-bg)' }}
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : copyFailed ? 'Copy failed' : 'Copy'}
      </button>
    </div>
  );
}
