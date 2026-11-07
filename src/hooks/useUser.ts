import { useEffect, useState } from 'react'
import type { GithubUser } from '../types/types.ts'

type UserState = {
  username: string
  user: GithubUser | null
  error: string | null
}

export function useUser(username: string) {
  const [state, setState] = useState<UserState>({
    username: '',
    user: null,
    error: null,
  })

  useEffect(() => {
    if (!username) return

    const controller = new AbortController()

    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
      .then((response) => {
        if (response.status === 404) throw new Error('Usuario no encontrado')
        if (response.status === 403) {
          throw new Error('Límite de peticiones alcanzado. Inténtalo más tarde.')
        }
        if (!response.ok) throw new Error(`Error ${response.status}`)
        return response.json()
      })
      .then((data: GithubUser) => {
        setState({ username, user: data, error: null })
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setState({
          username,
          user: null,
          error: err instanceof Error ? err.message : 'Error desconocido',
        })
      })

    return () => controller.abort()
  }, [username])

  return {
    user: username ? state.user : null,
    loadingUser: Boolean(username) && state.username !== username,
    error: username ? state.error : null,
  }
}
