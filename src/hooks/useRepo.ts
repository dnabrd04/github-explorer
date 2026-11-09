import { useEffect, useState } from 'react'
import { githubErrorMessage, githubHeaders } from '../lib/github.ts'
import type { GithubContentEntry, GithubRepoDetail } from '../types/types.ts'

type RepoData = {
  repo: GithubRepoDetail | null
  contents: GithubContentEntry[]
  readme: string | null
  readmeError: string | null
}

type RepoState = RepoData & {
  key: string
  error: string | null
}

const initialState: RepoState = {
  key: '',
  repo: null,
  contents: [],
  readme: null,
  readmeError: null,
  error: null,
}

const cache = new Map<string, RepoData>()

function findReadme(contents: GithubContentEntry[]) {
  return contents.find(
    (entry) => entry.type === 'file' && /^readme(\.[a-z0-9]+)?$/i.test(entry.name),
  )
}

export function useRepo(owner: string, repo: string) {
  const [state, setState] = useState<RepoState>(initialState)
  const key = owner && repo ? `${owner}/${repo}` : ''

  useEffect(() => {
    if (!key || cache.has(key)) return

    const controller = new AbortController()

    async function load() {
      try {
        const repoUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`

        const [repoResponse, contentsResponse] = await Promise.all([
          fetch(repoUrl, { signal: controller.signal, headers: githubHeaders }),
          fetch(`${repoUrl}/contents`, {
            signal: controller.signal,
            headers: githubHeaders,
          }),
        ])

        if (!repoResponse.ok) {
          throw new Error(
            githubErrorMessage(repoResponse.status, 'Repositorio no encontrado'),
          )
        }

        const repoData: GithubRepoDetail = await repoResponse.json()

        let contents: GithubContentEntry[] = []
        if (contentsResponse.ok) {
          contents = await contentsResponse.json()
        } else if (contentsResponse.status !== 404) {
          throw new Error(
            githubErrorMessage(
              contentsResponse.status,
              'Contenido del repositorio no disponible',
            ),
          )
        }

        let readme: string | null = null
        let readmeError: string | null = null
        const readmeEntry = findReadme(contents)

        if (readmeEntry?.download_url) {
          const readmeResponse = await fetch(readmeEntry.download_url, {
            signal: controller.signal,
          })

          if (readmeResponse.ok) {
            readme = await readmeResponse.text()
          } else {
            readmeError = 'No se pudo cargar el contenido del README.'
          }
        }

        const data: RepoData = { repo: repoData, contents, readme, readmeError }
        cache.set(key, data)
        setState({ key, ...data, error: null })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setState({
          key,
          repo: null,
          contents: [],
          readme: null,
          readmeError: null,
          error: err instanceof Error ? err.message : 'Error desconocido',
        })
      }
    }

    load()

    return () => controller.abort()
  }, [key, owner, repo])

  const cached = key ? (cache.get(key) ?? null) : null
  const current: RepoState | null =
    key && state.key === key
      ? state
      : cached
        ? { key, ...cached, error: null }
        : null

  return {
    repo: current?.repo ?? null,
    contents: current?.contents ?? [],
    readme: current?.readme ?? null,
    readmeError: current?.readmeError ?? null,
    loadingRepo: Boolean(key) && !current,
    error: current?.error ?? null,
  }
}
