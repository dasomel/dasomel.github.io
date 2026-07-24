import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// eslint-config-next 15.5.x 는 아직 eslintrc 형식만 노출한다(flat export 없음).
// ESLint 9 의 flat config 에서 쓰려면 FlatCompat 로 감싸야 한다.
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'next-env.d.ts',
      'public/**',
      // 과거 Astro 시절 잔재. .gitignore 대상이라 추적되지 않는 로컬 산출물.
      '.astro/**',
      // 피드 수집 산출물 — 린트 대상이 아니다.
      'src/content/posts/.digest-data/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // 빌드/수집 스크립트는 Node 에서 직접 실행되는 CommonJS 다.
    // (`npm run build` 가 scripts/generate-rss.js 를 node 로 호출한다.)
    files: ['scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default config;
