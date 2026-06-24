import Image from 'next/image'

type Props = {
  searchParams: Promise<{ error?: string }>
}

function MicrosoftLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
    <main className="min-h-screen flex flex-col md:flex-row font-sans bg-white">
      
      {/* Left Panel - Branding */}
      <div className="md:w-5/12 lg:w-1/2 bg-slate-900 flex flex-col justify-between p-8 md:p-12 lg:p-16 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-3xl"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-white/80 text-sm font-semibold tracking-wider uppercase mb-8">
            Partenariat Académique
          </h2>
          
          <div className="flex flex-col gap-6 items-start">
            {/* GIT Logo */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center min-h-[100px]">
              <img 
                src="/git-logo.png" 
                alt="Geneva Institute of Technology" 
                className="max-h-24 w-auto object-contain"
              />
            </div>
            
            <div className="w-12 h-px bg-white/20 ml-6"></div>

            {/* Satom Logo */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center min-h-[100px] w-full max-w-[400px]">
              <img 
                src="/satom-logo.svg" 
                alt="Satom IT & Learning Solutions" 
                className="max-h-20 w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Plateforme <br/>
            <span className="text-blue-400">Lab Cloud</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            L&apos;infrastructure de pointe pour vos environnements de cours virtuels.
          </p>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="md:w-7/12 lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Bienvenue</h2>
            <p className="text-slate-500">
              Veuillez vous authentifier pour accéder à votre espace de gestion des machines virtuelles.
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-start gap-3" role="alert">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Échec de l&apos;authentification. Veuillez vérifier vos accès et réessayer.</p>
            </div>
          )}

          <a
            href={`${apiUrl}/auth/login`}
            className="group flex items-center justify-center gap-4 w-full py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm"
          >
            <MicrosoftLogo />
            <span className="text-lg">Continuer avec Office 365</span>
          </a>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-medium text-slate-500">Accès sécurisé Entra ID</span>
            </div>
          </div>

        </div>
      </div>
      
    </main>
  )
}
