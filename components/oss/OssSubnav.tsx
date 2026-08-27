import Link from 'next/link';

type Props = { locale: 'ko' | 'en'; active?: 'hub' | 'why' | 'story' | 'standards' };

export function OssSubnav({ locale, active }: Props) {
  const en = locale === 'en';
  const items = [
    { key: 'hub', href: en ? '/oss/en/' : '/oss/', label: en ? 'OSS Home' : 'OSS 홈' },
    { key: 'why', href: `/${locale}/oss/why/`, label: en ? 'Why OSS' : '왜 OSS인가' },
    { key: 'standards', href: en ? '/oss/en/openforge/' : '/oss/openforge/', label: en ? 'Standards' : '표준 / OpenForge' },
    { key: 'story', href: `/${locale}/oss/story/`, label: en ? 'Engineering Story' : 'Engineering Story' },
  ] as const;

  return (
    <nav aria-label={en ? 'OSS section navigation' : 'OSS 섹션 탐색'} className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
      <div className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto px-5 py-3 sm:px-8">
        {items.map((item) => {
          const selected = active === item.key;
          return (
            <Link key={item.key} href={item.href} aria-current={selected ? 'page' : undefined} className="shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition" style={{ color: selected ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`, backgroundColor: selected ? 'var(--accent-dim)' : 'var(--surface)' }}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
