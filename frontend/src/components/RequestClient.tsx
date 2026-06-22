'use client'

import { useState, useEffect, useCallback } from 'react'

const TEMPLATES = [
  { value: 'linux-admin', label: 'Linux Admin' },
  { value: 'dev-web', label: 'Dev Web' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'cybersec', label: 'Cybersécurité' },
] as const

type Template = typeof TEMPLATES[number]['value']

type VMRequest = {
  id: string
  template: string
  starts_at: string
  ends_at: string
  status: 'pending' | 'approved' | 'rejected' | 'running' | 'destroyed'
}

const STATUS_LABELS: Record<VMRequest['status'], string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  running: 'Active',
  destroyed: 'Terminée',
}

const STATUS_STYLES: Record<VMRequest['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  running: 'bg-green-100 text-green-700',
  destroyed: 'bg-gray-100 text-gray-500',
}

const TEMPLATE_LABELS: Record<Template, string> = {
  'linux-admin': 'Linux Admin',
  'dev-web': 'Dev Web',
  'data-science': 'Data Science',
  'cybersec': 'Cybersécurité',
}

type Props = { token: string; apiUrl: string }

export default function RequestClient({ token, apiUrl }: Props) {
  const [template, setTemplate] = useState<Template>('linux-admin')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [requests, setRequests] = useState<VMRequest[]>([])
  const [loadingList, setLoadingList] = useState(true)

  const minDate = new Date().toISOString().slice(0, 16)

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/requests/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setRequests(await res.json())
    } finally {
      setLoadingList(false)
    }
  }, [apiUrl, token])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!startsAt || !endsAt) {
      setError('Les dates de début et de fin sont obligatoires.')
      return
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError('La date de fin doit être postérieure à la date de début.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${apiUrl}/requests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template,
          starts_at: new Date(startsAt).toISOString(),
          ends_at: new Date(endsAt).toISOString(),
        }),
      })

      if (!res.ok) throw new Error(`Erreur ${res.status}`)

      setSuccess(true)
      setStartsAt('')
      setEndsAt('')
      setTemplate('linux-admin')
      await fetchRequests()
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">Portail VM</span>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Déconnexion
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Nouvelle demande de VM</h1>

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700" role="status">
              Demande envoyée, vous serez notifié par e-mail.
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                Template de cours
              </label>
              <select
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value as Template)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="starts_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début <span className="text-red-500">*</span>
                </label>
                <input
                  id="starts_at"
                  type="datetime-local"
                  required
                  min={minDate}
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="ends_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin <span className="text-red-500">*</span>
                </label>
                <input
                  id="ends_at"
                  type="datetime-local"
                  required
                  min={startsAt || minDate}
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {submitting ? 'Envoi en cours…' : 'Envoyer la demande'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Mes demandes</h2>

          {loadingList ? (
            <p className="text-sm text-gray-400">Chargement…</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune demande pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {TEMPLATE_LABELS[r.template as Template] ?? r.template}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(r.starts_at).toLocaleDateString('fr-FR')}
                      {' → '}
                      {new Date(r.ends_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
