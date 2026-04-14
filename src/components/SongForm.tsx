import { useState, useEffect } from "react";
import type { PlaylistInfo } from "../hooks/usePlaylist";

type Props = {
    onAddSong: (file: File, genre: string, position: "start" | "end" | "middle", playlistId: string) => void;
    playlists: PlaylistInfo[];
    activePlaylistId: string;
};

const genreMap: { [key: string]: string } = {
    "folklore.jpg": "Folklore",
    "genero electronica.jpg": "Electrónica",
    "genero pop.jpg": "Pop",
    "genero rock.jpg": "Rock",
    "hi hop y rap.jpg": "Hip-Hop/Rap",
    "latino y tropical.jpg": "Latino/Tropical",
    "musica-reggaeton.jpg": "Reggaeton"
};

const SongForm = ({ onAddSong, playlists, activePlaylistId }: Props) => {
    const [fileName, setFileName] = useState("Sin archivos seleccionados");
    const [selectedGenre, setSelectedGenre] = useState("genero pop.jpg");
    const [position, setPosition] = useState<"start" | "end" | "middle">("end");
    const [targetPlaylistId, setTargetPlaylistId] = useState(activePlaylistId);

    // Sincronizar cuando cambia la playlist activa
    useEffect(() => {
        setTargetPlaylistId(activePlaylistId);
    }, [activePlaylistId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileNames = Array.from(files).map(f => f.name).join(", ");
        setFileName(files.length === 1 ? fileNames : `${files.length} archivos seleccionados`);

        Array.from(files).forEach(file => {
            const genreKey = selectedGenre.split(".jpg")[0].replace("genero ", "").toLowerCase();
            onAddSong(file, genreKey, position, targetPlaylistId);
        });
    };

    return (
        <div className="file-input-wrapper">
            <label htmlFor="genre-select" className="genre-label">
                Selecciona un género:
            </label>
            <select
                id="genre-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="genre-select"
            >
                {Object.entries(genreMap).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>

            <label htmlFor="playlist-select" className="genre-label">
                Agregar a playlist:
            </label>
            <select
                id="playlist-select"
                value={targetPlaylistId}
                onChange={(e) => setTargetPlaylistId(e.target.value)}
                className="genre-select"
            >
                {playlists.map(pl => (
                    <option key={pl.id} value={pl.id}>{pl.name}</option>
                ))}
            </select>

            <label className="genre-label">Posición en la playlist:</label>
            <div className="position-options">
                <label className={`position-option ${position === "start" ? "active" : ""}`}>
                    <input
                        type="radio"
                        name="position"
                        value="start"
                        checked={position === "start"}
                        onChange={() => setPosition("start")}
                    />
                    <span className="position-icon">⬆</span>
                    Al inicio
                </label>
                <label className={`position-option ${position === "middle" ? "active" : ""}`}>
                    <input
                        type="radio"
                        name="position"
                        value="middle"
                        checked={position === "middle"}
                        onChange={() => setPosition("middle")}
                    />
                    <span className="position-icon">↔</span>
                    En el medio
                </label>
                <label className={`position-option ${position === "end" ? "active" : ""}`}>
                    <input
                        type="radio"
                        name="position"
                        value="end"
                        checked={position === "end"}
                        onChange={() => setPosition("end")}
                    />
                    <span className="position-icon">⬇</span>
                    Al final
                </label>
            </div>

            <label htmlFor="file-input" className="file-input-btn">
                Elegir archivos
            </label>
            <input
                id="file-input"
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a,.wma,.opus,.webm"
                multiple
                onChange={handleChange}
            />
            <span className="file-status">{fileName}</span>
        </div>
    );
};

export default SongForm;
