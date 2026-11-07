export const githubHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
} as const

export function githubErrorMessage(
  status: number,
  notFoundMessage = 'Recurso no encontrado',
) {
  if (status === 404) return notFoundMessage
  if (status === 403) {
    return 'Límite de peticiones alcanzado. Inténtalo más tarde.'
  }
  return `Error ${status}`
}

type LinkPages = {
  next: number | null
  last: number | null
}

export function parseLinkHeader(header: string | null): LinkPages {
  const pages: LinkPages = { next: null, last: null }
  if (!header) return pages

  for (const part of header.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/)
    if (!match) continue

    const url = new URL(match[1])
    const page = Number(url.searchParams.get('page'))
    if (!Number.isFinite(page)) continue

    if (match[2] === 'next') pages.next = page
    if (match[2] === 'last') pages.last = page
  }

  return pages
}
