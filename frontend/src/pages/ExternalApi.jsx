import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const ExternalApi = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const callApi = async () => {
      if (!isAuthenticated) return
      setLoading(true)
      setError('')
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        })

        const response = await fetch(`${apiBase}/api/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const text = await response.text()
          throw new Error(text || `Request failed with status ${response.status}`)
        }

        const data = await response.json().catch(() => ({}))
        setMessage(data.message || 'Success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    callApi()
  }, [isAuthenticated, getAccessTokenSilently])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-slate-900 dark:text-white px-4">
        <div className="max-w-lg w-full bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-lg font-black">Please log in to access the protected API.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-slate-900 dark:text-white px-4">
      <div className="max-w-lg w-full bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-black mb-4">Protected API Call</h1>
        {loading && <p className="text-sm text-slate-500">Calling API...</p>}
        {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
        {!loading && !error && message && (
          <p className="text-sm text-teal-600 font-bold">{message}</p>
        )}
      </div>
    </div>
  )
}

export default ExternalApi
