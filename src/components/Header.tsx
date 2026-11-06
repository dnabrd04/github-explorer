import { useState } from 'react'
import { Link } from 'react-router'
import { SearchIcon } from '../assets/icons/SearchIcon.tsx'

function Header() {
  const [query, setQuery] = useState('')

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        GitHub Explorer
      </Link>
      <form
        className="search-form"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          className="search-input"
          type="search"
          name="username"
          placeholder="Buscar usuario de GitHub..."
          aria-label="Nombre de usuario de GitHub"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="search-button" type="submit" aria-label="Buscar">
          <SearchIcon />
        </button>
      </form>
    </header>
  )
}

export default Header
