import { usePlaylist } from "../hooks/usePlaylist";
import SongForm from "../components/SongForm";
import SongList from "../components/SongList";
import PlayerControls from "../components/PlayerControls";
import { useState, useEffect } from "react";

const Home = () => {
    const {
        songs, currentSong, isPlaying, audioRef, currentTime,
        duration, volume, addSong, removeSong, togglePlay,
        playNextSong, playPreviousSong, playSongAt, moveSong, seek, changeVolume
    } = usePlaylist();

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) root.classList.add("dark");
        else root.classList.remove("dark");
    }, [darkMode]);

    const formatTime = (time: number) => {
        if (!time) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="container">
            <h1>Reproductor de Música</h1>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? " Modo Claro" : " Modo Oscuro"}
                </button>
            </div>

            <div className="card">
                <SongForm onAddSong={addSong} />
            </div>

            <div className="card">
                <PlayerControls
                    onPlayPause={togglePlay}
                    onNext={playNextSong}
                    onPrev={playPreviousSong}
                    isPlaying={isPlaying}
                />
            </div>

            <div className="card info-reproduccion">
                <p>
                    {currentSong
                        ? ` ${currentSong.name} - ${currentSong.artist}`
                        : "Selecciona una canción"}
                </p>
            </div>

            <div className="card player-section">
                <label>Progreso</label>
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="slider"
                />
                <p className="time">{formatTime(currentTime)} / {formatTime(duration)}</p>

                <label>Volumen</label>
                <input
                    type="range"
                    min={0} max={1} step={0.01}
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="slider"
                />
            </div>

            <div className="card">
                <h3>Lista de Reproducción</h3>
                <SongList
                    songs={songs}
                    onRemove={removeSong}
                    onPlay={playSongAt}
                    onMove={moveSong}
                />
            </div>

            {/* Audio siempre presente para el Ref, src manejado por el hook */}
            <audio ref={audioRef} />
        </div>
    );
};

export default Home;