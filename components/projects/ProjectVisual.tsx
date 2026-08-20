'use client';

import Image from 'next/image';
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
    <Image
      src={imageSrc}
      alt={alt}
      width={1600}
      height={900}
      unoptimized
      className={className}
      loading={loading}
      onError={() => setImageSrc('/images/projects/default.svg')}
    />
  );
}
