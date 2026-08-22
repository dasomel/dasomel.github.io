interface StatItem {
  value: string;
  label: string;
}

interface ImpactStatsProps {
  stats: StatItem[];
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  return (
    <div
      className="impact-stats grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative py-6 sm:py-7 px-4 sm:px-6 text-left sm:text-center"
          style={{
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="impact-stats-value text-3xl sm:text-4xl font-semibold tracking-[-0.04em]" style={{ color: 'var(--text)' }}>
            {stat.value}
          </div>
          <div className="text-[0.68rem] mt-1.5 font-mono uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>
            {stat.label}
          </div>
          <div className="absolute inset-x-4 sm:inset-x-8 bottom-0 h-px opacity-0 transition-opacity" style={{ background: 'var(--accent)' }} />
        </div>
      ))}
    </div>
  );
}
