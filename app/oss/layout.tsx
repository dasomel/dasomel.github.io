import OssHeader from '@/components/oss/OssHeader';

export default function OssLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <OssHeader />
      <main>{children}</main>
    </div>
  );
}
