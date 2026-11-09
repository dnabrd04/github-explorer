import { lazy, Suspense, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import styles from './App.module.css'
import Footer from './components/Footer.tsx'
import Header from './components/Header.tsx'
import { useTheme } from './hooks/useTheme.ts'
import shared from './styles/shared.module.css'

const Home = lazy(() => import('./pages/Home.tsx'))
const RepoDetail = lazy(() => import('./pages/RepoDetail.tsx'))

function App() {
  const [searchedUsername, setSearchedUsername] = useState('')
  const { theme, changeTheme } = useTheme()
  const navigate = useNavigate()

  function handleSearch(username: string) {
    setSearchedUsername(username)
    navigate('/')
  }

  return (
    <>
      <Header
        onSearch={handleSearch}
        theme={theme}
        onThemeChange={changeTheme}
      />
      <main className={styles.content}>
        <Suspense fallback={<p className={shared.contentStatus}>Cargando...</p>}>
          <Routes>
            <Route path="/" element={<Home username={searchedUsername} />} />
            <Route path="/repos/:owner/:repo" element={<RepoDetail />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
