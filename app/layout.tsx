import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WebAR Campus Navigation',
  description: 'Navigate your university campus using WebAR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://aframe.io/releases/1.2.0/aframe.min.js" strategy="beforeInteractive" />
        <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

