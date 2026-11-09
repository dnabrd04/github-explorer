import { useState } from 'react'
import { Link } from 'react-router'
import { MoonIcon } from '../assets/icons/MoonIcon.tsx'
import { SearchIcon } from '../assets/icons/SearchIcon.tsx'
import { SunIcon } from '../assets/icons/SunIcon.tsx'
import type { Theme } from '../hooks/useTheme.ts'
import styles from './Header.module.css'

type HeaderProps = {
  onSearch: (username: string) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

function Header({ onSearch, theme, onThemeChange }: HeaderProps) {
  const [query, setQuery] = useState('')

  return (
    <header className={styles.siteHeader}>
      <Link className={styles.brand} to="/">
        GitHub Explorer
      </Link>
      <div className={styles.headerActions}>
        <form
          className={styles.searchForm}
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            onSearch(query.trim())
          }}
        >
          <input
            className={styles.searchInput}
            type="search"
            name="username"
            placeholder="Buscar usuario de GitHub..."
            aria-label="Nombre de usuario de GitHub"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className={styles.searchButton} type="submit" aria-label="Buscar">
            <SearchIcon />
          </button>
        </form>

        <div
          className={styles.themeToggle}
          role="group"
          aria-label="Tema de la página"
        >
          <button
            type="button"
            className={styles.themeButton}
            aria-label="Usar tema claro"
            aria-pressed={theme === 'light'}
            onClick={() => onThemeChange('light')}
          >
            <SunIcon />
          </button>
          <button
            type="button"
            className={styles.themeButton}
            aria-label="Usar tema oscuro"
            aria-pressed={theme === 'dark'}
            onClick={() => onThemeChange('dark')}
          >
            <MoonIcon />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
