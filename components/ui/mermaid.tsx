'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  fontFamily: 'Pretendard Variable, sans-serif',
});

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid.render(id, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    });
  }, [chart]);

  // 다이어그램은 좁은 화면에서 축소하면 글자를 읽을 수 없다. 폭을 줄이는 대신
  // 다이어그램만 가로 스크롤시키고, 화면보다 좁을 때는 가운데 정렬을 유지한다.
  return <div ref={ref} className="my-6 overflow-x-auto [&>svg]:mx-auto" />;
}
