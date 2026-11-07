import UserProfile from '../components/UserProfile.tsx'
import { useUser } from '../hooks/useUser.ts'

type HomeProps = {
  username: string
}

function Home({ username }: HomeProps) {
  const { user, loadingUser, error } = useUser(username)

  if (!username) {
    return (
      <section className="home-empty">
        <h2>Busca un usuario de GitHub</h2>
        <p>Usa el buscador de la cabecera para ver su perfil.</p>
      </section>
    )
  }

  if (loadingUser) {
    return <p className="content-status">Cargando datos del usuario...</p>
  }

  if (error) {
    return <p className="content-status">{error}</p>
  }

  return user ? <UserProfile user={user} /> : null
}

export default Home
