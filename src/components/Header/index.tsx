import React from 'react'

// Native
import prBR from 'date-fns/locale/pt-BR'
import format from 'date-fns/format'

// Private
import styles from './styles.module.scss'

const Header: React.FC = () => {
  const currentData = format(new Date(), 'EEEEEE, d MMMM', {
    locale: prBR
  })

  return (
    <header className={styles.headerContainer}>
      <img src='/logo.svg' alt='podcastr logo' />

      <p>O melhor para você ouvir, sempre</p>
      <span>{currentData}</span>
    </header>
  )
}

export default Header