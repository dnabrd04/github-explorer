import Markdown from 'react-markdown'
import { Link, useParams } from 'react-router'
import { RepoTree } from '../components/RepoTree.tsx'
import { useRepo } from '../hooks/useRepo.ts'
import shared from '../styles/shared.module.css'
import type { GithubRepoDetail } from '../types/types.ts'
import styles from './RepoDetail.module.css'

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function formatDate(value: string | null) {
  if (!value) return 'Sin datos'
  return dateFormatter.format(new Date(value))
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function resolveReadmeUrl(url: string, repo: GithubRepoDetail) {
  if (!url) return url
  if (url.startsWith('#') || url.startsWith('//')) return url
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return url

  const base = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/`

  try {
    return new URL(url.replace(/^\.?\//, ''), base).href
  } catch {
    return url
  }
}

function RepoDetail() {
  const params = useParams()
  const owner = params.owner ?? ''
  const repoName = params.repo ?? ''
  const { repo, contents, readme, readmeError, loadingRepo, error } = useRepo(
    owner,
    repoName,
  )

  if (!owner || !repoName) {
    return <p className={shared.contentStatus}>Repositorio no válido.</p>
  }

  if (loadingRepo) {
    return (
      <p className={shared.contentStatus}>Cargando repositorio...</p>
    )
  }

  if (error) {
    return (
      <section className={shared.homeEmpty}>
        <h2>No se pudo cargar el repositorio</h2>
        <p>{error}</p>
        <Link className={styles.repoBackLink} to="/">
          Volver al inicio
        </Link>
      </section>
    )
  }

  if (!repo) return null

  const original = repo.parent ?? repo.source

  return (
    <div className={styles.repoDetailPage}>
      <Link className={styles.repoBackLink} to="/">
        Volver
      </Link>

      <article className={styles.repoDetail}>
        <header className={styles.repoDetailHeader}>
          <div className={styles.repoDetailTitle}>
            <h2 className={styles.repoDetailName}>
              <a
                href={repo.owner.html_url}
                target="_blank"
                rel="noreferrer"
              >
                {repo.owner.login}
              </a>
              <span aria-hidden="true"> / </span>
              {repo.name}
            </h2>
            {repo.fork && (
              <span className={shared.repoForkBadge}>Fork</span>
            )}
            {repo.description && (
              <p className={shared.repoDescription}>{repo.description}</p>
            )}
          </div>

          <div className={styles.repoDetailActions}>
            <a
              className={styles.repoActionLink}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              Ver en GitHub
            </a>
            {repo.fork && original && (
              <a
                className={styles.repoActionLink}
                href={original.html_url}
                target="_blank"
                rel="noreferrer"
              >
                Repositorio original: {original.full_name}
              </a>
            )}
          </div>
        </header>

        <dl className={styles.repoDetailStats}>
          <div className={styles.repoDetailStat}>
            <dt>Estrellas</dt>
            <dd>{repo.stargazers_count.toLocaleString('es-ES')}</dd>
          </div>
          <div className={styles.repoDetailStat}>
            <dt>Forks</dt>
            <dd>{repo.forks_count.toLocaleString('es-ES')}</dd>
          </div>
          <div className={styles.repoDetailStat}>
            <dt>Watchers</dt>
            <dd>{repo.watchers_count.toLocaleString('es-ES')}</dd>
          </div>
          <div className={styles.repoDetailStat}>
            <dt>Issues abiertos</dt>
            <dd>{repo.open_issues_count.toLocaleString('es-ES')}</dd>
          </div>
        </dl>

        <ul className={styles.repoDetailMeta}>
          <li>Lenguaje: {repo.language ?? 'Sin lenguaje'}</li>
          <li>Rama por defecto: {repo.default_branch}</li>
          <li>Tamaño: {formatSize(repo.size)}</li>
          {repo.license && <li>Licencia: {repo.license.name}</li>}
          <li>Creado el {formatDate(repo.created_at)}</li>
          <li>Actualizado el {formatDate(repo.updated_at)}</li>
          {repo.pushed_at && <li>Último push: {formatDate(repo.pushed_at)}</li>}
          {repo.archived && <li>Archivado</li>}
        </ul>

        {repo.topics && repo.topics.length > 0 && (
          <ul className={styles.repoTopics}>
            {repo.topics.map((topic) => (
              <li key={topic} className={styles.repoTopic}>
                {topic}
              </li>
            ))}
          </ul>
        )}

        <section
          className={styles.repoDetailSection}
          aria-labelledby="repo-tree-title"
        >
          <h3 id="repo-tree-title">Estructura de primer nivel</h3>
          <RepoTree entries={contents} />
        </section>

        <section
          className={styles.repoDetailSection}
          aria-labelledby="repo-readme-title"
        >
          <h3 id="repo-readme-title">README</h3>
          {readmeError && (
            <p className={styles.repoReadmeError}>{readmeError}</p>
          )}
          {readme !== null ? (
            <div className={styles.repoReadme}>
              <Markdown urlTransform={(url) => resolveReadmeUrl(url, repo)}>
                {readme}
              </Markdown>
            </div>
          ) : (
            !readmeError && (
              <p className={styles.repoReadmeEmpty}>
                No se encontró un README en la raíz del repositorio.
              </p>
            )
          )}
        </section>
      </article>
    </div>
  )
}

export default RepoDetail
