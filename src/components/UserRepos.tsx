import { useState } from 'react'
import { useUserRepos } from '../hooks/useUserRepos.ts'
import shared from '../styles/shared.module.css'
import RepoCard from './RepoCard.tsx'
import styles from './UserRepos.module.css'

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
    <section className={styles.reposSection} aria-labelledby="repos-title">
      <header className={styles.reposHeader}>
        <h2 id="repos-title">Repositorios</h2>
      </header>

      {loadingRepos && (
        <p className={shared.contentStatus}>Cargando repositorios...</p>
      )}

      {!loadingRepos && error && (
        <p className={shared.contentStatus}>{error}</p>
      )}

      {!loadingRepos && !error && repos.length === 0 && (
        <p className={styles.reposEmpty}>
          Este usuario no tiene repositorios públicos.
        </p>
      )}

      {!loadingRepos && !error && repos.length > 0 && (
        <>
          <ul className={styles.repoList}>
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </ul>

          <nav
            className={styles.pagination}
            aria-label="Paginación de repositorios"
          >
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className={styles.paginationStatus}>
              Página {page} de {totalPages ?? page}
            </span>
            <button
              type="button"
              className={styles.paginationButton}
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
