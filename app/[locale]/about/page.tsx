import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Github, ExternalLink, MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  const skills = {
    'Cloud & PaaS': ['K-PaaS', 'Cloud Foundry', 'Kubernetes', 'Docker'],
    'DevOps': ['Terraform', 'Ansible', 'GitHub Actions', 'Jenkins'],
    'Monitoring': ['Prometheus', 'Grafana', 'ELK Stack'],
    'Languages': ['Go', 'Python', 'Shell', 'Java'],
  };

  const experiences = isEn ? [
    {
      role: 'Adjunct Professor, Dept. of IT Management (School of Business Administration)',
      org: 'Tech University of Korea (TUK)',
      period: '2024 — Present',
      desc: 'Lecturing on SW Framework.',
    },
    {
      role: 'Cloud & DevOps Engineer',
      org: 'Open Source Community',
      period: '2018 — Present',
      desc: 'OPA (Open cloud Platform Alliance) leader, OPDC (Open Platform Developer Community) leader.',
    },
  ] : [
    {
      role: 'IT경영전공 겸임교수 (경영학부)',
      org: '한국공학대학교 (TUK)',
      period: '2024 — 현재',
      desc: '클라우드 인프라 및 DevOps 실무 강의.',
    },
    {
      role: 'Cloud & DevOps Engineer',
      org: '오픈소스 커뮤니티',
      period: '2018 — 현재',
      desc: 'OPA(Open cloud Platform Alliance) 리더, OPDC(Open Platform Developer Community) 리더.',
    },
  ];

  const contributions = [
    { name: 'K-PaaS', desc: isEn ? 'Korean government PaaS platform contributor' : '공공 PaaS 플랫폼 컨트리뷰터', url: 'https://github.com/K-PaaS' },
    { name: 'Harbor', desc: isEn ? 'Container registry — fork for ARM architecture support' : '컨테이너 레지스트리 — ARM 아키텍처 지원을 위한 포크', url: 'https://github.com/goharbor/harbor' },
    { name: 'Terraboard', desc: isEn ? 'Terraform state dashboard — fork with latest Terraform version support' : 'Terraform 상태 대시보드 — 최신 Terraform 버전 적용 포크', url: 'https://github.com/camptocamp/terraboard' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Profile Header */}
      <section className="mb-16">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">dasomel</h1>
            <p className="text-lg text-emerald-600 font-medium mb-3">Cloud &amp; DevOps Engineer</p>
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
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          {isEn
            ? 'Open source contributor and community leader focused on cloud-native infrastructure and PaaS platforms. Contributing to K-PaaS, Harbor, Terraboard, and other projects.'
            : '클라우드 네이티브 인프라와 PaaS 플랫폼에 집중하는 오픈소스 컨트리뷰터이자 커뮤니티 리더입니다. K-PaaS, Harbor, Terraboard 등 다양한 프로젝트에 기여하고 있습니다.'}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">{isEn ? 'Experience' : '경력'}</h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.role} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-emerald-600 text-sm font-medium">{exp.org}</p>
                </div>
                <span className="font-mono text-xs text-gray-400 whitespace-nowrap">{exp.period}</span>
              </div>
              <p className="text-sm text-gray-500">{exp.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* OSS Contributions */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Award className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">{isEn ? 'Open Source' : '오픈소스 기여'}</h2>
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
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-wider">{isEn ? 'Skills' : '기술 스택'}</h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(skills).map(([category, items]) => (
            <Card key={category} className="p-5">
              <h3 className="font-mono text-xs text-gray-400 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
