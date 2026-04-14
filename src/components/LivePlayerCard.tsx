import { Song } from "../models/Song";

type Props = {
    currentSong: Song | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (vol: number) => void;
    onClose: () => void;
};

const genreImageMap: { [key: string]: string } = {
    "folklore": "folklore.jpg",
    "electrónica": "genero electronica.jpg",
    "electronica": "genero electronica.jpg",
    "pop": "genero pop.jpg",
    "rock": "genero rock.jpg",
    "hip-hop": "hi hop y rap.jpg",
    "hip-hop/rap": "hi hop y rap.jpg",
    "rapper": "hi hop y rap.jpg",
    "latino": "latino y tropical.jpg",
    "latino/tropical": "latino y tropical.jpg",
    "reggaeton": "musica-reggaeton.jpg"
};

const PlayIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PauseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

const LivePlayerCard = ({
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    onPlayPause,
    onNext,
    onPrev,
    onSeek,
    onVolumeChange,
    onClose
}: Props) => {
    if (!currentSong) {
        return (
            <div className="live-player-card">
                <div className="live-player-empty">
                    <p>Selecciona una canción para reproducir</p>
                </div>
            </div>
        );
    }

    const genreKey = currentSong.genre.toLowerCase();
    const genreImage = genreImageMap[genreKey] || "genero pop.jpg";
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="live-player-card">
            <div className="live-player-header">
                <h3>Reproduciendo Ahora</h3>
                <button className="live-player-close-btn" onClick={onClose} title="Cerrar">
                    ✕
                </button>
            </div>

            <div className="live-player-content">
                <div className="live-player-image-container">
                    <div className={`live-player-image ${isPlaying ? 'rotating' : ''}`}>
                        <img src={`/gener/${genreImage}`} alt={currentSong.genre} />
                    </div>
                </div>

                <div className="live-player-info">
                    <p className="live-player-song-name">{currentSong.name}</p>
                    <p className="live-player-artist">{currentSong.artist}</p>
                    <p className="live-player-genre">{currentSong.genre}</p>
                </div>

                <div className="live-player-progress">
                    <div 
                        className="live-player-progress-bar"
                        onClick={(e) => {
                            if (e.currentTarget) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percent = (e.clientX - rect.left) / rect.width;
                                onSeek(percent * duration);
                            }
                        }}
                    >
                        <div 
                            className="live-player-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="live-player-time-info">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="live-player-controls">
                    <button onClick={onPrev} className="live-btn-control" title="Anterior">
                        <img src="/player/pista-anterior.png" alt="Anterior" />
                    </button>
                    <button onClick={onPlayPause} className={`live-btn-play-pause ${isPlaying ? 'playing' : ''}`} title={isPlaying ? "Pausar" : "Reproducir"}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={onNext} className="live-btn-control" title="Siguiente">
                        <img src="/player/siguiente-icono.png" alt="Siguiente" />
                    </button>
                </div>

                <div className="live-player-volume">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    </svg>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="live-player-volume-slider"
                    />
                </div>
            </div>
        </div>
    );
};

export default LivePlayerCard;
