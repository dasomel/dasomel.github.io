import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-32 text-center">
      <p className="font-mono text-6xl font-bold mb-4" style={{ color: 'var(--text-faint)' }}>404</p>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>페이지를 찾을 수 없습니다</h1>
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline" style={{ color: 'var(--accent)' }}>← 홈으로 돌아가기</Link>
    </div>
  );
}
