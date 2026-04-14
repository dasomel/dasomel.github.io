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
        className="px-3 py-1 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: selected === 'all' ? 'var(--accent)' : 'transparent',
          color: selected === 'all' ? '#fff' : 'var(--text-muted)',
          border: selected === 'all' ? 'none' : '1px solid var(--border)',
        }}
      >
        {allLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-all"
          style={{
            backgroundColor: selected === tag ? 'var(--accent)' : 'transparent',
            color: selected === tag ? '#fff' : 'var(--text-muted)',
            border: selected === tag ? 'none' : '1px solid var(--border)',
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
