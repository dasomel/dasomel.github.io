import { getOssRepoMeta, OSS_REPO_SNAPSHOT, repoFreshness } from '@/lib/oss-repo-meta';
import { OssPortfolioAttention } from '@/components/oss/OssPortfolioAttention';

const repos = [
  'dasomel/openforge',
  'dasomel/kube-ready-box',
  'dasomel/clusterdeck',
  'dasomel/narwhal',
  'dasomel/narwhal-portal',
  'dasomel/nfs-quota-agent',
  'dasomel/ldapium',
  'dasomel/beluga',
  'dasomel/beluga-manager',
  'dasomel/kubemetal',
] as const;

function projectAgeDays(createdAt?: string) {
  if (!createdAt) return null;
  const snapshot = new Date(OSS_REPO_SNAPSHOT.generatedAt).getTime();
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(snapshot) || !Number.isFinite(created)) return null;
  return Math.max(0, Math.floor((snapshot - created) / 86_400_000));
}

type Props = {
  locale: 'ko' | 'en';
  docs: Array<{ name: string; docs: number }>;
};

export function OssPortfolioHealth({ locale, docs }: Props) {
  const en = locale === 'en';
  const items = repos.map((repo) => ({ repo, meta: getOssRepoMeta(repo) }));
  const active = items.filter(({ meta }) => repoFreshness(meta?.pushedAt).label === 'active').length;
  const released = items.filter(({ meta }) => (meta?.releaseCount ?? 0) > 0).length;
  const externalSignal = items.filter(({ meta }) => (meta?.contributorCount ?? 0) > 1).length;
  const sustained = items.filter(({ meta }) => (projectAgeDays(meta?.createdAt) ?? 0) >= 180).length;
  const documented = docs.filter((item) => item.docs > 0).length;
  const docSections = docs.reduce((sum, item) => sum + item.docs, 0);

  const cards = en ? [
    ['Active ≤7d', `${active}/${repos.length}`, 'repositories pushed within seven days of the metadata snapshot'],
    ['Released', `${released}/${repos.length}`, 'projects with at least one GitHub release'],
    ['Contributor signal', `${externalSignal}/${repos.length}`, 'repositories reporting more than one contributor'],
    ['Sustained ≥6mo', `${sustained}/${repos.length}`, 'projects whose repository age is at least 180 days'],
    ['Docs coverage', `${documented}/${docs.length}`, `${docSections} project documentation sections are indexed`],
  ] : [
    ['최근 7일 Active', `${active}/${repos.length}`, 'metadata snapshot 기준 7일 이내 push가 있는 저장소'],
    ['Release 보유', `${released}/${repos.length}`, 'GitHub Release가 1개 이상 존재하는 프로젝트'],
    ['기여자 확장 신호', `${externalSignal}/${repos.length}`, 'GitHub contributor가 2명 이상 집계된 저장소'],
    ['6개월 이상 지속', `${sustained}/${repos.length}`, '저장소 생성 후 180일 이상 유지된 프로젝트'],
    ['Docs Coverage', `${documented}/${docs.length}`, `프로젝트 상세 문서 ${docSections}개 section을 인덱싱`],
  ];

  return <>
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO HEALTH</div>
          <h2 className="mt-3 text-3xl font-semibold">{en ? 'Measure momentum without inventing a maturity score.' : '임의의 성숙도 점수 없이 포트폴리오의 흐름을 측정합니다.'}</h2>
        </div>
        <div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{en ? 'build snapshot' : '빌드 snapshot'} · {OSS_REPO_SNAPSHOT.generatedAt.slice(0,10)}</div>
      </div>
      <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en ? 'Activity, releases, contributors and repository age come from the build-time GitHub snapshot. Documentation coverage comes from the site content index. These are operating signals, not popularity or quality scores.' : '활동·릴리스·기여자·저장소 연령은 빌드 시점 GitHub snapshot에서, 문서 커버리지는 사이트 content index에서 계산합니다. 인기나 품질 점수가 아니라 운영 신호입니다.'}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label,value,detail]) => <div key={label} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
          <p className="mt-3 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{detail}</p>
        </div>)}
      </div>
    </section>
    <OssPortfolioAttention locale={locale} docs={docs} />
  </>;
}
