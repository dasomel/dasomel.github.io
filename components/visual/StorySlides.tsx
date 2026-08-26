'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type StoryItem = readonly [string, string, string];

export function StorySlides({ items, lang }: { items: readonly StoryItem[]; lang: 'ko' | 'en' }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-story-slide]'));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.index || 0));
    }, { root, threshold: [0.45, 0.65, 0.8] });
    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const go = (index: number) => {
    const root = rootRef.current;
    const target = root?.querySelector<HTMLElement>(`[data-index="${Math.max(0, Math.min(items.length - 1, index))}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="relative">
    <div ref={rootRef} className="story-slide-root h-[calc(100svh-64px)] snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth rounded-2xl border" style={{ borderColor:'var(--border)', background:'var(--surface)' }}>
      {items.map(([year,title,description], index) => <section key={year} data-story-slide data-index={index} className="relative flex min-h-[calc(100svh-66px)] snap-start items-center overflow-hidden px-6 py-16 sm:px-12 lg:px-20">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" style={{background:`radial-gradient(circle at ${index%2?75:25}% 35%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 36%), linear-gradient(${120+index*11}deg, transparent 25%, color-mix(in srgb, var(--signal) 8%, transparent) 50%, transparent 72%)`}} />
        <div className="relative z-10 grid w-full gap-10 lg:grid-cols-[180px_1fr] lg:items-center">
          <div><div className="font-mono text-xs tracking-[0.16em]" style={{color:'var(--accent)'}}>CHAPTER {String(index+1).padStart(2,'0')}</div><div className="mt-3 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl" style={{color:'var(--text)'}}>{year}</div></div>
          <div className="max-w-4xl"><h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl" style={{color:'var(--text)'}}>{title}</h2><p className="mt-6 max-w-3xl text-base leading-8 sm:text-lg" style={{color:'var(--text-muted)'}}>{description}</p><div className="mt-9 flex items-center gap-3 font-mono text-[10px] tracking-[0.12em]" style={{color:'var(--text-faint)'}}>{index < items.length-1 ? <><ArrowDown className="h-4 w-4"/> {lang==='ko'?'스크롤하여 다음 장면':'SCROLL FOR NEXT CHAPTER'}</> : lang==='ko'?'JOURNEY CONTINUES':'JOURNEY CONTINUES'}</div></div>
        </div>
      </section>)}
    </div>
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-md" style={{borderColor:'var(--border)',background:'color-mix(in srgb, var(--surface) 88%, transparent)'}}>
      <button className="pointer-events-auto rounded-full p-1.5 disabled:opacity-30" disabled={active===0} onClick={()=>go(active-1)} aria-label="Previous story slide"><ArrowLeft className="h-4 w-4"/></button>
      <div className="flex gap-1.5" aria-label={`${active+1} / ${items.length}`}>{items.map((_,i)=><button key={i} onClick={()=>go(i)} className="pointer-events-auto h-1.5 rounded-full transition-all" style={{width:i===active?24:6,backgroundColor:i===active?'var(--accent)':'var(--border-strong)'}} aria-label={`Story slide ${i+1}`}/>)}</div>
      <button className="pointer-events-auto rounded-full p-1.5 disabled:opacity-30" disabled={active===items.length-1} onClick={()=>go(active+1)} aria-label="Next story slide"><ArrowRight className="h-4 w-4"/></button>
    </div>
  </div>;
}
