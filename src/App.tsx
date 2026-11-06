import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import './App.css'
import Footer from './components/Footer.tsx'
import Header from './components/Header.tsx'

const Home = lazy(() => import('./pages/Home.tsx'))

function App() {
  return (
    <>
      <Header />
      <main className="content">
        <Suspense fallback={<p className="content-status">Cargando...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default App
