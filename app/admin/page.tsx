/* 
keywords by @joncoded (aka @jonchius)
/app/admin/page.tsx
placeholder for admin panel
*/

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // redirects to the static admin page in the public folder
    window.location.href = '/admin/index.html'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to admin panel...</p>
    </div>
  )
}
