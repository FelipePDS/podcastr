import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    togglePlayList: (list: Episode[], index: number) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
};

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  function togglePlayList(list: Episode[], index: number) {
    if (currentEpisodeIndex !== index) {
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }

    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
  };

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  function togglePlay() {
    setIsPlaying(!isPlaying);
  };

  function toggleLoop() {
    setIsLooping(!isLooping);
  };

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  };

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  };

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  };

  return (
    <PlayerContext.Provider value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        play, 
        togglePlayList,
        hasNext,
        hasPrevious,
        playNext,
        playPrevious,
        togglePlay, 
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        clearPlayerState
    }}>
        {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
    return useContext(PlayerContext);
};
