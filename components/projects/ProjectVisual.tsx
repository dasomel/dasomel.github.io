'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProjectVisualProps {
  src: string;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ProjectVisual({ src, alt = '', className = '', loading = 'lazy' }: ProjectVisualProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (src.endsWith('.svg')) {
      fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch SVG');
          return res.text();
        })
        .then((text) => setSvgContent(text))
        .catch(() => setSvgContent(null));
    } else {
      setSvgContent(null);
    }
  }, [src]);

  if (svgContent) {
    return (
      <div
        className={`w-full overflow-hidden [&_svg]:block [&_svg]:h-auto [&_svg]:w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

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
