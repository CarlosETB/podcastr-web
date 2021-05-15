import { createContext, ReactNode, useContext, useState } from 'react'

// Utils
import { EpisodeProps } from 'utils/interfaces';

interface PlayerContextData {
  hasNext: boolean;
  isLooping: boolean;
  isPlaying: boolean;
  isShuffling: boolean;
  hasPrevious: boolean;
  playNext: () => void;
  toggleLoop: () => void;
  togglePlay: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  episodeList: EpisodeProps[];
  currentEpisodeIndex: number;
  cleanPlayerState: () => void;
  play: (episode: EpisodeProps) => void;
  setPlayingState: (stare: boolean) => void;
  playList: (list: EpisodeProps[], index: number) => void;
}

interface PlayerContextProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider(props: PlayerContextProviderProps) {
  const { children } = props

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: EpisodeProps[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function cleanPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {
    if (isShuffling) {
      const nextRadomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRadomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        play,
        hasNext,
        playList,
        playNext,
        isPlaying,
        isLooping,
        toggleLoop,
        togglePlay,
        episodeList,
        hasPrevious,
        isShuffling,
        playPrevious,
        toggleShuffle,
        setPlayingState,
        cleanPlayerState,
        currentEpisodeIndex
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}