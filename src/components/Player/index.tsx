import { usePlayer } from 'contexts/PlayerContext'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

// Private
import styles from './styles.module.scss'
import { convertDurationToTimeString } from 'utils/convertDurationToTimeString'

const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const {
    hasNext,
    playNext,
    isPlaying,
    isLooping,
    togglePlay,
    toggleLoop,
    isShuffling,
    hasPrevious,
    episodeList,
    playPrevious,
    toggleShuffle,
    setPlayingState,
    cleanPlayerState,
    currentEpisodeIndex,
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      cleanPlayerState()
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src='/playing.svg' alt='' />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (

        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode
              ? (
                <Slider
                  value={progress}
                  onChange={handleSeek}
                  max={episode.duration}
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                />
              )
              : <div className={styles.emptySlider} />
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            autoPlay
            ref={audioRef}
            loop={isLooping}
            src={episode.url}
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttonContainer}>
          <button
            type='button'
            disabled={!episode}
            onClick={toggleShuffle}
            className={isShuffling && styles.isActive}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type='button'
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type='button'
            disabled={!episode}
            className={styles.playButton}
            onClick={togglePlay}
          >
            <img src={isPlaying ? "pause.svg" : "play.svg"} alt="Tocar" />
          </button>

          <button
            type='button'
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            type='button'
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping && styles.isActive}
          >
            <img src="repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  )
}

export default Player