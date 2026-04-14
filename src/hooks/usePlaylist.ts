import { useRef, useState, useEffect } from "react";
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";

export type PlaylistInfo = {
    id: string;
    name: string;
    playlist: Playlist;
    coverUrl: string | null;
};

const createDefaultPlaylist = (): { playlists: PlaylistInfo[]; defaultId: string } => {
    const id = crypto.randomUUID();
    return {
        playlists: [{ id, name: "Mi Playlist", playlist: new Playlist(), coverUrl: null }],
        defaultId: id
    };
};

export const usePlaylist = () => {
    const initial = useRef(createDefaultPlaylist());

    const [playlists, setPlaylists] = useState<PlaylistInfo[]>(initial.current.playlists);
    const [activePlaylistId, setActivePlaylistId] = useState(initial.current.defaultId);

    // Estados para reactividad de la UI
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Referencia mutable para acceder siempre al estado actual
    const playlistsRef = useRef(playlists);
    playlistsRef.current = playlists;

    const activeIdRef = useRef(activePlaylistId);
    activeIdRef.current = activePlaylistId;

    const getActive = () => {
        return playlistsRef.current.find(p => p.id === activeIdRef.current) || playlistsRef.current[0];
    };

    const syncWithModel = () => {
        const active = getActive();
        setSongs(active.playlist.toArray());
        setCurrentSong(active.playlist.currentSong?.value || null);
    };

    // Sync cuando cambia la playlist activa
    useEffect(() => {
        syncWithModel();
    }, [activePlaylistId]);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        const active = getActive();
        let currentNode = active.playlist.currentSong;

        if (!currentNode) {
            currentNode = active.playlist.playFirst();
            if (!currentNode) return;
            syncWithModel();
        }

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            if (audio.src !== currentNode.value.previewUrl) {
                audio.src = currentNode.value.previewUrl;
            }
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Error al reproducir:", err);
            }
        }
    };

    const addSong = (file: File, genre: string = "pop", position: "start" | "end" | "middle" = "end", playlistId?: string) => {
        const targetId = playlistId || activeIdRef.current;
        const target = playlistsRef.current.find(p => p.id === targetId);
        if (!target) return;

        const newSong = new Song("Artista Desconocido", file, genre);
        if (position === "start") {
            target.playlist.prepend(newSong);
        } else if (position === "middle") {
            const mid = Math.floor(target.playlist.toArray().length / 2);
            target.playlist.insert(newSong, mid);
        } else {
            target.playlist.appendSong(newSong);
        }

        // Forzar re-render de playlists para actualizar contadores
        setPlaylists([...playlistsRef.current]);

        if (targetId === activeIdRef.current) {
            syncWithModel();
        }
    };

    const removeSong = (index: number) => {
        const active = getActive();
        active.playlist.remove(index);
        setPlaylists([...playlistsRef.current]);
        syncWithModel();

        if (active.playlist.toArray().length === 0) {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        }
    };

    const next = () => {
        const active = getActive();
        const node = active.playlist.playNext();
        if (node && audioRef.current) {
            audioRef.current.src = node.value.previewUrl;
            audioRef.current.play();
            setIsPlaying(true);
        }
        syncWithModel();
    };

    const prev = () => {
        const active = getActive();
        const node = active.playlist.playPrev();
        if (node && audioRef.current) {
            audioRef.current.src = node.value.previewUrl;
            audioRef.current.play();
            setIsPlaying(true);
        }
        syncWithModel();
    };

    // Manejo de eventos de audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        const handleLoadedMetadata = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => {
            setIsPlaying(false);
            const active = playlistsRef.current.find(p => p.id === activeIdRef.current) || playlistsRef.current[0];
            const node = active.playlist.playNext();
            if (node && audio) {
                audio.src = node.value.previewUrl;
                audio.play();
                setSongs(active.playlist.toArray());
                setCurrentSong(active.playlist.currentSong?.value || null);
            }
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const playSongAt = async (index: number) => {
        const active = getActive();
        const node = active.playlist.playAt(index);
        if (node && audioRef.current) {
            audioRef.current.src = node.value.previewUrl;
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Error al reproducir:", err);
            }
        }
        syncWithModel();
    };

    const moveSong = (from: number, to: number) => {
        const active = getActive();
        active.playlist.move(from, to);
        syncWithModel();
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const changeVolume = (vol: number) => {
        setVolume(vol);
    };

    const createPlaylist = (name: string, coverUrl: string | null = null) => {
        const newPlaylist: PlaylistInfo = {
            id: crypto.randomUUID(),
            name,
            playlist: new Playlist(),
            coverUrl
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist.id;
    };

    const updatePlaylistCover = (id: string, coverUrl: string) => {
        const target = playlistsRef.current.find(p => p.id === id);
        if (target) {
            target.coverUrl = coverUrl;
            setPlaylists([...playlistsRef.current]);
        }
    };

    const deletePlaylist = (id: string) => {
        if (playlistsRef.current.length <= 1) return;
        const remaining = playlistsRef.current.filter(p => p.id !== id);
        setPlaylists(remaining);
        if (activeIdRef.current === id) {
            setActivePlaylistId(remaining[0].id);
        }
    };

    const switchPlaylist = (id: string) => {
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        setActivePlaylistId(id);
    };

    return {
        songs,
        currentSong,
        isPlaying,
        audioRef,
        currentTime,
        duration,
        volume,
        playlists,
        activePlaylistId,
        addSong,
        removeSong,
        togglePlay,
        playNextSong: next,
        playPreviousSong: prev,
        playSongAt,
        moveSong,
        seek,
        changeVolume,
        createPlaylist,
        deletePlaylist,
        switchPlaylist,
        updatePlaylistCover
    };
};
