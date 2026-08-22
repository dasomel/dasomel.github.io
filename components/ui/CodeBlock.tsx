'use client';

import type { HTMLAttributes } from 'react';
import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

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
