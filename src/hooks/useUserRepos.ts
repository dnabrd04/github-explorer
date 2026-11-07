import { useEffect, useState } from 'react'
import { githubErrorMessage, githubHeaders, parseLinkHeader } from '../lib/github.ts'
import type { GithubRepo } from '../types/types.ts'

type ReposState = {
  key: string
  repos: GithubRepo[]
  error: string | null
  totalPages: number | null
  hasNextPage: boolean
}

const initialState: ReposState = {
  key: '',
  repos: [],
  error: null,
  totalPages: null,
  hasNextPage: false,
}

export function useUserRepos(username: string, page: number, perPage = 10) {
  const [state, setState] = useState<ReposState>(initialState)
  const key = `${username}:${page}`

  useEffect(() => {
    if (!username) return

    const controller = new AbortController()
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      sort: 'updated',
    })

    fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?${params.toString()}`,
      {
        signal: controller.signal,
        headers: githubHeaders,
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            githubErrorMessage(response.status, 'Usuario no encontrado'),
          )
        }

        const linkPages = parseLinkHeader(response.headers.get('Link'))
        return response
          .json()
          .then((data: GithubRepo[]) => ({ data, linkPages }))
      })
      .then(({ data, linkPages }) => {
        setState({
          key,
          repos: data,
          error: null,
          totalPages: linkPages.last ?? linkPages.next ?? page,
          hasNextPage: linkPages.next !== null,
        })
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setState({
          key,
          repos: [],
          error: err instanceof Error ? err.message : 'Error desconocido',
          totalPages: null,
          hasNextPage: false,
        })
      })

    return () => controller.abort()
  }, [username, page, perPage, key])

  const current = state.key === key ? state : null

  return {
    repos: username ? (current?.repos ?? []) : [],
    loadingRepos: Boolean(username) && state.key !== key,
    error: username ? (current?.error ?? null) : null,
    totalPages: current?.totalPages ?? null,
    hasNextPage: current?.hasNextPage ?? false,
  }
}
