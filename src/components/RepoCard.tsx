import { Link } from 'react-router'
import shared from '../styles/shared.module.css'
import type { GithubRepo } from '../types/types.ts'
import styles from './RepoCard.module.css'

type RepoCardProps = {
  repo: GithubRepo
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <li className={styles.repoCard}>
      <Link className={styles.repoCardLink} to={`/repos/${repo.full_name}`}>
        <header className={styles.repoCardHeader}>
          <h3 className={styles.repoName}>{repo.name}</h3>
          {repo.fork && (
            <span className={shared.repoForkBadge}>Fork</span>
          )}
        </header>

        {repo.description && (
          <p className={shared.repoDescription}>{repo.description}</p>
        )}

        <ul className={styles.repoMeta}>
          <li>{repo.language ?? 'Sin lenguaje'}</li>
          <li>{repo.stargazers_count.toLocaleString('es-ES')} estrellas</li>
          <li>{repo.forks_count.toLocaleString('es-ES')} forks</li>
        </ul>
      </Link>
    </li>
  )
}

export default RepoCard
