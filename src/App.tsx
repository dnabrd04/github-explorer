import { lazy, Suspense, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import './App.css'
import Footer from './components/Footer.tsx'
import Header from './components/Header.tsx'

const Home = lazy(() => import('./pages/Home.tsx'))
const RepoDetail = lazy(() => import('./pages/RepoDetail.tsx'))

function App() {
  const [searchedUsername, setSearchedUsername] = useState('')
  const navigate = useNavigate()

  function handleSearch(username: string) {
    setSearchedUsername(username)
    navigate('/')
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="content">
        <Suspense fallback={<p className="content-status">Cargando...</p>}>
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
