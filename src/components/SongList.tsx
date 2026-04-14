import { Song } from "../models/Song";
import { useState, useRef } from "react";

interface SongListProps {
  songs: Song[];
  onRemove: (index: number) => void;
  onPlay: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onRenameSong: (index: number, newName: string) => void;
  onRenameArtist: (index: number, newArtist: string) => void;
  currentIndex: number;
  isPlaying: boolean;
}

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

const getGenreImage = (genre: string) => {
  const key = genre.toLowerCase();
  const file = genreImageMap[key] || "genero pop.jpg";
  return `/gener/${file}`;
};

const PlayLineIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="4" height="16" rx="1">
      <animate attributeName="height" values="16;8;16" dur="0.8s" repeatCount="indefinite" />
      <animate attributeName="y" values="4;8;4" dur="0.8s" repeatCount="indefinite" />
    </rect>
    <rect x="10" y="4" width="4" height="16" rx="1">
      <animate attributeName="height" values="16;8;16" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
      <animate attributeName="y" values="4;8;4" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
    </rect>
    <rect x="16" y="4" width="4" height="16" rx="1">
      <animate attributeName="height" values="16;12;16" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
      <animate attributeName="y" values="4;6;4" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
    </rect>
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={`heart-icon-svg ${filled ? 'filled' : ''}`}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SongList = ({ songs, onRemove, onPlay, onMove, onRenameSong, onRenameArtist, currentIndex, isPlaying }: SongListProps) => {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<"name" | "artist" | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [, forceUpdate] = useState(0);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverTargetIndex, setCoverTargetIndex] = useState<number | null>(null);

  const toggleLike = (songId: string) => {
    const newLiked = new Set(likedSongs);
    if (newLiked.has(songId)) {
      newLiked.delete(songId);
    } else {
      newLiked.add(songId);
    }
    setLikedSongs(newLiked);
  };

  const startEditName = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditingField("name");
    setEditingValue(currentName);
  };

  const startEditArtist = (index: number, currentArtist: string) => {
    setEditingIndex(index);
    setEditingField("artist");
    setEditingValue(currentArtist);
  };

  const saveEdit = () => {
    if (editingValue.trim().length > 0 && editingIndex !== null) {
      if (editingField === "name") {
        onRenameSong(editingIndex, editingValue);
      } else if (editingField === "artist") {
        onRenameArtist(editingIndex, editingValue);
      }
    }
    setEditingIndex(null);
    setEditingField(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingField(null);
    setEditingValue("");
  };

  const handleCoverClick = (index: number) => {
    setCoverTargetIndex(index);
    coverInputRef.current?.click();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && coverTargetIndex !== null && coverTargetIndex < songs.length) {
      const url = URL.createObjectURL(file);
      songs[coverTargetIndex].coverUrl = url;
      forceUpdate(n => n + 1);
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
    setCoverTargetIndex(null);
  };

  return (
    <div className="songs-container">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleCoverChange}
      />
      {songs.length === 0 ? (
        <p className="no-songs-msg">No hay canciones en la lista</p>
      ) : (
        <ul className="song-list">
          {songs.map((song, index) => (
            <li key={song.id} className={`song-item-row ${currentIndex === index ? 'currently-playing' : ''}`}>
              <div className="song-item-label">
                <span className="song-number">{index + 1}</span>
                <span className="song-playing-icon" style={{ display: currentIndex === index && isPlaying ? 'block' : 'none' }}>
                  <PlayLineIcon />
                </span>
              </div>

              <div className="song-info-wrapper">
                {!(currentIndex === index && isPlaying) && (
                  <button
                    className="song-play-btn"
                    onClick={() => onPlay(index)}
                    title="Reproducir"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                )}
                <span
                  className="song-cover-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCoverClick(index);
                  }}
                  title="Cambiar imagen"
                >
                  <img
                    src={song.coverUrl || getGenreImage(song.genre)}
                    alt={song.coverUrl ? "cover" : song.genre}
                    className="song-cover-img"
                  />
                </span>
                <div className="song-text-details">
                  {editingIndex === index && editingField === "name" ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => saveEdit()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="song-edit-input"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="song-item-name">{song.name}</p>
                  )}
                  {editingIndex === index && editingField === "artist" ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => saveEdit()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="song-edit-input"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="song-item-artist">{song.artist}</p>
                  )}
                </div>
              </div>

              <div className="song-actions">
                <div className="move-buttons">
                  {songs.length === 1 ? null : index === 0 ? (
                    <button
                      onClick={() => onMove(index, index + 1)}
                      disabled={index === songs.length - 1}
                      className="btn-move btn-down"
                      title="Bajar"
                    >
                      ↓
                    </button>
                  ) : index === songs.length - 1 ? (
                    <button
                      onClick={() => onMove(index, index - 1)}
                      disabled={index === 0}
                      className="btn-move btn-up"
                      title="Subir"
                    >
                      ↑
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onMove(index, index - 1)}
                        disabled={index === 0}
                        className="btn-move btn-up"
                        title="Subir"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => onMove(index, index + 1)}
                        disabled={index === songs.length - 1}
                        className="btn-move btn-down"
                        title="Bajar"
                      >
                        ↓
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="btn-text-action"
                  onClick={() => startEditName(index, song.name)}
                  title="Cambiar nombre de canción"
                >
                  Cambiar Nombre
                </button>
                <button
                  className="btn-text-action"
                  onClick={() => startEditArtist(index, song.artist)}
                  title="Cambiar nombre del artista"
                >
                  Cambiar Artista
                </button>
                <button
                  className="btn-heart"
                  onClick={() => toggleLike(song.id)}
                  title="Me gusta"
                >
                  <HeartIcon filled={likedSongs.has(song.id)} />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onRemove(index)}
                  title="Eliminar"
                >
                  <img src="/player/eliminar.png" alt="Eliminar" className="delete-icon" />
                </button>
              </div>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongList;
