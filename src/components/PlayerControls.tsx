type Props = {
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    isPlaying: boolean;
};

const PlayerControls = ({ onPlayPause, onNext, onPrev, isPlaying }: Props) => {
    return (
        <div>
            <button onClick={onPrev}>Anterior</button>
            <button onClick={onPlayPause}>
                {isPlaying ? "Pausar" : "Reproducir"}
            </button>
            <button onClick={onNext}>Siguiente</button>
        </div>
    );
};

export default PlayerControls;