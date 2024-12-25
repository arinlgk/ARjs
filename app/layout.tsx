import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UMP Pekan AR Navigation',
  description: 'AR Navigation system for Universiti Malaysia Pahang, Pekan Campus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
        <script src="https://unpkg.com/aframe-gps-entity-place@1.1.0/dist/aframe-gps-entity-place.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

