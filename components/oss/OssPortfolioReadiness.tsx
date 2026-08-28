import Link from 'next/link';
import { getOssRepoMeta } from '@/lib/oss-repo-meta';
import { evidencePresent, getOssRepoAudit, type OssRepoAuditEvidence } from '@/lib/oss-repo-audit';

type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type ReadinessState = 'observed'|'partial'|'not-indexed';
type Row = { slug:string; repo:string; name:string };

const rows:Row[] = [
  { slug:'narwhal', repo:'dasomel/narwhal', name:'Narwhal' },
  { slug:'narwhal-portal', repo:'dasomel/narwhal-portal', name:'Narwhal Portal' },
  { slug:'nfs-quota-agent', repo:'dasomel/nfs-quota-agent', name:'NFS Quota Agent' },
  { slug:'ldapium', repo:'dasomel/ldapium', name:'ldapium' },
  { slug:'kube-ready-box', repo:'dasomel/kube-ready-box', name:'Kube-Ready-Box' },
  { slug:'clusterdeck', repo:'dasomel/clusterdeck', name:'ClusterDeck' },
  { slug:'beluga', repo:'dasomel/beluga', name:'Beluga' },
  { slug:'beluga-manager', repo:'dasomel/beluga-manager', name:'Beluga Manager' },
  { slug:'kubemetal', repo:'dasomel/kubemetal', name:'KubeMetal' },
  { slug:'openforge', repo:'dasomel/openforge', name:'OpenForge' },
];

function label(state:ReadinessState, en:boolean) {
  if (state==='observed') return en?'Observed':'확인됨';
  if (state==='partial') return en?'Partial':'부분 확인';
  return en?'Not indexed':'미인덱싱';
}

function governanceState(evidence?:OssRepoAuditEvidence):ReadinessState {
  if (!evidence) return 'not-indexed';
  const license=evidencePresent(evidence.license);
  const contributing=evidencePresent(evidence.contributing);
  if (license && contributing) return 'observed';
  if (license || contributing || evidencePresent(evidence.codeOfConduct) || evidencePresent(evidence.notice)) return 'partial';
  return 'not-indexed';
}

function securityState(evidence?:OssRepoAuditEvidence):ReadinessState {
  if (!evidence) return 'not-indexed';
  const security=evidencePresent(evidence.security);
  const supplyChain=evidencePresent(evidence.sbom) || evidencePresent(evidence.provenance);
  if (security && supplyChain) return 'observed';
  if (security || supplyChain) return 'partial';
  return 'not-indexed';
}

function evidenceLine(items:Array<[string,boolean]>) {
  return items.map(([name,present])=>`${name} ${present?'✓':'—'}`).join(' · ');
}

function Badge({ state, en, detail }:{ state:ReadinessState; en:boolean; detail?:string }) {
  const strong=state==='observed';
  return <div><span className="inline-flex rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${strong?'var(--accent)':'var(--border)'}`, color:strong?'var(--accent)':'var(--text-muted)' }}>{label(state,en)}</span>{detail&&<div className="mt-2 max-w-[220px] font-mono text-[9px] leading-4" style={{ color:'var(--text-faint)' }}>{detail}</div>}</div>;
}

