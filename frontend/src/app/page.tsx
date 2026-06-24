type Props = {
  searchParams: Promise<{ error?: string }>
}

function MicrosoftLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

export default async function Home({ searchParams }: Props) {
  const { error } = await searchParams
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="2" />
              <path d="M8 21h8M12 17v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Portail VM</h1>
          <p className="text-gray-500 text-sm mt-1">
            Plateforme de gestion des machines virtuelles
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
            Échec de l&apos;authentification. Veuillez réessayer.
          </div>
        )}

        <a
          href={`${apiUrl}/auth/login`}
          className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-[#0078d4] text-white font-semibold rounded-lg hover:bg-[#106ebe] active:bg-[#005a9e] transition-colors text-sm"
        >
          <MicrosoftLogo />
          Se connecter avec Office 365
        </a>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Authentification sécurisée via Microsoft Entra ID
        </p>
      </div>
    </main>
  )
}
