export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/ko/" />
        <script dangerouslySetInnerHTML={{ __html: 'window.location.href="/ko/"' }} />
      </head>
      <body />
    </html>
  );
}

export const dynamic = 'force-static';
