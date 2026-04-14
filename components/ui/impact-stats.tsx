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
      className="grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center py-5 px-3"
          style={{
            borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {stat.value}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
