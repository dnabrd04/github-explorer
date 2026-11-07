import { useEffect, useState } from 'react'
import { githubErrorMessage, githubHeaders } from '../lib/github.ts'
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
      headers: githubHeaders,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            githubErrorMessage(response.status, 'Usuario no encontrado'),
          )
        }
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
