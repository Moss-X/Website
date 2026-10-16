import { useEffect, useState } from 'react'
import axios from '../lib/axios'

// Minimal GET hook: { data, loading, error } that refetches when `url` changes.
export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: Boolean(url), error: null })

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setState({ data: null, loading: true, error: null })
    axios
      .get(url)
      .then((res) => !cancelled && setState({ data: res.data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }))
    return () => {
      cancelled = true
    }
  }, [url])

  return state
}
