import Link from 'next/link';

const projects = [
  { name: 'OpenForge', role: 'Engineering standards', desc: 'OSS 프로젝트를 반복 가능하게 만드는 저장소 구조·문서·CI·공급망 기준', href: 'https://github.com/dasomel/openforge' },
  { name: 'kube-ready-box', role: 'Kubernetes baseline', desc: 'Narwhal과 로컬 Kubernetes 실험 환경이 공유하는 Ubuntu/XFS 기반 노드 베이스라인', href: 'https://github.com/dasomel/kube-ready-box' },
  { name: 'Narwhal', role: 'Internal Developer Platform', desc: 'GitOps·SSO·Mesh·Observability·Registry·Storage·Backup·Policy를 하나의 운영 단위로 통합', href: 'https://github.com/dasomel/narwhal' },
  { name: 'Narwhal Portal', role: 'Management experience', desc: '플랫폼 사용자가 클러스터와 서비스를 탐색·운영하는 관리 포털 계층', href: 'https://github.com/dasomel/narwhal-portal' },
  { name: 'nfs-quota-agent', role: 'Storage enforcement', desc: 'NFS 기반 영속 스토리지에서 프로젝트/워크로드 단위 quota 운영을 보완하는 에이전트', href: 'https://github.com/dasomel/nfs-quota-agent' },
  { name: 'ldapium', role: 'Directory infrastructure', desc: 'LDAP/Directory 연동을 단순화하고 플랫폼의 identity 경계와 연결하는 프로젝트', href: 'https://github.com/dasomel/ldapium' },
  { name: 'Beluga', role: 'Data platform', desc: 'CDC부터 lakehouse/query까지 데이터 lifecycle을 실제 운영 가능한 흐름으로 연결', href: 'https://github.com/dasomel/beluga' },
  { name: 'KubeMetal', role: 'Local AI / Edge', desc: 'Apple Silicon native compute와 Kubernetes control plane을 결합하는 로컬 AI/MLOps 실험 플랫폼', href: 'https://github.com/dasomel/kubemetal' },
];

function RepoCard({ name, role, desc, href, featured = false }: (typeof projects[number]) & { featured?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`repo-card ${featured ? 'featured' : ''}`}>
      <div className="repo-top"><span className="repo-dot" /><span>{role}</span></div>
      <h3>{name}</h3>
      <p>{desc}</p>
      <span className="repo-link">GitHub ↗</span>
    </a>
  );
}

