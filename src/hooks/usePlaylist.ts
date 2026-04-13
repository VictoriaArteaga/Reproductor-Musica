import { useRef, useState, useEffect } from "react";
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";

export const usePlaylist = () => {

    // 1. La instancia persistente de la lista enlazada.
    const playlist = useRef(new Playlist());

    // 2. Estados de React para reflejar los cambios en la interfaz.
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);

    // 3. Referencia al elemento de audio.
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Sincronización.
    const syncState = () => {
        const listInstance = playlist.current;

        setSongs(listInstance.toArray());
        setCurrentSong(listInstance.currentSong?.value || null);
    };

    // ACCIONES DE LA PLAYLIST.

    const addSong = (file: File, artistName: string = "Artista Desconocido") => {
    const newSong = new Song(artistName, file);
    playlist.current.appendSong(newSong);

    // Autoplay si es la primera canción.
    if (playlist.current.length === 1) {
        const node = playlist.current.playFirst();
        if (node) playAudio(node.value.previewUrl);
    }

    syncState();
};

    const removeSong = (index: number) => {
        playlist.current.remove(index);
        syncState();
    };

    //  LÓGICA DE REPRODUCCIÓN.

    const playFirstSong = () => {
        const firstSongNode = playlist.current.playFirst();

        if (firstSongNode) {
            playAudio(firstSongNode.value.previewUrl);
        }

        syncState();
    };

    const playNextSong = () => {
        const nextSongNode = playlist.current.playNext();

        if (nextSongNode) {
            playAudio(nextSongNode.value.previewUrl);
        }

        syncState();
    };

    const playPreviousSong = () => {
        const previousSongNode = playlist.current.playPrev();

        if (previousSongNode) {
            playAudio(previousSongNode.value.previewUrl);
        }

        syncState();
    };

    // Control directo del reproductor de audio.
    const playAudio = async (url: string) => {
    if (!audioRef.current) return;

    try {
        // No recarga si es la misma canción.
        if (audioRef.current.src !== url) {
            audioRef.current.src = url;
        }

        await audioRef.current.play();
    } catch (error) {
        console.error("Error reproduciendo audio:", error);}
    };

    // Auto next.
    useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
        playNextSong();
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
        audio.removeEventListener("ended", handleEnded);
    };
}, [playNextSong]);

    // Limpieza de memoria al desmontar el componente.
    useEffect(() => {
        return () => {
            const allSongs = playlist.current.toArray();
            allSongs.forEach(song => song.releasePreviewUrl());
        };
    }, []);

    // EXPORTACIÓN.

    return {
        songs,           // Lista de canciones para el UI
        currentSong,     // Canción sonando actualmente.
        audioRef,        // Referencia para la etiqueta <audio>
        addSong,
        removeSong,
        playFirstSong,
        playNextSong,
        playPreviousSong
    };
};