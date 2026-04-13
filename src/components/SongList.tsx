import { Song } from "../models/Song";
import SongItem from "./SongItem";

type Props = {
    songs: Song[];
    onRemove: (index: number) => void;
    onPlay: (index: number) => void;
    onMove: (from: number, to: number) => void;
};

const SongList = ({ songs, onRemove, onPlay, onMove }: Props) => {

    if (songs.length === 0) return <p>No hay canciones</p>;

    return (
        <ul>
            {songs.map((song, index) => (
                <SongItem
                    key={song.id}
                    song={song}
                    index={index}
                    total={songs.length}
                    onRemove={onRemove}
                    onPlay={onPlay}
                    onMove={onMove}
                />
            ))}
        </ul>
    );
};

export default SongList;