import { Song } from "../models/Song";

type Props = {
    song: Song;
    index: number;
    total: number;
    onRemove: (index: number) => void;
    onPlay: (index: number) => void;
    onMove: (from: number, to: number) => void;
};

const SongItem = ({ song, index, total, onRemove, onPlay, onMove }: Props) => {

    const moveUp = () => onMove(index, index - 1);
    const moveDown = () => onMove(index, index + 1);

    return (
        <li
            className="song-item"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("index", index.toString())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                const from = Number(e.dataTransfer.getData("index"));
                onMove(from, index);
            }}
        >
            {/*  FLECHAS */}
            <div className="controls">
                {index > 0 && (
                    <button onClick={moveUp}>↑</button>
                )}

                {index < total - 1 && (
                    <button onClick={moveDown}>↓</button>
                )}
            </div>

            {/*  INFO */}
            <div
                className="song-info"
                onClick={() => onPlay(index)}
            >
                <strong>{song.name}</strong>
                <span>{song.artist}</span>
            </div>

            <button onClick={() => onRemove(index)}>
                Eliminar
            </button>
        </li>
    );
};

export default SongItem;