'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Locale = 'ko' | 'en';

const repos = [
  ['OpenForge', 'Standards', 'openforge'],
  ['kube-ready-box', 'Baseline', 'kube-ready-box'],
  ['Narwhal', 'Platform', 'narwhal'],
  ['Narwhal Portal', 'Experience', 'narwhal-portal'],
  ['nfs-quota-agent', 'Storage', 'nfs-quota-agent'],
  ['ldapium', 'Identity', 'ldapium'],
  ['Beluga', 'Data', 'beluga'],
  ['KubeMetal', 'AI / Edge', 'kubemetal'],
] as const;

export default function OssStoryMobileInfographic({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const base = en ? '/en' : '/ko';
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-mobile-slide]'));
    const observer = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit) setActive(Number((hit.target as HTMLElement).dataset.index || 0));
    }, { root, threshold: [0.45, 0.65, 0.8] });
    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const t = en ? {
    hero: 'Open source is a system, not a repository.', heroLead: 'Problem definition, repeatability, integration, verification and documentation form one engineering flow.',
    signal: 'Why OSS engineering now', signalLead: 'Cloud Native and AI make integration evidence more valuable than a long technology list.',
    complex: 'Complexity appears at boundaries.', complexLead: 'Identity, network, storage and delivery seams are where operations actually fail.',
    governance: 'Good OSS designs code and operating rules together.', governanceLead: 'License, release, security and documentation rules keep a growing project coherent.',
    loop: 'Build → Verify → Learn → Share', loopLead: 'Feature completion is only the midpoint. Evidence closes the loop.',
    arch: 'Projects connect by role.', archLead: 'Standards → baseline → platform → capability → workload.',
    evidence: 'Leave verifiable signals, not claims.', evidenceLead: 'Repeatable checks and recorded lessons turn implementation into engineering evidence.',
    map: 'Not a portfolio. A workbench.', mapLead: 'Independent repositories become one connected engineering system.',
  } : {
    hero: 'OSS는 저장소가 아니라 시스템입니다.', heroLead: '문제 정의, 재현성, 통합, 검증, 문서화가 하나의 engineering flow로 연결됩니다.',
    signal: '왜 지금 OSS Engineering인가', signalLead: 'Cloud Native와 AI 시대에는 기술 목록보다 통합을 증명하는 evidence가 중요합니다.',
    complex: '복잡성은 기술 수가 아니라 경계에서 생깁니다.', complexLead: 'Identity, Network, Storage, Delivery의 seam에서 실제 운영 문제가 발생합니다.',
    governance: '좋은 OSS는 코드와 운영 규칙을 함께 설계합니다.', governanceLead: 'License, Release, Security, Documentation 규칙이 지속 가능성을 만듭니다.',
    loop: 'Build → Verify → Learn → Share', loopLead: '기능 완료가 끝이 아니라 evidence를 남겨야 loop가 닫힙니다.',
    arch: '프로젝트는 역할별로 연결됩니다.', archLead: 'Standards → Baseline → Platform → Capability → Workload 흐름입니다.',
    evidence: '결과보다 검증 가능한 신호를 남깁니다.', evidenceLead: '반복 가능한 check와 incident lesson이 구현을 engineering evidence로 바꿉니다.',
    map: '포트폴리오가 아니라 하나의 Workbench', mapLead: '독립 저장소들이 하나의 engineering system으로 연결됩니다.',
  };

  const chapter = (index: number, eyebrow: string, title: string, lead: string, body: React.ReactNode) => (
    <section key={index} data-mobile-slide data-index={index} className="ms-slide">
      <div className="ms-kicker"><span>{String(index + 1).padStart(2, '0')}</span><b>{eyebrow}</b></div>
      <h2>{title}</h2>
      <p className="ms-lead">{lead}</p>
      <div className="ms-visual">{body}</div>
      <div className="ms-next">{index < 7 ? (en ? 'SWIPE UP FOR NEXT CHAPTER' : '위로 넘겨 다음 장면') : (en ? 'END OF STORY · KEEP BUILDING' : 'STORY END · 계속 만드는 중')}</div>
    </section>
  );

  return <main className="mobile-story">
    <style>{`
      .mobile-story{position:relative;height:calc(100svh - 64px);background:var(--bg);color:var(--text);overflow:hidden}
      .mobile-story *{box-sizing:border-box}.ms-progress{position:absolute;z-index:30;left:0;right:0;top:0;height:3px;background:var(--border)}.ms-progress i{display:block;height:100%;background:var(--accent);transition:width .25s ease}.ms-top{position:absolute;z-index:25;left:14px;right:14px;top:12px;display:flex;align-items:center;justify-content:space-between;pointer-events:none}.ms-top span{font:800 9px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.13em;color:var(--text-faint);padding:7px 9px;border:1px solid var(--border);border-radius:999px;background:color-mix(in srgb,var(--surface) 90%,transparent);backdrop-filter:blur(12px)}
      .ms-scroll{height:100%;overflow-y:auto;overflow-x:hidden;scroll-snap-type:y mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}.ms-scroll::-webkit-scrollbar{display:none}.ms-slide{position:relative;min-height:100%;scroll-snap-align:start;scroll-snap-stop:always;padding:58px 16px 42px;display:flex;flex-direction:column;justify-content:center;overflow:hidden;border-bottom:1px solid var(--border)}.ms-slide:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--accent) 13%,transparent),transparent 36%);pointer-events:none}.ms-slide>*{position:relative;z-index:1}.ms-kicker{display:flex;align-items:center;gap:9px;font:800 9px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.13em;color:var(--accent)}.ms-kicker span{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:var(--accent-dim);border:1px solid color-mix(in srgb,var(--accent) 35%,var(--border))}.ms-slide h2{margin:16px 0 0;font-size:clamp(32px,9.7vw,44px);line-height:1.02;letter-spacing:-.05em;text-wrap:balance}.ms-lead{margin:13px 0 0;font-size:14px;line-height:1.55;color:var(--text-muted);max-width:42rem}.ms-visual{margin-top:22px}.ms-next{margin-top:auto;padding-top:18px;text-align:center;font:700 8px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;color:var(--text-faint)}
      .ms-flow{display:grid;grid-template-columns:1fr;gap:7px}.ms-flow div{position:relative;display:grid;grid-template-columns:32px 1fr;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:14px;background:var(--surface)}.ms-flow div:not(:last-child):after{content:'↓';position:absolute;left:23px;bottom:-11px;color:var(--accent);z-index:2}.ms-flow small{font:800 9px ui-monospace,monospace;color:var(--accent)}.ms-flow b{font-size:13px}.ms-hub{position:relative;margin-top:10px;min-height:190px;border:1px solid var(--border);border-radius:22px;background:linear-gradient(145deg,var(--surface),var(--surface-hi));display:grid;place-items:center;overflow:hidden}.ms-hub strong{width:94px;height:94px;border-radius:24px;background:var(--accent);color:var(--accent-fg);display:grid;place-items:center;text-align:center;font-size:12px;line-height:1.05}.ms-hub span{position:absolute;padding:7px 8px;border:1px solid var(--border);border-radius:11px;background:var(--surface);font-size:9px;font-weight:800}.ms-hub .n1{top:12px;left:12px}.ms-hub .n2{top:12px;right:12px}.ms-hub .n3{bottom:12px;right:12px}.ms-hub .n4{bottom:12px;left:12px}
      .ms-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ms-metric{border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:14px}.ms-metric:first-child{grid-column:1/-1}.ms-num{font-size:42px;font-weight:900;line-height:.95;letter-spacing:-.06em;color:var(--accent)}.ms-metric strong{display:block;margin-top:8px;font-size:12px}.ms-metric p{margin:6px 0 0;font-size:9px;color:var(--text-faint)}
      .ms-boundaries{display:grid;gap:7px}.ms-layer{display:grid;grid-template-columns:80px 1fr auto;gap:8px;align-items:center;border:1px solid var(--border);border-radius:13px;background:var(--surface);padding:10px}.ms-layer b{font-size:10px;color:var(--accent)}.ms-layer span{font-size:10px;color:var(--text-muted)}.ms-layer i{width:9px;height:9px;border-radius:50%;background:var(--signal);box-shadow:0 0 0 4px color-mix(in srgb,var(--signal) 14%,transparent)}.ms-seams{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}.ms-seams div{border:1px solid var(--border);border-radius:13px;background:var(--surface-hi);padding:10px}.ms-seams b{display:block;font-size:9px;color:var(--accent)}.ms-seams span{display:block;margin-top:5px;font-size:10px;font-weight:700}
      .ms-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ms-card{border:1px solid var(--border);border-radius:15px;background:var(--surface);padding:13px;min-width:0}.ms-card b{display:block;font-size:9px;color:var(--accent)}.ms-card strong{display:block;margin-top:7px;font-size:13px;line-height:1.3;overflow-wrap:anywhere}.ms-card p{margin:6px 0 0;font-size:9px;line-height:1.4;color:var(--text-muted)}
      .ms-arch{display:grid;gap:7px}.ms-arch .ms-card{text-align:center}.ms-arrow{text-align:center;color:var(--accent);font-size:18px;height:18px;line-height:18px}.ms-repos{display:grid;grid-template-columns:1fr 1fr;gap:7px}.ms-repos a{text-decoration:none;color:inherit}.ms-repos .ms-card{min-height:88px;display:flex;flex-direction:column}.ms-repos .ms-card span{margin-top:auto;padding-top:7px;font-size:8px;font-weight:800;color:var(--accent)}
      @media(max-height:740px){.ms-slide{justify-content:flex-start;padding-top:54px;padding-bottom:30px}.ms-slide h2{font-size:30px}.ms-lead{font-size:13px;line-height:1.45}.ms-visual{margin-top:16px}.ms-next{padding-top:12px}.ms-hub{min-height:165px}.ms-card{padding:10px}.ms-repos .ms-card{min-height:74px}}
      @media(max-width:350px){.ms-metrics,.ms-grid,.ms-seams,.ms-repos{grid-template-columns:1fr}.ms-metric:first-child{grid-column:auto}.ms-slide{padding-left:12px;padding-right:12px}}
      @media(min-width:761px){.mobile-story{display:none}}
      @media(prefers-reduced-motion:reduce){.ms-scroll{scroll-snap-type:y proximity;scroll-behavior:auto}.mobile-story *{transition:none!important}}
    `}</style>
    <div className="ms-progress"><i style={{ width: `${((active + 1) / 8) * 100}%` }} /></div>
    <div className="ms-top"><span>OSS STORY</span><span>{String(active + 1).padStart(2, '0')} / 08</span></div>
    <div className="ms-scroll" ref={scroller}>
      {chapter(0, 'OPEN SOURCE ENGINEERING', t.hero, t.heroLead, <>
        <div className="ms-flow">{['Problem','Standards','Build','Verify','Share'].map((x,i)=><div key={x}><small>0{i+1}</small><b>{x}</b></div>)}</div>
        <div className="ms-hub"><strong>OSS<br/>WORKBENCH</strong><span className="n1">Standards</span><span className="n2">Platform</span><span className="n3">Evidence</span><span className="n4">Learning</span></div>
      </>)}
      {chapter(1, 'SIGNALS', t.signal, t.signalLead, <div className="ms-metrics">{[['82%','Kubernetes production','CNCF 2026'],['66%','GenAI inference on K8s','CNCF 2026'],['~1B','OSS / public contributions','GitHub Octoverse']].map(([n,l,s])=><div className="ms-metric" key={n}><div className="ms-num">{n}</div><strong>{l}</strong><p>{s}</p></div>)}</div>)}
      {chapter(2, 'COMPLEXITY MAP', t.complex, t.complexLead, <><div className="ms-boundaries">{[['Experience','Portal / API'],['Delivery','GitOps / CI'],['Platform','Kubernetes / Mesh'],['Foundation','Node / Network / Storage']].map(([a,b])=><div className="ms-layer" key={a}><b>{a}</b><span>{b}</span><i/></div>)}</div><div className="ms-seams">{[['IDENTITY','SSO ↔ RBAC'],['NETWORK','Ingress ↔ Mesh'],['STORAGE','PVC ↔ Backend'],['DELIVERY','Git ↔ Runtime']].map(([a,b])=><div key={a}><b>{a}</b><span>{b}</span></div>)}</div></>)}
      {chapter(3, 'GOVERNANCE', t.governance, t.governanceLead, <div className="ms-grid">{[['LICENSE','source · dependency · notice'],['RELEASE','tag · pin · artifact'],['SECURITY','review · scan · verify'],['DOCS','state · notes · guide']].map(([a,b])=><div className="ms-card" key={a}><b>{a}</b><strong>{b}</strong></div>)}</div>)}
      {chapter(4, 'ENGINEERING LOOP', t.loop, t.loopLead, <div className="ms-grid">{[['01','Define','problem'],['02','Build','working slice'],['03','Integrate','boundaries'],['04','Verify','checks'],['05','Document','decision'],['06','Share','lesson']].map(([n,a,b])=><div className="ms-card" key={n}><b>{n}</b><strong>{a}</strong><p>{b} → evidence</p></div>)}</div>)}
      {chapter(5, 'SYSTEM ARCHITECTURE', t.arch, t.archLead, <div className="ms-arch"><div className="ms-card"><b>STANDARDS / BASELINE</b><strong>OpenForge · kube-ready-box</strong></div><div className="ms-arrow">↓</div><div className="ms-card"><b>PLATFORM / EXPERIENCE</b><strong>Narwhal · Narwhal Portal</strong></div><div className="ms-arrow">↓</div><div className="ms-card"><b>CAPABILITY / WORKLOAD</b><strong>ldapium · nfs-quota-agent · Beluga · KubeMetal</strong></div></div>)}
      {chapter(6, 'ENGINEERING EVIDENCE', t.evidence, t.evidenceLead, <div className="ms-metrics">{[['35','Narwhal GitOps apps'],['51','CI regression checks'],['263','integration / incident lessons']].map(([n,l])=><div className="ms-metric" key={n}><div className="ms-num">{n}</div><strong>{l}</strong><p>{en?'Inspectable engineering signal':'다시 확인 가능한 engineering signal'}</p></div>)}</div>)}
      {chapter(7, 'OSS WORKBENCH MAP', t.map, t.mapLead, <div className="ms-repos">{repos.map(([name,role,slug])=><Link href={`${base}/projects/${slug}`} className="ms-card" key={name}><b>{role}</b><strong>{name}</strong><span>OPEN →</span></Link>)}</div>)}
    </div>
  </main>;
}
