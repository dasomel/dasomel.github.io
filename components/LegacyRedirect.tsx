import Link from 'next/link';

// Static export cannot send HTTP redirects, and next/navigation's redirect() only emits a
// client-side redirect (no-JS visitors and crawlers see a blank page). This renders a real
// meta refresh + canonical (hoisted to <head> by React 19) and a visible link instead.
export function LegacyRedirect({ to, ko, en, locale }: { to: string; ko: string; en: string; locale: 'ko' | 'en' }) {
  const message = locale === 'en' ? en : ko;
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <link rel="canonical" href={`https://cne.io.kr${to}`} />
      <meta name="robots" content="noindex" />
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-lg">{message}</p>
        <p className="mt-4"><Link href={to} className="underline">{to}</Link></p>
      </div>
    </>
  );
}
