import type { GithubContentEntry } from '../types/types.ts'

type RepoTreeProps = {
  entries: GithubContentEntry[]
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function RepoTree({ entries }: RepoTreeProps) {
  if (entries.length === 0) {
    return (
      <p className="repo-tree-empty">
        No se pudo obtener el contenido del repositorio.
      </p>
    )
  }

  const sorted = [...entries].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name)
    return a.type === 'dir' ? -1 : 1
  })

  return (
    <ul className="repo-tree">
      {sorted.map((entry) => (
        <li
          key={entry.path}
          className={`repo-tree-entry repo-tree-${entry.type}`}
        >
          <span className="repo-tree-name">
            {entry.name}
            {entry.type === 'dir' ? '/' : ''}
          </span>
          {entry.type === 'file' && (
            <span className="repo-tree-size">{formatSize(entry.size)}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
