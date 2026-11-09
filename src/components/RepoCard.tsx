import { Link } from 'react-router'
import type { GithubRepo } from '../types/types.ts'

type RepoCardProps = {
  repo: GithubRepo
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <li className="repo-card">
      <Link className="repo-card-link" to={`/repos/${repo.full_name}`}>
        <header className="repo-card-header">
          <h3 className="repo-name">{repo.name}</h3>
          {repo.fork && <span className="repo-fork-badge">Fork</span>}
        </header>

        {repo.description && (
          <p className="repo-description">{repo.description}</p>
        )}

        <ul className="repo-meta">
          <li>{repo.language ?? 'Sin lenguaje'}</li>
          <li>{repo.stargazers_count.toLocaleString('es-ES')} estrellas</li>
          <li>{repo.forks_count.toLocaleString('es-ES')} forks</li>
        </ul>
      </Link>
    </li>
  )
}

export default RepoCard
