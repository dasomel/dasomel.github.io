'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

function isDarkMode() {
  if (typeof document === 'undefined') return false;
  return (
    document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    const dark = isDarkMode();

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      fontFamily: 'Pretendard Variable, sans-serif',
      themeVariables: {
        background: dark ? '#0d1317' : '#ffffff',
        primaryTextColor: dark ? '#f1f5f9' : '#0f172a',
        secondaryTextColor: dark ? '#94a3b8' : '#475569',
        tertiaryTextColor: dark ? '#64748b' : '#64748b',
        textColor: dark ? '#f1f5f9' : '#0f172a',
        lineColor: dark ? '#425462' : '#94a3b8',
        edgeLabelBackground: dark ? '#141b20' : '#ffffff',
      },
    });

    mermaid.render(id, chart).then(({ svg }) => {
      if (!ref.current) return;
      ref.current.innerHTML = svg;

      const rendered = ref.current.querySelector('svg');
      if (!rendered) return;

      // Mermaid flowchart nodes use intentionally light fills, so keep node
      // labels dark in both themes. SVG chart labels (axes/titles) follow the
      // surrounding theme instead.
      rendered.querySelectorAll('.nodeLabel').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', dark ? '#f1f5f9' : '#0f172a', 'important');
      });

      const chartTextColor = dark ? '#f1f5f9' : '#0f172a';
      rendered.querySelectorAll('text, tspan').forEach((node) => {
        node.setAttribute('fill', chartTextColor);
      });

      const edgeLabelColor = dark ? '#f1f5f9' : '#0f172a';
      rendered.querySelectorAll('.edgeLabel, .edgeLabel p').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', edgeLabelColor, 'important');
      });
    });
  }, [chart]);

  // 다이어그램은 좁은 화면에서 축소하면 글자를 읽을 수 없다. 폭을 줄이는 대신
  // 다이어그램만 가로 스크롤시키고, 화면보다 좁을 때는 가운데 정렬을 유지한다.
  return <div ref={ref} className="my-6 overflow-x-auto [&>svg]:mx-auto" />;
}
