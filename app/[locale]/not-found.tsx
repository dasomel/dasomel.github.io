import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-32 text-center">
      <p className="font-mono text-6xl text-gray-200 font-bold mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h1>
      <Link href="/" className="text-emerald-600 hover:text-emerald-700 transition-colors">← 홈으로 돌아가기</Link>
    </div>
  );
}
