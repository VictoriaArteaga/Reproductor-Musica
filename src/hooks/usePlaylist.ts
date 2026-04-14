import { useRef, useState, useEffect } from "react";
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";

export const usePlaylist = () => {
    // Referencia persistente a la estructura de datos
    const playlist = useRef(new Playlist());
    
    // Estados para reactividad de la UI
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Función de sincronización para actualizar la UI según el modelo
    const syncWithModel = () => {
        const songsArray = playlist.current.toArray();
        setSongs(songsArray);
        setCurrentSong(playlist.current.currentSong?.value || null);
    };

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        let currentNode = playlist.current.currentSong;

        // Si no hay canción seleccionada, intenta poner la primera
        if (!currentNode) {
            currentNode = playlist.current.playFirst();
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

    const addSong = (file: File, genre: string = "pop") => {
        const newSong = new Song("Artista Desconocido", file, genre);
        playlist.current.appendSong(newSong);
        syncWithModel();
    };

    const removeSong = (index: number) => {
        playlist.current.remove(index);
        syncWithModel();
        
        // Si la lista queda vacía, detenemos el audio
        if (playlist.current.toArray().length === 0) {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        }
    };

    const next = () => {
        const node = playlist.current.playNext();
        if (node && audioRef.current) {
            audioRef.current.src = node.value.previewUrl;
            audioRef.current.play();
            setIsPlaying(true);
        }
        syncWithModel();
    };

    const prev = () => {
        const node = playlist.current.playPrev();
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
            const node = playlist.current.playNext();
            if (node && audio) {
                audio.src = node.value.previewUrl;
                audio.play();
                syncWithModel();
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

    // Actualizar volumen cuando cambie el estado
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const playSongAt = async (index: number) => {
        const node = playlist.current.playAt(index);
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
        playlist.current.move(from, to);
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

    return {
        songs,
        currentSong,
        isPlaying,
        audioRef,
        currentTime,
        duration,
        volume,
        addSong,
        removeSong,
        togglePlay,
        playNextSong: next,
        playPreviousSong: prev,
        playSongAt,
        moveSong,
        seek,
        changeVolume
    };
};