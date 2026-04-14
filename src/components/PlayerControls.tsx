type Props = {
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    isPlaying: boolean;
};

const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PauseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

const PlayerControls = ({ onPlayPause, onNext, onPrev, isPlaying }: Props) => {
    return (
        <div className="player-controls">
            <button onClick={onPrev} className="btn-player btn-prev" title="Anterior">
                <img src="/player/pista-anterior.png" alt="Anterior" />
            </button>
            <button onClick={onPlayPause} className="btn-player btn-play-pause" title={isPlaying ? "Pausar" : "Reproducir"}>
                <span className={`play-pause-icon ${isPlaying ? 'playing' : ''}`}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </span>
            </button>
            <button onClick={onNext} className="btn-player btn-next" title="Siguiente">
                <img src="/player/siguiente-icono.png" alt="Siguiente" />
            </button>
        </div>
    );
};

export default PlayerControls;
