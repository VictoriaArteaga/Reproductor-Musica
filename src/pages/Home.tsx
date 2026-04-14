import { usePlaylist } from "../hooks/usePlaylist";
import SongForm from "../components/SongForm";
import SongList from "../components/SongList";
import LivePlayerCard from "../components/LivePlayerCard";
import { useState, useEffect, useRef } from "react";

const Home = () => {
    const {
        songs, currentSong, isPlaying, audioRef,
        currentTime, duration, volume,
        playlists, activePlaylistId,
        addSong, removeSong, togglePlay,
        playNextSong, playPreviousSong, playSongAt, moveSong, seek, changeVolume,
        createPlaylist, deletePlaylist, switchPlaylist, updatePlaylistCover
    } = usePlaylist();

    const [showLivePlayer, setShowLivePlayer] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistCover, setNewPlaylistCover] = useState<string | null>(null);
    const playlistCoverInputRef = useRef<HTMLInputElement>(null);
    const editCoverInputRef = useRef<HTMLInputElement>(null);
    const [editCoverTargetId, setEditCoverTargetId] = useState<string | null>(null);

    useEffect(() => {
        if (currentSong && isPlaying) {
            setShowLivePlayer(true);
        }
    }, [currentSong, isPlaying]);

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

    const handleAddSong = (file: File, genre: string, position: "start" | "end" | "middle", playlistId: string) => {
        addSong(file, genre, position, playlistId);
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

    const getSidebarImage = (): string | null => {
        if (activePlaylist?.coverUrl) return activePlaylist.coverUrl;
        if (currentSong) {
            if (currentSong.coverUrl) return currentSong.coverUrl;
            const genreKey = currentSong.genre.toLowerCase();
            const genreImage = genreImageMap[genreKey] || "genero pop.jpg";
            return `/gener/${genreImage}`;
        }
        return null;
    };

    const handleCloseLivePlayer = () => {
        if (isPlaying) {
            togglePlay();
        }
        setShowLivePlayer(false);
    };

    const handleCreatePlaylist = () => {
        const name = newPlaylistName.trim();
        if (name.length === 0) return;
        createPlaylist(name, newPlaylistCover);
        setNewPlaylistName("");
        setNewPlaylistCover(null);
    };

    const handleNewPlaylistCover = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewPlaylistCover(URL.createObjectURL(file));
        }
        if (playlistCoverInputRef.current) playlistCoverInputRef.current.value = "";
    };

    const handleEditCover = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editCoverTargetId) {
            updatePlaylistCover(editCoverTargetId, URL.createObjectURL(file));
        }
        if (editCoverInputRef.current) editCoverInputRef.current.value = "";
        setEditCoverTargetId(null);
    };

    const activePlaylist = playlists.find(p => p.id === activePlaylistId);

    return (
        <div className="virelmi-app">
            <header className="main-header">
                <h1 className="virelmi-title">Virelm <span className="player-tag">Player</span></h1>
            </header>

            <main className="app-layout">
                <aside className="sidebar">
                    <div className="current-track-card">
                        <div className="track-artwork">
                            {getSidebarImage() ? (
                                <img
                                    src={getSidebarImage()!}
                                    alt={currentSong ? currentSong.genre : "Playlist"}
                                    className="sidebar-genre-img"
                                />
                            ) : (
                                <span className="sidebar-no-img">🎵</span>
                            )}
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
                        <h3 className="nav-title">Mis Playlists</h3>
                        <ul>
                            {playlists.map(pl => (
                                <li
                                    key={pl.id}
                                    className={pl.id === activePlaylistId ? "active" : ""}
                                    onClick={() => switchPlaylist(pl.id)}
                                >
                                    <span className="sidebar-playlist-name">{pl.name}</span>
                                    <span className="sidebar-playlist-count">
                                        {pl.playlist.toArray().length}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <section className="main-content">
                    <div className="content-grid">
                        <div className="white-card">
                            <h2 className="card-title">Crear Nueva Playlist</h2>
                            <input
                                ref={playlistCoverInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleNewPlaylistCover}
                            />
                            <input
                                ref={editCoverInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleEditCover}
                            />
                            <div className="create-playlist-form">
                                <div
                                    className="playlist-cover-picker"
                                    onClick={() => playlistCoverInputRef.current?.click()}
                                    title="Agregar portada"
                                >
                                    {newPlaylistCover ? (
                                        <img src={newPlaylistCover} alt="portada" className="playlist-cover-preview" />
                                    ) : (
                                        <span className="playlist-cover-placeholder">+</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleCreatePlaylist(); }}
                                    placeholder="Nombre de la playlist..."
                                    className="playlist-name-input"
                                />
                                <button onClick={handleCreatePlaylist} className="btn-create-playlist">
                                    Crear
                                </button>
                            </div>
                            {playlists.length > 0 && (
                                <div className="playlist-chips">
                                    {playlists.map(pl => (
                                        <div
                                            key={pl.id}
                                            className={`playlist-chip ${pl.id === activePlaylistId ? "active" : ""}`}
                                            onClick={() => switchPlaylist(pl.id)}
                                        >
                                            <span
                                                className="chip-cover"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditCoverTargetId(pl.id);
                                                    editCoverInputRef.current?.click();
                                                }}
                                                title="Cambiar portada"
                                            >
                                                {pl.coverUrl ? (
                                                    <img src={pl.coverUrl} alt="" className="chip-cover-img" />
                                                ) : (
                                                    <span className="chip-cover-default">🎶</span>
                                                )}
                                            </span>
                                            <span>{pl.name}</span>
                                            <span className="chip-count">{pl.playlist.toArray().length}</span>
                                            {playlists.length > 1 && (
                                                <button
                                                    className="chip-delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deletePlaylist(pl.id);
                                                    }}
                                                    title="Eliminar playlist"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="white-card">
                            <h2 className="card-title">Añadir Nueva Canción a la Playlist</h2>
                            <SongForm
                                onAddSong={handleAddSong}
                                playlists={playlists}
                                activePlaylistId={activePlaylistId}
                            />
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
                            <h3 className="card-title">
                                {activePlaylist?.name || "Playlist"} ({songs.length} canciones)
                            </h3>
                            {songs.length > 0 && (
                                <div className="playlist-play-bar">
                                    <button
                                        className="btn-play-playlist"
                                        onClick={() => { playSongAt(0); }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        Reproducir Playlist
                                    </button>
                                </div>
                            )}

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
