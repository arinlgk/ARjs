import dynamic from 'next/dynamic'

const ARNavigation = dynamic(() => import('@/components/ARNavigation'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      Loading AR Navigation...
    </div>
  )
})

export default function ARNavigationPage() {
  return (
    <main>
      <ARNavigation />
    </main>
  )
}

