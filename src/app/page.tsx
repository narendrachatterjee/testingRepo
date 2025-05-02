// src/pages/index.tsx   (or src/app/page.tsx if you’re on the App Router)
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import Image from 'next/image'

// 1) Tell TS about dataLayer
declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>
  }
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Initialize dataLayer if needed
    window.dataLayer = window.dataLayer || []
    // Push the initial page load
    window.dataLayer.push({
      event: 'pageview',
      page: window.location.pathname,
    })

    // Push on every client-side route change
    const handleRouteChange = (url: string) => {
      window.dataLayer!.push({ event: 'pageview', page: url })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {/* 2) GTM script injection */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `,
        }}
      />

      {/* 3) Your page content */}
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="mb-2">
              Get started by editing{' '}
              <code className="bg-black/[.05] px-1 py-0.5 rounded font-semibold">
                src/app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            {/* …your buttons & links… */}
          </div>
        </main>

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          {/* …your footer links… */}
        </footer>
      </div>
    </>
  )
}
