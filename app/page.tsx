export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/ko/" />
      <script dangerouslySetInnerHTML={{ __html: 'window.location.href="/ko/"' }} />
    </>
  );
}

export const dynamic = 'force-static';