export function OssPortfolioReadiness({ locale, docs }:Props) {
  const en=locale==='en';
  const prefix=en?'/oss/en':'/oss';
  const docsBySlug=new Map(docs.map((item)=>[item.name,item.docs]));

  return <section className="mt-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO READINESS</div>
        <h2 className="mt-3 text-3xl font-semibold">{en?'Compare public-OSS readiness without inventing a composite score.':'합성 점수를 만들지 않고 공개 OSS readiness 신호를 비교합니다.'}</h2>
      </div>
      <a href="https://github.com/dasomel/narwhal/issues/162" target="_blank" rel="noreferrer" className="rounded-full px-3 py-1.5 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>engineering baseline · Narwhal #162 ↗</a>
    </div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Governance and security now come from a build-time repository tree audit: LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, SBOM and provenance/attestation paths are observed directly. Release and community come from the GitHub snapshot, and docs from the site index. File presence is evidence availability, not proof that a policy or control is effective.':'Governance·Security는 이제 빌드 시 repository tree audit에서 LICENSE·CONTRIBUTING·CODE_OF_CONDUCT·SECURITY·SBOM·provenance/attestation 경로를 직접 확인합니다. Release·Community는 GitHub snapshot, Docs는 사이트 index를 사용합니다. 파일 존재는 근거의 존재를 뜻할 뿐 정책이나 통제가 효과적이라는 보장은 아닙니다.'}</p>

    <div className="mt-6 overflow-x-auto rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <table className="w-full min-w-[1160px] border-collapse text-left text-sm">
        <thead><tr style={{ borderBottom:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>{['Project','Governance','Release','Docs','Security','Community','Adoption evidence'].map((h)=><th key={h} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row)=>{
          const meta=getOssRepoMeta(row.repo);
          const audit=getOssRepoAudit(row.repo);
          const evidence=audit?.evidence;
          const release=(meta?.releaseCount??0)>0;
          const docsCount=docsBySlug.get(row.slug)??0;
          const community=(meta?.contributorCount??0)>1;
          const governanceDetail=evidence?evidenceLine([
            ['LICENSE',evidencePresent(evidence.license)],
            ['CONTRIBUTING',evidencePresent(evidence.contributing)],
            ['CODE_OF_CONDUCT',evidencePresent(evidence.codeOfConduct)],
            ['NOTICE',evidencePresent(evidence.notice)],
          ]):undefined;
          const securityDetail=evidence?evidenceLine([
            ['SECURITY',evidencePresent(evidence.security)],
            ['SBOM',evidencePresent(evidence.sbom)],
            ['PROVENANCE',evidencePresent(evidence.provenance)],
          ]):undefined;
          return <tr key={row.slug} style={{ borderBottom:'1px solid var(--border)' }}>
            <td className="px-5 py-4"><Link href={`${prefix}/${row.slug}/`} className="font-semibold hover:underline">{row.name} →</Link><div className="mt-1 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{audit?`repo tree · ${audit.defaultBranch}`:(en?'audit not indexed':'audit 미인덱싱')}</div></td>
            <td className="px-5 py-4"><Badge state={governanceState(evidence)} en={en} detail={governanceDetail}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${release?'var(--accent)':'var(--border)'}`, color:release?'var(--accent)':'var(--text-muted)' }}>{release?(en?'Observed':'확인됨'):(en?'No GitHub release':'GitHub Release 없음')}</span>{evidence&&<div className="mt-2 font-mono text-[9px]" style={{ color:'var(--text-faint)' }}>CHANGELOG {evidencePresent(evidence.changelog)?'✓':'—'}</div>}</td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${docsCount>0?'var(--accent)':'var(--border)'}`, color:docsCount>0?'var(--accent)':'var(--text-muted)' }}>{docsCount>0?`${docsCount} docs`:(en?'Not indexed':'미인덱싱')}</span></td>
            <td className="px-5 py-4"><Badge state={securityState(evidence)} en={en} detail={securityDetail}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${community?'var(--accent)':'var(--border)'}`, color:community?'var(--accent)':'var(--text-muted)' }}>{community?'2+ contributors':(en?'Single-contributor signal':'단일 contributor 신호')}</span></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{en?'Not indexed':'미인덱싱'}</span></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <p className="mt-3 text-xs leading-5" style={{ color:'var(--text-faint)' }}>{en?'Audit matching is intentionally conservative: governance policy files are counted only at the repository root or under .github; SBOM and provenance evidence can live elsewhere in the tree. Adoption remains conservative too: stars, forks, or contributor counts are not deployment/adoption proof.':'Audit 매칭은 보수적으로 적용합니다. governance 정책 파일은 저장소 root 또는 .github 아래만 인정하고, SBOM·provenance evidence는 tree 내 다른 위치도 탐색합니다. Adoption 역시 star·fork·contributor 수를 실제 deployment/adoption 증거로 간주하지 않습니다.'}</p>
  </section>;
}
