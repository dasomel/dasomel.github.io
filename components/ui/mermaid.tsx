'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps { chart: string; }

function isDarkMode() {
  if (typeof document === 'undefined') return false;
  return (
    document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}

function themeToken(name: string, fallback: string) {
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [themeRevision, setThemeRevision] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const notify = () => setThemeRevision((revision) => revision + 1);
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.attributeName === 'data-theme')) notify();
    });

    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    media.addEventListener('change', notify);

    return () => {
      observer.disconnect();
      media.removeEventListener('change', notify);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    const dark = isDarkMode();
    const bg = themeToken('--bg', dark ? '#151b23' : '#fafaf9');
    const bgSubtle = themeToken('--bg-subtle', dark ? '#1a222c' : '#f4f4f2');
    const surface = themeToken('--surface', dark ? '#212a36' : '#ffffff');
    const surfaceHi = themeToken('--surface-hi', dark ? '#2a3645' : '#f1f5f9');
    const border = themeToken('--border', dark ? '#303e50' : '#e2e8f0');
    const borderHi = themeToken('--border-hi', dark ? '#4d627d' : '#cbd5e1');
    const text = themeToken('--text', dark ? '#f0f6fc' : '#334155');
    const textMuted = themeToken('--text-muted', dark ? '#cbd5e1' : '#475569');
    const accent = themeToken('--accent', dark ? '#2dd4bf' : '#0d9488');
    const accentStrong = themeToken('--accent-strong', dark ? '#5eead4' : '#0f766e');
    const codeBg = themeToken('--code-bg', dark ? '#121820' : '#f8fafc');
    const palette = [accent, accentStrong, '#38bdf8', '#818cf8'].join(', ');

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      fontFamily: 'Pretendard Variable, ui-sans-serif, system-ui, sans-serif',
      themeVariables: {
        background: codeBg,
        mainBkg: surface,
        nodeBorder: borderHi,
        nodeTextColor: text,
        clusterBkg: bg,
        clusterBorder: border,
        titleColor: text,
        primaryColor: surface,
        primaryTextColor: text,
        primaryBorderColor: borderHi,
        secondaryColor: surfaceHi,
        secondaryTextColor: textMuted,
        secondaryBorderColor: border,
        tertiaryColor: bgSubtle,
        tertiaryTextColor: textMuted,
        tertiaryBorderColor: border,
        textColor: text,
        lineColor: borderHi,
        edgeLabelBackground: bg,
        actorBkg: surface,
        actorBorder: borderHi,
        actorTextColor: text,
        actorLineColor: borderHi,
        signalColor: text,
        signalTextColor: text,
        plotColorPalette: palette,
      },
    });

    mermaid.render(id, chart).then(({ svg }) => {
      if (!ref.current) return;
      ref.current.innerHTML = svg;

      const rendered = ref.current.querySelector('svg');
      if (!rendered) return;

      rendered.querySelectorAll('.node:not(.bar):not(.xychart-bar) rect, .node:not(.bar):not(.xychart-bar) circle, .node:not(.bar):not(.xychart-bar) ellipse, .node:not(.bar):not(.xychart-bar) polygon, .node:not(.bar):not(.xychart-bar) path:not(.flowchart-link)').forEach((shape) => {
        const el = shape as SVGElement;
        el.setAttribute('fill', surface);
        el.setAttribute('stroke', borderHi);
        el.style.setProperty('fill', surface, 'important');
        el.style.setProperty('stroke', borderHi, 'important');
      });

      rendered.querySelectorAll('.bar, .xychart-bar, rect.bar, g.bar-plot rect, .chart-bar').forEach((bar, index) => {
        const color = index % 2 === 0 ? accent : accentStrong;
        const el = bar as SVGElement;
        el.setAttribute('fill', color);
        el.style.setProperty('fill', color, 'important');
      });

      rendered.querySelectorAll('.nodeLabel, .nodeLabel p, .nodeLabel span').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', text, 'important');
      });

      rendered.querySelectorAll('text, tspan').forEach((node) => {
        node.setAttribute('fill', text);
      });

      rendered.querySelectorAll('.edgeLabel, .edgeLabel p, .edgeLabel span').forEach((node) => {
        const element = node as HTMLElement;
        element.style.setProperty('color', textMuted, 'important');
      });
    });
  }, [chart, themeRevision]);

  return <div ref={ref} className="my-6 overflow-x-auto [&>svg]:mx-auto" />;
}
