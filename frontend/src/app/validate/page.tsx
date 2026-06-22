import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ValidateClient from '@/components/ValidateClient'

export default async function ValidatePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) redirect('/')

  return (
    <ValidateClient
      token={token}
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}
    />
  )
}
