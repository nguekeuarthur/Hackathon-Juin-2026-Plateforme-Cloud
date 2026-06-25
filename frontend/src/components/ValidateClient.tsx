'use client'

import { useState, useEffect, useCallback } from 'react'

type Status = 'pending' | 'approved' | 'rejected' | 'running' | 'destroyed'

type VMRequest = {
  id: string
  requester: string
  template: string
  starts_at: string
  ends_at: string
  status: Status
  created_at?: string
  validated_by?: string | null
  validated_at?: string | null
}

const TEMPLATE_LABELS: Record<string, string> = {
  'linux-admin': 'Linux Admin',
  'dev-web': 'Dev Web',
  'data-science': 'Data Science',
  'cybersec': 'Cybersécurité',
}

const STATUS_LABELS: Record<Status, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  running: 'Active',
  destroyed: 'Terminée',
}

const STATUS_STYLES: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  running: 'bg-green-100 text-green-700',
  destroyed: 'bg-gray-100 text-gray-500',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type Props = { token: string; apiUrl: string }

export default function ValidateClient({ token, apiUrl }: Props) {
  const [requests, setRequests] = useState<VMRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectComment, setRejectComment] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState('1cb0a6a2-2dc2-46cd-bb23-1070d7f0e9d6')
  const [selectedFlavor, setSelectedFlavor] = useState('a1-ram2-disk20-perf1')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/requests/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setRequests(await res.json())
    } finally {
      setLoading(false)
    }
  }, [apiUrl, token])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  async function sendDecision(id: string, approved: boolean, comment = '', flavor_name?: string, template_id?: string) {
    setProcessingId(id)
    setFlash(null)
    try {
      const res = await fetch(`${apiUrl}/requests/${id}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved, comment, flavor_name, template_id }),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      setFlash({ type: 'success', message: approved ? 'Demande approuvée.' : 'Demande refusée.' })
      setRejectingId(null)
      setRejectComment('')
      setApprovingId(null)
      await fetchRequests()
    } catch {
      setFlash({ type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setProcessingId(null)
    }
  }

  function handleApproveConfirm(id: string) {
    sendDecision(id, true, '', selectedFlavor, selectedImage)
  }

  function handleRejectConfirm(id: string) {
    if (!rejectComment.trim()) return
    sendDecision(id, false, rejectComment.trim())
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const history = requests.filter((r) => r.status !== 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">Portail VM — Validateur</span>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Déconnexion
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {flash && (
          <div
            role={flash.type === 'error' ? 'alert' : 'status'}
            className={`rounded-lg px-4 py-3 text-sm border ${
              flash.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {flash.message}
          </div>
        )}

        {/* Pending section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 className="text-lg font-bold text-gray-900">
              Demandes en attente
              {pending.length > 0 && (
                <span className="ml-2 text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  {pending.length}
                </span>
              )}
            </h1>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-sm text-gray-400">Chargement…</p>
          ) : pending.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400">Aucune demande en attente.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    <th className="px-6 py-3">Demandeur</th>
                    <th className="px-6 py-3">Template</th>
                    <th className="px-6 py-3">Début</th>
                    <th className="px-6 py-3">Fin</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pending.map((r) => (
                    <>
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{r.requester}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {TEMPLATE_LABELS[r.template] ?? r.template}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{fmt(r.starts_at)}</td>
                        <td className="px-6 py-4 text-gray-600">{fmt(r.ends_at)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setApprovingId(approvingId === r.id ? null : r.id)
                                setRejectingId(null)
                              }}
                              disabled={processingId === r.id}
                              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(rejectingId === r.id ? null : r.id)
                                setApprovingId(null)
                                setRejectComment('')
                              }}
                              disabled={processingId === r.id}
                              className="px-3 py-1.5 text-xs font-semibold bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Refuser
                            </button>
                          </div>
                        </td>
                      </tr>
                      {approvingId === r.id && (
                        <tr key={`${r.id}-approve`} className="bg-blue-50">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Système d'exploitation</label>
                                <select 
                                  value={selectedImage}
                                  onChange={(e) => setSelectedImage(e.target.value)}
                                  className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                  <option value="1cb0a6a2-2dc2-46cd-bb23-1070d7f0e9d6">Ubuntu 22.04 LTS</option>
                                  <option value="c03b8f35-78e9-40dc-9208-9625c2a98756">Debian 12 Bookworm</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700">Puissance (RAM)</label>
                                <select 
                                  value={selectedFlavor}
                                  onChange={(e) => setSelectedFlavor(e.target.value)}
                                  className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                  <option value="a1-ram2-disk20-perf1">2 Go RAM (Standard)</option>
                                  <option value="a1-ram4-disk20-perf1">4 Go RAM (Avancé)</option>
                                  <option value="a1-ram8-disk20-perf1">8 Go RAM (Performance)</option>
                                </select>
                              </div>
                              <div className="ml-auto flex items-center gap-2">
                                <button
                                  onClick={() => handleApproveConfirm(r.id)}
                                  disabled={processingId === r.id}
                                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Confirmer la création
                                </button>
                                <button
                                  onClick={() => setApprovingId(null)}
                                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {rejectingId === r.id && (
                        <tr key={`${r.id}-reject`} className="bg-red-50">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <textarea
                                autoFocus
                                rows={2}
                                placeholder="Motif du refus (obligatoire)…"
                                value={rejectComment}
                                onChange={(e) => setRejectComment(e.target.value)}
                                className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                              />
                              <div className="flex flex-col gap-2 shrink-0">
                                <button
                                  onClick={() => handleRejectConfirm(r.id)}
                                  disabled={!rejectComment.trim() || processingId === r.id}
                                  className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Confirmer le refus
                                </button>
                                <button
                                  onClick={() => { setRejectingId(null); setRejectComment('') }}
                                  className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* History section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Historique</h2>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-sm text-gray-400">Chargement…</p>
          ) : history.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400">Aucune demande traitée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    <th className="px-6 py-3">Demandeur</th>
                    <th className="px-6 py-3">Template</th>
                    <th className="px-6 py-3">Début</th>
                    <th className="px-6 py-3">Fin</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Validé par</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{r.requester}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {TEMPLATE_LABELS[r.template] ?? r.template}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{fmt(r.starts_at)}</td>
                      <td className="px-6 py-4 text-gray-600">{fmt(r.ends_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {r.validated_by ?? '—'}
                        {r.validated_at && (
                          <span className="block text-gray-400">{fmt(r.validated_at)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
