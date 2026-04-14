import { useState } from "react";

type Props = {
    onAddSong: (file: File, genre: string) => void;
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

const SongForm = ({ onAddSong }: Props) => {
    const [fileName, setFileName] = useState("Sin archivos seleccionados");
    const [selectedGenre, setSelectedGenre] = useState("genero pop.jpg");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileNames = Array.from(files).map(f => f.name).join(", ");
        setFileName(files.length === 1 ? fileNames : `${files.length} archivos seleccionados`);

        Array.from(files).forEach(file => {
            const genreKey = selectedGenre.split(".jpg")[0].replace("genero ", "").toLowerCase();
            onAddSong(file, genreKey);
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

            <label htmlFor="file-input" className="file-input-btn">
                Elegir archivos
            </label>
            <input 
                id="file-input"
                type="file" 
                accept="audio/*" 
                multiple 
                onChange={handleChange} 
            />
            <span className="file-status">{fileName}</span>
        </div>
    );
};

export default SongForm;
