import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { OssSubnav } from '@/components/oss/OssSubnav';
import { OssEvidenceStrip } from '@/components/oss/OssEvidenceStrip';
import { OssEvidenceMethod } from '@/components/oss/OssEvidenceMethod';
import { OssSystemPulse } from '@/components/oss/OssSystemPulse';

export default async function OssEvidencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale=locale as 'ko'|'en';
  const en=currentLocale==='en';
  return <main style={{ color:'var(--text)' }}><OssSubnav locale={currentLocale} active="evidence"/><div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:py-20"><section className="max-w-5xl"><div className="font-mono text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--signal)' }}>OSS / EVIDENCE</div><h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{en?'Development should be observable.':'개발은 관찰 가능해야 합니다.'}</h1><p className="mt-6 max-w-4xl text-lg leading-8" style={{ color:'var(--text-muted)' }}>{en?'This page explains how development continuity, release cadence, documentation, and recent activity are surfaced across the OSS Workbench.':'이 페이지는 개발 지속성, 릴리스 흐름, 문서화, 최근 활동을 OSS Workbench에서 어떤 기준으로 보여주는지 설명합니다.'}</p></section><OssEvidenceStrip locale={currentLocale}/><OssEvidenceMethod locale={currentLocale}/><OssSystemPulse locale={currentLocale}/></div></main>;
}
