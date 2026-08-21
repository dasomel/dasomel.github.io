import Link from 'next/link';

export default function OssLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1020]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/oss/" className="font-semibold tracking-tight">OSS Engineering</Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/oss/" className="hover:text-white">Projects</Link>
            <Link href="/oss/en/" className="hover:text-white">English</Link>
            <a href="https://github.com/dasomel/openforge" className="hover:text-white" target="_blank" rel="noreferrer">GitHub</a>
            <Link href="/" className="hover:text-white">cne.io.kr</Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
