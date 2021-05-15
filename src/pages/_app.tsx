import 'styles/global.scss'

// Components
import Header from 'components/Header'
import Player from 'components/Player'

// Contexts
import { PlayerContextProvider } from 'contexts/PlayerContext'

// Styles
import styles from 'styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>


        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
