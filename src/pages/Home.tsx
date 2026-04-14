import { usePlaylist } from "../hooks/usePlaylist";
import SongForm from "../components/SongForm";
import SongList from "../components/SongList";
import LivePlayerCard from "../components/LivePlayerCard";
import { useState, useEffect } from "react";

const Home = () => {
    const {
        songs, currentSong, isPlaying, audioRef, currentTime,
        duration, volume, addSong, removeSong, togglePlay,
        playNextSong, playPreviousSong, playSongAt, moveSong, seek, changeVolume
    } = usePlaylist();

    const [darkMode, setDarkMode] = useState(false);
    const [showLivePlayer, setShowLivePlayer] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) root.classList.add("dark");
        else root.classList.remove("dark");
    }, [darkMode]);

    useEffect(() => {
        if (currentSong && isPlaying) {
            setShowLivePlayer(true);
        }
    }, [currentSong, isPlaying]);

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleRenameSong = (index: number, newName: string) => {
        if (index < songs.length && index >= 0) {
            songs[index].name = newName;
        }
    };

    const handleRenameArtist = (index: number, newArtist: string) => {
        if (index < songs.length && index >= 0) {
            songs[index].artist = newArtist;
        }
    };

    const handleAddSong = (file: File, genre: string) => {
        addSong(file, genre);
    };

    const handleCloseLivePlayer = () => {
        if (isPlaying) {
            togglePlay();
        }
        setShowLivePlayer(false);
    };

    return (
        <div className="virelmi-app">
            <header className="main-header">
                <h1>Virelmi <span className="player-tag">Player</span></h1>
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "Modo Claro" : "Modo Oscuro"}
                </button>
            </header>

            <main className="app-layout">
                <aside className="sidebar">
                    <div className="current-track-card">
                        <div className="track-artwork">
                            <img src="/player/Virelmi logo2.jpeg" alt="Virelmi Logo" className="virelmi-logo" />
                        </div>
                        <div className="track-details">
                            <h2 className="track-title">
                                {currentSong ? currentSong.name : "Sin reproducción"}
                            </h2>
                            <p className="track-artist">
                                {currentSong ? currentSong.artist : "Listo para música"}
                            </p>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <h3 className="nav-title">Virelmi Player</h3>
                        <ul>
                            <li className="active">Mi Playlist</li>
                        </ul>
                    </nav>
                </aside>

                <section className="main-content">
                    <div className="content-grid">
                        <div className="white-card">
                            <h2 className="card-title">Añadir Nueva Canción a la Playlist</h2>
                            <SongForm onAddSong={handleAddSong} />
                        </div>

                        {currentSong && showLivePlayer && (
                            <div className="live-player-wrapper">
                                <LivePlayerCard
                                    currentSong={currentSong}
                                    isPlaying={isPlaying}
                                    currentTime={currentTime}
                                    duration={duration}
                                    volume={volume}
                                    onPlayPause={togglePlay}
                                    onNext={playNextSong}
                                    onPrev={playPreviousSong}
                                    onSeek={seek}
                                    onVolumeChange={changeVolume}
                                    onClose={handleCloseLivePlayer}
                                />
                            </div>
                        )}

                        <div className="white-card">
                            <h3 className="card-title">Tu Lista de Reproducción ({songs.length} canciones)</h3>
                            
                            <SongList
                                songs={songs}
                                onRemove={removeSong}
                                onPlay={playSongAt}
                                onMove={moveSong}
                                onRenameSong={handleRenameSong}
                                onRenameArtist={handleRenameArtist}
                                currentIndex={currentSong ? songs.indexOf(currentSong) : -1}
                                isPlaying={isPlaying}
                            />
                        </div>
                    </div>
                </section>
            </main>

            <audio ref={audioRef} />
        </div>
    );
};

export default Home;
