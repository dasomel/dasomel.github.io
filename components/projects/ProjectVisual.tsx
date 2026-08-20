'use client';

import { useState } from 'react';

interface ProjectVisualProps {
  src: string;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ProjectVisual({ src, alt = '', className = '', loading = 'lazy' }: ProjectVisualProps) {
  const [imageSrc, setImageSrc] = useState(src);
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setImageSrc('/images/projects/default.svg')}
    />
  );
}
