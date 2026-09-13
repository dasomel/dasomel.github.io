'use client';

import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Segment = 'h' | 'v' | 'tl' | 'tr' | 'bl' | 'br' | 'teeL' | 'teeR' | 'teeT' | 'teeB' | 'cross';

const BOX: Record<string, Segment> = {
  '─': 'h', '━': 'h', '═': 'h',
  '│': 'v', '┃': 'v', '║': 'v',
  '┌': 'tl', '╔': 'tl', '┐': 'tr', '╗': 'tr',
  '└': 'bl', '╚': 'bl', '┘': 'br', '╝': 'br',
  '├': 'teeL', '╠': 'teeL', '┤': 'teeR', '╣': 'teeR',
  '┬': 'teeT', '╦': 'teeT', '┴': 'teeB', '╩': 'teeB',
  '┼': 'cross', '╬': 'cross',
};

function lineSegments(kind: Segment, x: number, y: number, cellW: number, cellH: number) {
  const cx = x + cellW / 2;
  const cy = y + cellH / 2;
  const left = [x, cy, cx, cy];
  const right = [cx, cy, x + cellW, cy];
  const top = [cx, y, cx, cy];
  const bottom = [cx, cy, cx, y + cellH];
  switch (kind) {
    case 'h': return [left, right];
    case 'v': return [top, bottom];
    case 'tl': return [right, bottom];
    case 'tr': return [left, bottom];
    case 'bl': return [right, top];
    case 'br': return [left, top];
    case 'teeL': return [top, bottom, right];
    case 'teeR': return [top, bottom, left];
    case 'teeT': return [left, right, bottom];
    case 'teeB': return [left, right, top];
    case 'cross': return [left, right, top, bottom];
  }
}

function isWide(char: string) {
  return /[\u1100-\u115F\u2329\u232A\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/u.test(char);
}

function visualColumns(line: string) {
  return Array.from(line).reduce((sum, char) => sum + (isWide(char) ? 2 : 1), 0);
}

export function ResponsiveTextDiagram({ source }: { source: string }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => source.replace(/\n+$/, '').split('\n'), [source]);
  const cellW = 8.2;
  const cellH = 19;
  const padX = 22;
  const padY = 24;
  const cols = Math.max(1, ...lines.map(visualColumns));
  const naturalWidth = Math.max(360, Math.ceil(cols * cellW + padX * 2));
  const naturalHeight = Math.max(120, Math.ceil(lines.length * cellH + padY * 2));

  const copy = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const content = lines.flatMap((line, row) => {
    let col = 0;
    const nodes: React.ReactNode[] = [];
    let text = '';
    let textStart = 0;
    const flush = () => {
      if (!text) return;
      nodes.push(
        <text key={`t-${row}-${textStart}`} x={padX + textStart * cellW} y={padY + row * cellH + cellH * 0.69} fill="var(--text-muted)" fontSize="12.5" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">{text}</text>,
      );
      text = '';
    };

    for (const char of Array.from(line)) {
      const kind = BOX[char];
      if (kind) {
        flush();
        const x = padX + col * cellW;
        const y = padY + row * cellH;
        lineSegments(kind, x, y, cellW, cellH).forEach(([x1, y1, x2, y2], index) => {
          nodes.push(<line key={`l-${row}-${col}-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth="1.25" strokeLinecap="round" />);
        });
      } else {
        if (!text) textStart = col;
        text += char;
      }
      col += isWide(char) ? 2 : 1;
    }
    flush();
    return nodes;
  });

  return (
    <figure className="my-7 overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <figcaption className="flex items-center justify-between gap-4 border-b px-4 py-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>Architecture diagram</div>
          <div className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>Responsive vector rendering · source preserved</div>
        </div>
        <button type="button" onClick={copy} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }} aria-label="Copy diagram source">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy source'}
        </button>
      </figcaption>
      <div className="overflow-x-auto px-2 py-3">
        <svg role="img" aria-label="Architecture diagram" viewBox={`0 0 ${naturalWidth} ${naturalHeight}`} width={naturalWidth} height={naturalHeight} className="mx-auto block max-w-none" style={{ minWidth: Math.min(naturalWidth, 560) }}>
          <rect x="1" y="1" width={naturalWidth - 2} height={naturalHeight - 2} rx="14" fill="var(--code-bg)" stroke="var(--border)" />
          {content}
        </svg>
      </div>
    </figure>
  );
}
