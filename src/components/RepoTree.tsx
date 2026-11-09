import type { GithubContentEntry } from '../types/types.ts'
import styles from './RepoTree.module.css'

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
      <p className={styles.repoTreeEmpty}>
        No se pudo obtener el contenido del repositorio.
      </p>
    )
  }

  const sorted = [...entries].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name)
    return a.type === 'dir' ? -1 : 1
  })

  return (
    <ul className={styles.repoTree}>
      {sorted.map((entry) => {
        const entryClassName =
          entry.type === 'dir'
            ? `${styles.repoTreeEntry} ${styles.repoTreeDir}`
            : styles.repoTreeEntry

        return (
          <li key={entry.path} className={entryClassName}>
            <span className={styles.repoTreeName}>
              {entry.name}
              {entry.type === 'dir' ? '/' : ''}
            </span>
            {entry.type === 'file' && (
              <span className={styles.repoTreeSize}>{formatSize(entry.size)}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
