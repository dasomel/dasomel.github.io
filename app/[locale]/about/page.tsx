import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Github, MapPin, Briefcase, Award, FileText, Globe, Code, ExternalLink, Users, ClipboardCheck, Wrench, BookOpen, BrainCircuit } from 'lucide-react';
import { narrativeIntro, communityActivities, mentoringActivities, expertActivities, awards, researchReports } from '@/lib/data/about';
import { getProjects, getNotes, getSeminars } from '@/lib/content';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('title'),
    description: locale === 'en'
      ? 'OSS Workbench — how I build, learn, verify, and rethink Cloud Native systems.'
      : 'OSS Workbench — Cloud Native 시스템을 만들고, 배우고, 검증하고, 다시 생각하는 작업 기록.',
  };
}

function SectionHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; title: string }) {
  return <div className="flex items-center gap-4 mb-6"><Icon className="w-4 h-4" style={{ color: 'var(--text-faint)' }} /><h2 className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{title}</h2><div className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--border)' }} /></div>;
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const lang = isEn ? 'en' : 'ko';
  const projects = getProjects(lang).filter(p => p.type !== 'fork');
  const notes = getNotes(lang);
  const seminars = getSeminars(lang);
  const conferences = [...new Set(seminars.map(s => s.event))];

  const roles = isEn ? [
    { icon: '🔧', role: 'Cloud & DevOps Engineer', period: '2013 — Present', desc: 'K-PaaS Lite founder · Kubernetes platform engineering · OSS development' },
    { icon: '🎓', role: 'Adjunct Professor', org: 'Tech University of Korea', period: '2026 — Present', desc: 'Teaching software framework engineering' },
    { icon: '🌐', role: 'Community Leader', period: '2015 — Present', desc: 'CloudBro · OPA · OPDC' },
  ] : [
    { icon: '🔧', role: 'Cloud & DevOps Engineer', period: '2013 — 현재', desc: 'K-PaaS Lite 파운더 · Kubernetes 플랫폼 엔지니어링 · OSS 개발' },
    { icon: '🎓', role: '겸임교수', org: '한국공학대학교', period: '2026 — 현재', desc: 'SW 프레임워크 엔지니어링 강의' },
    { icon: '🌐', role: '커뮤니티 리더', period: '2015 — 현재', desc: 'CloudBro · OPA · OPDC' },
  ];

  const contributions = [
    { name: 'OpenMetadata', desc: isEn ? 'Korean (ko-kr) language support merged into v1.7.1.' : '한국어(ko-kr) 지원을 추가해 v1.7.1에 공식 반영.', url: 'https://github.com/open-metadata/OpenMetadata/pull/21035' },
    { name: 'KakaoCloud Terraform Provider', desc: isEn ? 'Reported SDK provisioning-state bug and helped get it resolved.' : 'SDK provisioning 상태 누락 버그를 발견하고 해결에 기여.', url: 'https://github.com/kakaoenterprise/terraform-provider-kakaocloud/issues/1' },
  ];

  const sortedAwards = [...awards].sort((a, b) => b.year - a.year);

  return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 slide-enter-content">
    <section className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 mb-16 items-start">
      <div>
        <div className="workbench-eyebrow mb-4">OSS WORKBENCH · ABOUT</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5" style={{ color: 'var(--text)' }}>{isEn ? 'I build infrastructure in public.' : '인프라를 공개적으로 만듭니다.'}</h1>
        <p className="text-lg leading-relaxed max-w-2xl mb-6" style={{ color: 'var(--text-muted)' }}>{isEn ? 'I build Cloud Native platforms and OSS, then use writing to verify what I think I understand. This site is the workbench: projects, experiments, notes, failures, and the questions that remain.' : 'Cloud Native 플랫폼과 OSS를 만들고, 글쓰기를 통해 내가 이해했다고 생각한 것이 맞는지 검증합니다. 이 사이트는 프로젝트, 실험, 기록, 실패, 그리고 아직 남아 있는 질문을 모아두는 작업장입니다.'}</p>
        <div className="flex flex-wrap gap-2 mb-6">{(isEn ? ['OSS', 'Platform Engineering', 'Kubernetes', 'AI-assisted Development', 'Reproducible Systems'] : ['OSS', '플랫폼 엔지니어링', 'Kubernetes', 'AI-assisted Development', '재현 가능한 시스템']).map(tag => <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-mono" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--surface)' }}>{tag}</span>)}</div>
        <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}><MapPin className="w-4 h-4" />{isEn ? 'Korea' : '대한민국'}</div>
      </div>
      <div className="rounded-2xl p-6" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-faint)' }}>{isEn ? 'HOW I WORK' : 'ENGINEERING PHILOSOPHY'}</div>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <div className="flex gap-3"><Wrench className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>{isEn ? 'Define the user problem before choosing the architecture.' : '아키텍처보다 먼저 사용자의 문제를 정의합니다.'}</span></div>
          <div className="flex gap-3"><BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>{isEn ? 'Write while learning, especially when the answer is not settled.' : '아직 답이 정해지지 않은 주제일수록 배우면서 씁니다.'}</span></div>
          <div className="flex gap-3"><BrainCircuit className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} /><span>{isEn ? 'Use AI to accelerate exploration and implementation; keep judgment and verification human.' : 'AI로 탐색과 구현을 빠르게 하되 판단과 검증은 직접 합니다.'}</span></div>
        </div>
      </div>
    </section>

    <section className="grid md:grid-cols-3 gap-3 mb-16">{[
      { label: isEn ? 'Active OSS' : '진행 중 OSS', value: projects.length, icon: Wrench },
      { label: 'Engineering Notes', value: notes.length, icon: BookOpen },
      { label: isEn ? 'Talks' : '발표', value: seminars.length, icon: Globe },
    ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><Icon className="w-4 h-4 mb-4" style={{ color: 'var(--accent)' }} /><div className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{value}</div><div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{label}</div></div>)}</section>

    <section className="mb-16"><SectionHeader icon={Wrench} title={isEn ? 'What I Build' : '무엇을 만드는가'} /><div className="grid md:grid-cols-2 gap-3">{projects.slice(0, 6).map(project => <a key={project.slug} href={`/${lang}/projects/${project.slug}`} className="rounded-2xl p-5 group" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="flex items-center justify-between gap-3 mb-2"><h3 className="font-semibold group-hover:text-emerald-500" style={{ color: 'var(--text)' }}>{project.title}</h3><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{project.tags[0]}</span></div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.description}</p></a>)}</div></section>

    <div className="border-l-2 pl-5 mb-16" style={{ borderColor: 'var(--accent)' }}><p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{isEn ? narrativeIntro.en : narrativeIntro.ko}</p></div>

    <section className="mb-16"><SectionHeader icon={Briefcase} title={isEn ? 'Roles' : '역할'} /><div className="space-y-3">{roles.map((r, i) => <div key={i} className="p-5 rounded-xl" style={{ border: '1px solid var(--border)' }}><div className="flex items-start justify-between gap-4 mb-2"><div><h3 className="font-bold" style={{ color: 'var(--text)' }}>{r.icon} {r.role}</h3>{'org' in r && r.org && <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{r.org}</p>}</div><span className="font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{r.period}</span></div><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.desc}</p></div>)}</div></section>

    <section className="grid lg:grid-cols-2 gap-8 mb-16">
      <div><SectionHeader icon={Globe} title={isEn ? 'Community' : '커뮤니티'} /><div className="space-y-3">{communityActivities.slice(0, 6).map((a, i) => <div key={i} className="p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{a.org}</div><div className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{a.role}</div></div><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{a.period}</span></div><p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.desc}</p></div>)}</div></div>
      <div><SectionHeader icon={Code} title={isEn ? 'Open Source Contributions' : '오픈소스 기여'} /><div className="space-y-3">{contributions.map(c => <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-4 rounded-xl group" style={{ border: '1px solid var(--border)' }}><div><div className="font-semibold group-hover:text-emerald-500" style={{ color: 'var(--text)' }}>{c.name}</div><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.desc}</p></div><ExternalLink className="w-4 h-4" style={{ color: 'var(--text-faint)' }} /></a>)}</div></div>
    </section>

    <section className="mb-16"><SectionHeader icon={ClipboardCheck} title={isEn ? 'Expert & Mentoring' : '전문가 · 멘토링 활동'} /><div className="grid md:grid-cols-2 gap-8"><div className="space-y-1">{expertActivities.map((a, i) => <div key={i} className="flex items-center justify-between py-2 gap-4"><span className="text-sm" style={{ color: 'var(--text)' }}>{a.title} <span className="text-xs" style={{ color: 'var(--accent)' }}>({a.role})</span></span><span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{a.org} · {a.year}</span></div>)}</div><div className="space-y-1">{mentoringActivities.slice(0, 8).map((a, i) => <div key={i} className="flex items-center justify-between py-2 gap-4"><span className="text-sm" style={{ color: 'var(--text)' }}>{a.title}{a.note && <span className="text-xs ml-2" style={{ color: 'var(--accent)' }}>({a.note})</span>}</span><span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{a.org} · {a.year}</span></div>)}</div></div></section>

    <section className="grid lg:grid-cols-2 gap-8 mb-16"><div><SectionHeader icon={Award} title={isEn ? 'Awards' : '수상'} /><div className="space-y-1">{sortedAwards.slice(0, 10).map((award, i) => <div key={i} className="flex items-center justify-between py-2 gap-4"><span className={`text-sm ${award.highlight ? 'font-bold' : ''}`} style={{ color: award.highlight ? 'var(--accent)' : 'var(--text)' }}>{award.title}</span><span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{award.org} · {award.year}</span></div>)}</div></div><div><SectionHeader icon={FileText} title={isEn ? 'Research Reports' : '연구보고서'} /><div className="space-y-1">{researchReports.slice(0, 10).map((report, i) => <div key={i} className="flex items-center justify-between py-2 gap-4">{report.url ? <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-70" style={{ color: 'var(--text)' }}>{report.title}</a> : <span className="text-sm" style={{ color: 'var(--text)' }}>{report.title}</span>}<span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{report.client} · {report.year}</span></div>)}</div></div></section>

    <section className="mb-10"><SectionHeader icon={Globe} title={isEn ? 'Conferences' : '컨퍼런스'} /><div className="flex flex-wrap gap-2">{conferences.map(conf => <span key={conf} className="px-2 py-1 text-xs rounded-md" style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{conf}</span>)}</div></section>

    <div className="flex flex-wrap items-center gap-3 pt-6" style={{ borderTop: '1px solid var(--border)' }}><a href="https://github.com/dasomel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ border: '1px solid var(--border)', color: 'var(--text)' }}><Github className="w-4 h-4" />GitHub</a><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{isEn ? 'Build in public. Learn in public.' : '만들면서 배우고, 배운 것을 공개합니다.'}</span></div>
  </div>;
}
