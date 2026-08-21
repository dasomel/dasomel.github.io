'use client';

import type { HTMLAttributes } from 'react';
import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.querySelector('code')?.textContent ?? ref.current?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="group relative my-6">
      <pre ref={ref} {...props}>{children}</pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        style={{ color: 'var(--code-action)', borderColor: 'var(--code-border)', backgroundColor: 'var(--code-action-bg)' }}
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
