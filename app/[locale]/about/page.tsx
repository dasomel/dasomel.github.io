import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Github, MapPin, Briefcase, Shield, Award, FileText, Globe, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { narrativeIntro, communityActivities, mentoringActivities, expertActivities, awards, researchReports } from '@/lib/data/about';
import { ExternalLink, Users, ClipboardCheck } from 'lucide-react';
import { getSeminars } from '@/lib/content';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const lang = isEn ? 'en' : 'ko';

  const roles = isEn ? [
    {
      icon: '🔧',
      role: 'Cloud & DevOps Engineer',
      period: '2013 — Present',
      desc: 'K-PaaS Lite founder · Harbor/Terraboard forks · Kubernetes infrastructure design & operations',
    },
    {
      icon: '🎓',
      role: 'Adjunct Professor',
      org: 'Tech University of Korea (TUK)',
      period: '2024 — Present',
      desc: 'Dept. of IT Management · Lecturing on SW Framework',
    },
    {
      icon: '🌐',
      role: 'Community Leader',
      period: '2018 — Present',
      desc: 'OPA (Open cloud Platform Alliance) · OPDC (Open Platform Developer Community)',
    },
  ] : [
    {
      icon: '🔧',
      role: 'Cloud & DevOps Engineer',
      period: '2013 — 현재',
      desc: 'K-PaaS Lite 파운더 · Harbor/Terraboard 포크 · Kubernetes 인프라 설계 및 운영',
    },
    {
      icon: '🎓',
      role: '겸임교수',
      org: '한국공학대학교 (TUK)',
      period: '2024 — 현재',
      desc: 'IT경영전공 · SW프레임워크 강의',
    },
    {
      icon: '🌐',
      role: '커뮤니티 리더',
      period: '2018 — 현재',
      desc: 'OPA (Open cloud Platform Alliance) · OPDC (Open Platform Developer Community)',
    },
  ];

  const contributions = [
    {
      name: 'Harbor',
      desc: isEn
        ? 'ARM architecture not supported → Forked and built multi-arch pipeline'
        : 'ARM 아키텍처 미지원 문제 → 직접 포크하여 해결',
      url: 'https://github.com/goharbor/harbor',
    },
    {
      name: 'Terraboard',
      desc: isEn
        ? 'Stuck on old Terraform version → Forked with latest version support'
        : '구버전 고착 문제 → 최신 Terraform 버전 적용 포크',
      url: 'https://github.com/camptocamp/terraboard',
    },
  ];

  const seminars = getSeminars(lang);
  const conferences = [...new Set(seminars.map(s => s.event))];

  const sortedAwards = [...awards].sort((a, b) => b.year - a.year);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Profile Header */}
      <section className="mb-16">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">dasomel</h1>
            <p className="text-lg text-emerald-600 font-medium mb-3">
              Cloud Engineer · Professor · Community Leader
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{isEn ? 'Korea' : '대한민국'}</span>
            </div>
            <div className="flex gap-3">
              <a href="https://github.com/dasomel" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition-all">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
          <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            D
          </div>
        </div>
      </section>

      {/* Narrative Intro */}
      <div className="border-l-2 border-emerald-500 pl-4 my-8">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {isEn ? narrativeIntro.en : narrativeIntro.ko}
        </p>
      </div>

      {/* Roles */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Roles' : '역할'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-4">
          {roles.map((r, i) => (
            <Card key={i} className="p-5 border-l-4 border-l-emerald-500">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {r.icon} {r.role}
                  </h3>
                  {'org' in r && r.org && (
                    <p className="text-emerald-600 text-sm font-medium">{r.org}</p>
                  )}
                </div>
                <span className="font-mono text-xs text-gray-400 whitespace-nowrap">{r.period}</span>
              </div>
              <p className="text-sm text-gray-500">{r.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Activities */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Globe className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Community' : '커뮤니티 활동'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-3">
          {communityActivities.map((a, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{a.org}</h3>
                  <span className="text-xs" style={{ color: 'var(--accent)' }}>{a.role}</span>
                </div>
                <span className="text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{a.period}</span>
              </div>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
              {a.urls && a.urls.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {a.urls.map((url, j) => (
                    <a key={j} href={url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs hover:text-emerald-500 transition-colors" style={{ color: 'var(--text-faint)' }}>
                      <ExternalLink className="w-3 h-3" /> {isEn ? 'Link' : '관련 기사'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mentoring */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Mentoring' : '멘토링'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-1">
          {mentoringActivities.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <span className="text-sm" style={{ color: 'var(--text)' }}>
                  {a.url ? (
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                      {a.title}
                    </a>
                  ) : a.title}
                </span>
                {a.note && (
                  <span className="text-xs ml-2" style={{ color: 'var(--accent)' }}>({a.note})</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{a.org}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{a.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expert Activities */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <ClipboardCheck className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Expert Activities' : '전문가 활동'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-1">
          {expertActivities.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <span className="text-sm" style={{ color: 'var(--text)' }}>{a.title}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--accent)' }}>({a.role})</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{a.org}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{a.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Award className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Awards' : '수상 이력'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-1">
          {sortedAwards.map((award, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span
                className={`text-sm ${award.highlight ? 'font-bold' : ''}`}
                style={{ color: award.highlight ? 'var(--accent)' : 'var(--text)' }}
              >
                🏆 {award.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{award.org}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{award.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Research Reports */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <FileText className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Research Reports' : '연구보고서'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-1">
          {researchReports.map((report, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              {report.url ? (
                <a href={report.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm hover:text-emerald-500 transition-colors" style={{ color: 'var(--text)' }}>
                  📄 {report.title}
                </a>
              ) : (
                <span className="text-sm" style={{ color: 'var(--text)' }}>📄 {report.title}</span>
              )}
              <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                {report.client} · {report.year}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Conference Wall */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Globe className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Conferences' : '컨퍼런스'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="flex flex-wrap gap-2">
          {conferences.map(conf => (
            <span key={conf} className="px-2 py-1 text-xs rounded-md"
              style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {conf}
            </span>
          ))}
        </div>
      </section>

      {/* OSS Contributions */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Code className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">
            {isEn ? 'Open Source' : '오픈소스 기여'}
          </h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-3">
          {contributions.map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-l-emerald-500 hover:shadow-sm transition-all group">
              <div>
                <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{c.name}</span>
                <p className="text-sm text-gray-500 mt-0.5">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
