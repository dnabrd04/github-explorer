import UserProfile from '../components/UserProfile.tsx'
import UserRepos from '../components/UserRepos.tsx'
import { useUser } from '../hooks/useUser.ts'
import shared from '../styles/shared.module.css'

type HomeProps = {
  username: string
}

function Home({ username }: HomeProps) {
  const { user, loadingUser, error } = useUser(username)

  if (!username) {
    return (
      <section className={shared.homeEmpty}>
        <h2>Busca un usuario de GitHub</h2>
        <p>Usa el buscador de la cabecera para ver su perfil.</p>
      </section>
    )
  }

  if (loadingUser) {
    return (
      <p className={shared.contentStatus}>Cargando datos del usuario...</p>
    )
  }

  if (error) {
    return <p className={shared.contentStatus}>{error}</p>
  }

  return user ? (
    <>
      <UserProfile user={user} />
      <UserRepos key={user.login} username={user.login} />
    </>
  ) : null
}

export default Home
