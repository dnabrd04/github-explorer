import { useState } from 'react'
import { useUserRepos } from '../hooks/useUserRepos.ts'
import RepoCard from './RepoCard.tsx'

type UserReposProps = {
  username: string
}

function UserRepos({ username }: UserReposProps) {
  const [page, setPage] = useState(1)
  const { repos, loadingRepos, error, totalPages, hasNextPage } = useUserRepos(
    username,
    page,
  )

  return (
    <section className="repos-section" aria-labelledby="repos-title">
      <header className="repos-header">
        <h2 id="repos-title">Repositorios</h2>
      </header>

      {loadingRepos && (
        <p className="content-status">Cargando repositorios...</p>
      )}

      {!loadingRepos && error && <p className="content-status">{error}</p>}

      {!loadingRepos && !error && repos.length === 0 && (
        <p className="repos-empty">
          Este usuario no tiene repositorios públicos.
        </p>
      )}

      {!loadingRepos && !error && repos.length > 0 && (
        <>
          <ul className="repo-list">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </ul>

          <nav className="pagination" aria-label="Paginación de repositorios">
            <button
              type="button"
              className="pagination-button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="pagination-status">
              Página {page} de {totalPages ?? page}
            </span>
            <button
              type="button"
              className="pagination-button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!hasNextPage}
            >
              Siguiente
            </button>
          </nav>
        </>
      )}
    </section>
  )
}

export default UserRepos
