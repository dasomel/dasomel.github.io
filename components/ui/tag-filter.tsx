'use client';

interface TagFilterProps {
  tags: string[];
  selected: string;
  onChange: (tag: string) => void;
  allLabel?: string;
}

export function TagFilter({ tags, selected, onChange, allLabel = 'All' }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange('all')}
        className="px-3 py-1 rounded-full text-xs font-mono font-medium transition-all"
        style={{
          backgroundColor: selected === 'all' ? 'var(--accent)' : 'var(--surface)',
          color: selected === 'all' ? 'var(--accent-fg)' : 'var(--text-muted)',
          border: selected === 'all' ? '1px solid var(--accent)' : '1px solid var(--border)',
        }}
      >
        {allLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className="px-3 py-1 rounded-full text-xs font-mono font-medium transition-all"
          style={{
            backgroundColor: selected === tag ? 'var(--accent)' : 'var(--surface)',
            color: selected === tag ? 'var(--accent-fg)' : 'var(--text-muted)',
            border: selected === tag ? '1px solid var(--accent)' : '1px solid var(--border)',
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