export default function OssDeckPage() {
  return (
    <main className="deck" data-deck="oss">
      <style>{`
        :root { --ink:#101114; --muted:#656a73; --line:#dfe2e6; --paper:#f7f7f4; --card:#fff; --accent:#0b6b57; --accent2:#d7efe8; --dark:#111315; }
        * { box-sizing:border-box; }
        html { scroll-behavior:smooth; background:var(--paper); }
        body { margin:0; background:var(--paper); color:var(--ink); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .deck { width:100%; }
        .slide { width:min(100vw, 1600px); min-height:100vh; aspect-ratio:16 / 9; margin:0 auto; padding:clamp(34px,5vw,88px); display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden; background:var(--paper); }
        .slide.dark { background:var(--dark); color:#f5f6f6; }
        .slide::before { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(135deg, rgba(11,107,87,.07), transparent 42%, rgba(16,17,20,.025)); }
        .dark::before { background:radial-gradient(circle at 80% 18%, rgba(42,166,133,.18), transparent 28%); }
        .content { position:relative; z-index:1; }
        .eyebrow { font-size:12px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--accent); }
        .dark .eyebrow { color:#75d2b7; }
        h1,h2,h3,p { margin:0; }
        h1 { font-size:clamp(48px,7vw,108px); line-height:.98; letter-spacing:-.05em; max-width:1100px; }
        h2 { font-size:clamp(34px,4.4vw,70px); line-height:1.02; letter-spacing:-.045em; max-width:1100px; }
        h3 { font-size:clamp(18px,1.8vw,28px); letter-spacing:-.02em; }
        .lead { margin-top:22px; max-width:920px; font-size:clamp(17px,1.6vw,25px); line-height:1.55; color:var(--muted); }
        .dark .lead { color:#c0c4c7; }
        .meta { display:flex; gap:10px; flex-wrap:wrap; margin-top:30px; }
        .pill { border:1px solid var(--line); background:rgba(255,255,255,.72); border-radius:999px; padding:9px 13px; font-size:12px; font-weight:700; }
        .dark .pill { border-color:#343a3f; background:#191d20; color:#cbd0d3; }
        .hero-grid { display:grid; grid-template-columns:1.1fr .9fr; gap:30px; align-items:end; }
        .hero-mark { border:1px solid rgba(11,107,87,.2); background:linear-gradient(180deg,#edf8f4,#e6f2ee); border-radius:32px; min-height:340px; padding:30px; display:flex; align-items:center; justify-content:center; }
        .mark { width:min(82%,430px); aspect-ratio:1.25; border:2px solid #0b6b57; border-radius:40px; position:relative; display:grid; place-items:center; }
        .mark span { position:absolute; border:1px solid rgba(11,107,87,.28); background:#f9fffd; border-radius:999px; padding:8px 12px; font-weight:800; font-size:12px; }
        .mark .a{top:9%;left:12%}.mark .b{top:8%;right:11%}.mark .c{bottom:11%;left:13%}.mark .d{bottom:10%;right:11%}.mark .core{position:static;background:#0b6b57;color:#fff;border-color:#0b6b57;padding:20px 28px;font-size:22px;}
        .note { font-size:12px; color:#777d84; line-height:1.5; }
        .dark .note { color:#858c91; }
        .foot { display:flex; justify-content:space-between; align-items:flex-end; gap:20px; font-size:11px; color:#7b8188; }
        .dark .foot { color:#767d83; }
        .slide-no { font-variant-numeric:tabular-nums; font-weight:800; letter-spacing:.08em; }
        .map { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:34px; }
        .map-col { border:1px solid var(--line); background:rgba(255,255,255,.72); border-radius:22px; padding:22px; min-height:250px; }
        .map-col h3 { margin-top:8px; }
        .map-col ul { list-style:none; padding:0; margin:18px 0 0; display:grid; gap:9px; color:var(--muted); font-size:13px; }
        .map-col li::before { content:'•'; color:var(--accent); margin-right:8px; font-weight:900; }
        .split { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:34px; }
        .panel { border:1px solid var(--line); background:rgba(255,255,255,.75); border-radius:24px; padding:28px; }
        .panel strong { color:var(--accent); }
        .quote { font-size:clamp(25px,3vw,47px); line-height:1.15; letter-spacing:-.03em; }
        .flow { display:grid; grid-template-columns:1fr auto 1fr auto 1fr; align-items:center; gap:14px; margin-top:38px; }
        .node { border:1px solid var(--line); border-radius:20px; padding:22px; background:#fff; min-height:130px; }
        .node.primary { border-color:#0b6b57; background:#eaf6f2; }
        .arrow { font-size:26px; color:#8a9096; }
        .repos { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-top:28px; }
        .repo-card { display:block; border:1px solid var(--line); border-radius:20px; padding:20px; text-decoration:none; color:inherit; background:#fff; transition:transform .15s ease, border-color .15s ease; }
        .repo-card:hover { transform:translateY(-3px); border-color:#9dcfc0; }
        .repo-card.featured { background:#ecf7f3; border-color:#9dcfc0; }
        .repo-top { display:flex; gap:8px; align-items:center; color:#7a8087; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.11em; }
        .repo-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); }
        .repo-card h3 { margin-top:9px; }
        .repo-card p { margin-top:7px; color:var(--muted); font-size:13px; line-height:1.5; }
        .repo-link { display:inline-block; margin-top:12px; color:var(--accent); font-size:12px; font-weight:800; }
        .evidence { display:grid; grid-template-columns:1.2fr .8fr; gap:20px; margin-top:30px; }
        .numbers { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .stat { border:1px solid #2f353a; background:#171a1d; border-radius:18px; padding:20px; }
        .stat b { display:block; font-size:40px; letter-spacing:-.04em; }
        .stat span { display:block; margin-top:6px; font-size:11px; color:#939aa0; line-height:1.45; }
        .check { border-left:3px solid #75d2b7; padding-left:18px; margin-top:14px; color:#c4c9cc; line-height:1.6; }
        .cta { margin-top:34px; display:flex; gap:12px; flex-wrap:wrap; }
        .btn { display:inline-flex; align-items:center; justify-content:center; padding:12px 16px; border-radius:999px; border:1px solid var(--line); background:#fff; color:var(--ink); text-decoration:none; font-size:13px; font-weight:800; }
        .btn.primary { background:var(--accent); color:#fff; border-color:var(--accent); }
        .dark .btn { background:#191d20; border-color:#30363b; color:#f1f3f4; }
        .dark .btn.primary { background:#2a9f81; border-color:#2a9f81; color:#07130f; }
        .copyright { margin-top:18px; max-width:900px; font-size:11px; line-height:1.55; color:#858b91; }
        .copyright strong { color:inherit; }
        .toolbar { position:fixed; right:18px; bottom:18px; z-index:50; display:flex; gap:6px; }
        .toolbar button { border:1px solid #cfd3d6; background:rgba(255,255,255,.92); border-radius:12px; padding:9px 11px; cursor:pointer; font-weight:800; color:#25282c; box-shadow:0 4px 16px rgba(0,0,0,.08); }
        .toolbar button:hover { transform:translateY(-1px); }
        @media (max-width:900px) { .slide{aspect-ratio:auto; min-height:100svh; padding:32px 24px 26px;} .hero-grid,.split,.evidence{grid-template-columns:1fr;} .map{grid-template-columns:repeat(2,1fr);} .flow{grid-template-columns:1fr;}.arrow{display:none}.numbers{grid-template-columns:1fr 1fr 1fr}.repos{grid-template-columns:1fr;} }
        @media print { .toolbar{display:none}.slide{break-after:page; min-height:auto; height:100vh; width:100vw;}.slide:last-of-type{break-after:auto}.btn{display:none} body{background:#fff} }
      `}</style>

      <div className="toolbar" aria-label="Deck controls">
        <button onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })}>↓ Next</button>
        <button onClick={() => document.documentElement.requestFullscreen?.()}>⛶ Fullscreen</button>
        <button onClick={() => window.print()}>⎙ Print</button>
      </div>

      <section className="slide" id="s1">
        <div className="content hero-grid" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <div>
            <div className="eyebrow">Open Source Portfolio · dasomel</div>
            <h1 style={{ marginTop: 18 }}>OSS를 만들다.<br />Narwhal로 연결하다.</h1>
            <p className="lead">Kubernetes 플랫폼을 만들면서 반복해서 만난 문제를 작은 OSS로 분리하고, 다시 하나의 운영 경험으로 검증했습니다.</p>
            <div className="meta"><span className="pill">Cloud Native</span><span className="pill">Kubernetes</span><span className="pill">Platform Engineering</span><span className="pill">Open Source</span></div>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <div className="mark"><span className="a">Foundation</span><span className="b">Platform</span><span className="c">Data</span><span className="d">Local AI</span><span className="core">Narwhal</span></div>
          </div>
        </div>
        <div className="foot"><span>What are these OSS?</span><span className="slide-no">01 / 07</span></div>
      </section>

      <section className="slide" id="s2">
        <div className="content">
          <div className="eyebrow">01 · The Portfolio</div>
          <h2 style={{ marginTop: 15 }}>프로젝트가 많은 이유는<br />관심사가 많아서가 아닙니다.</h2>
          <p className="lead">하나의 플랫폼을 운영할수록 “통합 경계”에서 반복되는 문제가 생깁니다. 이 포트폴리오는 그 경계를 각각의 재사용 가능한 OSS로 분리한 결과입니다.</p>
          <div className="map">
            <div className="map-col"><div className="eyebrow">Foundation</div><h3>만드는 방법</h3><ul><li>OpenForge</li><li>kube-ready-box</li><li>reproducible baseline</li></ul></div>
            <div className="map-col"><div className="eyebrow">Platform</div><h3>운영하는 방법</h3><ul><li>Narwhal</li><li>Narwhal Portal</li><li>nfs-quota-agent</li><li>ldapium</li></ul></div>
            <div className="map-col"><div className="eyebrow">Data</div><h3>흐르게 하는 방법</h3><ul><li>Beluga</li><li>Beluga Manager</li><li>lakehouse / query</li></ul></div>
            <div className="map-col"><div className="eyebrow">Edge / AI</div><h3>가볍게 실험하는 방법</h3><ul><li>KubeMetal</li><li>Apple Silicon</li><li>local AI / MLOps</li></ul></div>
          </div>
        </div>
        <div className="foot"><span>Independent repositories, shared engineering intent.</span><span className="slide-no">02 / 07</span></div>
      </section>

      <section className="slide dark" id="s3">
        <div className="content">
          <div className="eyebrow">02 · Narwhal as the Center</div>
          <h2 style={{ marginTop: 15 }}>Narwhal은<br />Kubernetes 설치기가 아닙니다.</h2>
          <div className="split">
            <div className="panel" style={{ background:'#171a1d', borderColor:'#343a3f', color:'#f5f6f6' }}>
              <div className="quote">어려운 것은 클러스터를 만드는 일이 아니라, <strong>서로 다른 시스템이 계속 함께 동작하게 만드는 일</strong>입니다.</div>
            </div>
            <div className="panel" style={{ background:'#171a1d', borderColor:'#343a3f' }}>
              <div className="eyebrow">The seams</div>
              <div className="check">DNS · certificates · identity · networking</div>
              <div className="check">startup order · version compatibility</div>
              <div className="check">air-gapped delivery · upgrade regression</div>
              <div className="check">storage · policy · observability · backup</div>
            </div>
          </div>
          <div className="flow">
            <div className="node"><b>OSS building blocks</b><br/><span className="note">작고 분리된 문제 단위</span></div><div className="arrow">→</div>
            <div className="node primary"><b>Narwhal</b><br/><span className="note">통합·설치·검증·운영</span></div><div className="arrow">→</div>
            <div className="node"><b>Developer Platform</b><br/><span className="note">사용자가 경험하는 하나의 시스템</span></div>
          </div>
        </div>
        <div className="foot"><span>Concept from Narwhal README · paraphrased, not quoted.</span><span className="slide-no">03 / 07</span></div>
      </section>

      <section className="slide" id="s4">
        <div className="content">
          <div className="eyebrow">03 · How the OSS Connect</div>
          <h2 style={{ marginTop: 15 }}>실행 의존성과<br />engineering 관계를 구분합니다.</h2>
          <p className="lead">모든 저장소가 Narwhal에 런타임 종속되는 것은 아닙니다. 어떤 프로젝트는 기반을 제공하고, 어떤 프로젝트는 운영 경계를 보완하고, 어떤 프로젝트는 사례와 표준을 제공합니다.</p>
          <div className="repos">
            <RepoCard {...projects[0]} />
            <RepoCard {...projects[1]} />
            <RepoCard {...projects[2]} featured />
            <RepoCard {...projects[3]} />
          </div>
        </div>
        <div className="foot"><span>Relation ≠ dependency. It is an engineering portfolio.</span><span className="slide-no">04 / 07</span></div>
      </section>

      <section className="slide dark" id="s5">
        <div className="content">
          <div className="eyebrow">04 · Evidence over screenshots</div>
          <h2 style={{ marginTop: 15 }}>운영에서 생긴 실패를<br />다시 테스트로 바꿉니다.</h2>
          <div className="evidence">
            <div>
              <p className="lead">Narwhal은 통합 과정에서 만난 문제를 버리지 않고, 원인과 식별 단서를 기록한 뒤 회귀 검증에 연결하는 루프를 갖습니다.</p>
              <div className="check">Incident → Lesson → Discriminator → Regression test</div>
              <div className="check">재현 가능한 설치 · CI 검증 · 네트워크 격리 테스트</div>
            </div>
            <div className="numbers">
              <div className="stat"><b>483</b><span>commits<br/>2026-02-08 이후</span></div>
              <div className="stat"><b>51</b><span>regression<br/>checks</span></div>
              <div className="stat"><b>263</b><span>documented<br/>incidents</span></div>
            </div>
          </div>
          <p className="copyright">수치는 Narwhal README의 현재 공개 상태를 기준으로 표시합니다. 저장소의 세부 버전·상태가 변경될 수 있으므로 최신 현황은 원문을 확인하세요.</p>
        </div>
        <div className="foot"><span>Evidence loop is the product.</span><span className="slide-no">05 / 07</span></div>
      </section>

      <section className="slide" id="s6">
        <div className="content">
          <div className="eyebrow">05 · The Other Projects</div>
          <h2 style={{ marginTop: 15 }}>Narwhal 주변의 OSS도<br />각자 하나의 문제를 맡습니다.</h2>
          <div className="repos">
            <RepoCard {...projects[4]} /><RepoCard {...projects[5]} /><RepoCard {...projects[6]} /><RepoCard {...projects[7]} />
          </div>
        </div>
        <div className="foot"><span>Storage · Identity · Data · Local AI</span><span className="slide-no">06 / 07</span></div>
      </section>

      <section className="slide dark" id="s7">
        <div className="content" style={{ marginTop:'auto', marginBottom:'auto' }}>
          <div className="eyebrow">06 · Explore</div>
          <h2 style={{ marginTop: 15 }}>“그래서 이 OSS는<br />뭘 해결하나요?”</h2>
          <p className="lead">프로젝트 이름보다 문제와 연결 구조부터 보세요. 각 저장소의 README와 문서로 바로 이어질 수 있게 만들었습니다.</p>
          <div className="cta">
            <a className="btn primary" href="/oss/">OSS Portfolio ↗</a>
            <a className="btn" href="https://github.com/dasomel/narwhal" target="_blank" rel="noreferrer">Narwhal ↗</a>
            <a className="btn" href="https://github.com/dasomel" target="_blank" rel="noreferrer">GitHub / dasomel ↗</a>
          </div>
          <p className="copyright"><strong>Copyright & attribution note.</strong> 이 deck의 문구·레이아웃·도형은 본 사이트에서 새로 작성한 콘텐츠입니다. 외부 이미지, 폰트 파일, 제3자 로고 이미지는 포함하지 않습니다. 프로젝트명과 관련 상표는 각 권리자에게 귀속될 수 있으며, 각 저장소의 라이선스가 개별적으로 적용됩니다. 저장소 내용을 그대로 복제하지 않고 목적에 맞게 요약했습니다.</p>
        </div>
        <div className="foot"><span>Original HTML/CSS/SVG composition · no external media assets</span><span className="slide-no">07 / 07</span></div>
      </section>
    </main>
  );
}
`}
