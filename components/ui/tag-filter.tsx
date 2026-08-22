'use client';

interface TagFilterProps {
  tags: string[];
  selected: string;
  onChange: (tag: string) => void;
  allLabel?: string;
}

export function TagFilter({ tags, selected, onChange, allLabel = 'All' }: TagFilterProps) {
  return (
    <div
      className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x snap-mandatory"
      aria-label="Project filters"
    >
      <button
        type="button"
        onClick={() => onChange('all')}
        aria-pressed={selected === 'all'}
        className="shrink-0 snap-start px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all"
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
          type="button"
          onClick={() => onChange(tag)}
          aria-pressed={selected === tag}
          className="shrink-0 snap-start px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all"
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
