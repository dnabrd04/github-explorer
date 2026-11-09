import type { GithubUser } from '../types/types.ts'
import styles from './UserProfile.module.css'

type UserProfileProps = {
  user: GithubUser
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function getBlogUrl(blog: string) {
  return /^https?:\/\//.test(blog) ? blog : `https://${blog}`
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <article className={styles.userProfile}>
      <header className={styles.userProfileHeader}>
        <img
          className={styles.userAvatar}
          src={user.avatar_url}
          alt={`Avatar de ${user.login}`}
          width={120}
          height={120}
        />
        <div className={styles.userIdentity}>
          <h2>{user.name ?? user.login}</h2>
          <a
            className={styles.userLogin}
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
          >
            @{user.login}
          </a>
          {user.bio && <p className={styles.userBio}>{user.bio}</p>}
        </div>
      </header>

      <dl className={styles.userStats}>
        <div className={styles.userStat}>
          <dt>Seguidores</dt>
          <dd>{user.followers.toLocaleString('es-ES')}</dd>
        </div>
        <div className={styles.userStat}>
          <dt>Siguiendo</dt>
          <dd>{user.following.toLocaleString('es-ES')}</dd>
        </div>
        <div className={styles.userStat}>
          <dt>Repositorios públicos</dt>
          <dd>{user.public_repos.toLocaleString('es-ES')}</dd>
        </div>
      </dl>

      <ul className={styles.userDetails}>
        {user.company && <li>Empresa: {user.company}</li>}
        {user.location && <li>Ubicación: {user.location}</li>}
        {user.blog && (
          <li>
            Web:{' '}
            <a href={getBlogUrl(user.blog)} target="_blank" rel="noreferrer">
              {user.blog}
            </a>
          </li>
        )}
        <li>Se unió el {dateFormatter.format(new Date(user.created_at))}</li>
      </ul>
    </article>
  )
}

export default UserProfile
