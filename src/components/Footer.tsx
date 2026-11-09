import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <p>
        Hecho por{' '}
        <a href="https://github.com/dnabrd04" target="_blank" rel="noreferrer">
          dnabrd04
        </a>
      </p>
    </footer>
  )
}

export default Footer
