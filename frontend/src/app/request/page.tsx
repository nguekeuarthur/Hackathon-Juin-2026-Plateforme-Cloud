import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RequestClient from '@/components/RequestClient'

export default async function RequestPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) redirect('/')

  return (
    <RequestClient
      token={token}
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}
    />
  )
}
