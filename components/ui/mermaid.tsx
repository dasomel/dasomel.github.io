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

    const fg = dark ? '#f0f6fc' : '#1e293b';
    const subFg = dark ? '#cbd5e1' : '#475569';
    const nodeBg = dark ? '#212a36' : '#f8fafc';
    const nodeBorder = dark ? '#3e526d' : '#cbd5e1';
    const accentColor = dark ? '#2dd4bf' : '#0d9488';
    const accentAlt = dark ? '#5eead4' : '#14b8a6';
    const lineColor = dark ? '#4d627d' : '#94a3b8';
    const palette = dark
      ? '#2dd4bf, #5eead4, #14b8a6, #38bdf8, #818cf8'
      : '#0d9488, #14b8a6, #0f766e, #0284c7, #6366f1';

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      fontFamily: 'Pretendard Variable, ui-sans-serif, system-ui, sans-serif',
      themeVariables: {
        background: dark ? '#121820' : '#ffffff',
        mainBkg: nodeBg,
        nodeBorder: nodeBorder,
        nodeTextColor: fg,
        clusterBkg: dark ? '#151b23' : '#f1f5f9',
        clusterBorder: dark ? '#303e50' : '#e2e8f0',
        titleColor: fg,
        primaryColor: nodeBg,
        primaryTextColor: fg,
        primaryBorderColor: nodeBorder,
        secondaryColor: dark ? '#1a222c' : '#f1f5f9',
        secondaryTextColor: subFg,
        secondaryBorderColor: nodeBorder,
        tertiaryColor: dark ? '#151b23' : '#fafaf9',
        tertiaryTextColor: subFg,
        tertiaryBorderColor: nodeBorder,
        textColor: fg,
        lineColor: lineColor,
        edgeLabelBackground: dark ? '#151b23' : '#ffffff',
        actorBkg: nodeBg,
        actorBorder: nodeBorder,
        actorTextColor: fg,
        actorLineColor: lineColor,
        signalColor: fg,
        signalTextColor: fg,
        plotColorPalette: palette,
      },
    });

    mermaid.render(id, chart).then(({ svg }) => {
      if (!ref.current) return;
      ref.current.innerHTML = svg;

      const rendered = ref.current.querySelector('svg');
      if (!rendered) return;

      // Flowchart node shapes: fill with subtle surface and crisp border
      rendered.querySelectorAll('.node:not(.bar):not(.xychart-bar) rect, .node:not(.bar):not(.xychart-bar) circle, .node:not(.bar):not(.xychart-bar) ellipse, .node:not(.bar):not(.xychart-bar) polygon, .node:not(.bar):not(.xychart-bar) path:not(.flowchart-link)').forEach((shape) => {
        const el = shape as SVGElement;
        el.setAttribute('fill', nodeBg);
        el.setAttribute('stroke', nodeBorder);
        el.style.setProperty('fill', nodeBg, 'important');
        el.style.setProperty('stroke', nodeBorder, 'important');
      });

      // Bar charts (xychart-beta): vibrant brand teal palette
      rendered.querySelectorAll('.bar, .xychart-bar, rect.bar, g.bar-plot rect, .chart-bar').forEach((bar, index) => {
        const el = bar as SVGElement;
        const color = index % 2 === 0 ? accentColor : accentAlt;
        el.setAttribute('fill', color);
        el.style.setProperty('fill', color, 'important');
      });

      // Flowchart node text
      rendered.querySelectorAll('.nodeLabel, .nodeLabel p, .nodeLabel span').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', fg, 'important');
      });

      // General SVG text & chart axes/titles
      rendered.querySelectorAll('text, tspan').forEach((node) => {
        node.setAttribute('fill', fg);
      });

      // Edge labels
      rendered.querySelectorAll('.edgeLabel, .edgeLabel p, .edgeLabel span').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', subFg, 'important');
      });
    });
  }, [chart]);

  // 다이어그램은 좁은 화면에서 축소하면 글자를 읽을 수 없다. 폭을 줄이는 대신
  // 다이어그램만 가로 스크롤시키고, 화면보다 좁을 때는 가운데 정렬을 유지한다.
  return <div ref={ref} className="my-6 overflow-x-auto [&>svg]:mx-auto" />;
}
