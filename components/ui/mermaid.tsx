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
      fontFamily: 'Pretendard Variable, ui-sans-serif, system-ui, sans-serif',
      themeVariables: {
        background: dark ? '#121820' : '#ffffff',
        mainBkg: dark ? '#212a36' : '#ffffff',
        nodeBorder: dark ? '#303e50' : '#cbd5e1',
        nodeTextColor: dark ? '#e6edf3' : '#334155',
        clusterBkg: dark ? '#151b23' : '#f8fafc',
        clusterBorder: dark ? '#303e50' : '#e2e8f0',
        titleColor: dark ? '#e6edf3' : '#334155',
        primaryColor: dark ? '#212a36' : '#ffffff',
        primaryTextColor: dark ? '#e6edf3' : '#334155',
        primaryBorderColor: dark ? '#303e50' : '#cbd5e1',
        secondaryColor: dark ? '#1a222c' : '#f1f5f9',
        secondaryTextColor: dark ? '#cbd5e1' : '#475569',
        secondaryBorderColor: dark ? '#303e50' : '#e2e8f0',
        tertiaryColor: dark ? '#151b23' : '#f8fafc',
        tertiaryTextColor: dark ? '#94a3b8' : '#64748b',
        tertiaryBorderColor: dark ? '#303e50' : '#e2e8f0',
        textColor: dark ? '#e6edf3' : '#334155',
        lineColor: dark ? '#4d627d' : '#94a3b8',
        edgeLabelBackground: dark ? '#151b23' : '#f8fafc',
        actorBkg: dark ? '#212a36' : '#ffffff',
        actorBorder: dark ? '#303e50' : '#cbd5e1',
        actorTextColor: dark ? '#e6edf3' : '#334155',
        actorLineColor: dark ? '#4d627d' : '#94a3b8',
        signalColor: dark ? '#e6edf3' : '#334155',
        signalTextColor: dark ? '#e6edf3' : '#334155',
      },
    });

    mermaid.render(id, chart).then(({ svg }) => {
      if (!ref.current) return;
      ref.current.innerHTML = svg;

      const rendered = ref.current.querySelector('svg');
      if (!rendered) return;

      const fg = dark ? '#e6edf3' : '#334155';
      const nodeBg = dark ? '#212a36' : '#ffffff';
      const nodeBorder = dark ? '#303e50' : '#cbd5e1';

      // Override node backgrounds and borders
      rendered.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon, .node path:not(.flowchart-link)').forEach((shape) => {
        const el = shape as SVGElement;
        el.setAttribute('fill', nodeBg);
        el.setAttribute('stroke', nodeBorder);
      });

      // Override node labels
      rendered.querySelectorAll('.nodeLabel, .nodeLabel p, .nodeLabel span').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', fg, 'important');
      });

      // Override general SVG text
      rendered.querySelectorAll('text, tspan').forEach((node) => {
        node.setAttribute('fill', fg);
      });

      // Override edge labels
      rendered.querySelectorAll('.edgeLabel, .edgeLabel p, .edgeLabel span').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', fg, 'important');
      });
    });
  }, [chart]);

  // 다이어그램은 좁은 화면에서 축소하면 글자를 읽을 수 없다. 폭을 줄이는 대신
  // 다이어그램만 가로 스크롤시키고, 화면보다 좁을 때는 가운데 정렬을 유지한다.
  return <div ref={ref} className="my-6 overflow-x-auto [&>svg]:mx-auto" />;
}
