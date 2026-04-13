import { useRef, useState, useEffect } from "react";
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";

export const usePlaylist = () => {

    const playlist = useRef(new Playlist());

    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const syncState = () => {
        const list = playlist.current;
        setSongs(list.toArray());
        setCurrentSong(list.currentSong?.value || null);
    };

    const playAudio = async (url: string) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.src !== url) {
            audio.src = url;
        }

        try {
            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.error("Error al reproducir:", error);
        }
    };

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        let currentNode = playlist.current.currentSong;

        if (!currentNode) {
            currentNode = playlist.current.playFirst();
            if (!currentNode) return;
            syncState();
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
            } catch (error) {
                console.error("Error al dar play:", error);
            }
        }
    };

    const addSong = (file: File, artist = "Artista Desconocido") => {
        playlist.current.appendSong(new Song(artist, file));
        syncState();
    };

    const removeSong = (index: number) => {

        const wasPlaying = isPlaying;

        playlist.current.remove(index);

        const current = playlist.current.currentSong;

        syncState();

        if (current && wasPlaying) {
            playAudio(current.value.previewUrl);
        } else if (!current && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const playNextSong = () => {
        const node = playlist.current.playNext();
        if (node) playAudio(node.value.previewUrl);
        syncState();
    };

    const playPreviousSong = () => {
        const node = playlist.current.playPrev();
        if (node) playAudio(node.value.previewUrl);
        syncState();
    };

    const playSongAt = (index: number) => {
        const node = playlist.current.traverseToIndex(index);
        if (!node) return;

        playlist.current.setCurrentSong(node);

        playAudio(node.value.previewUrl);
        syncState();
    };

    const moveSong = (from: number, to: number) => {
        playlist.current.move(from, to);
        syncState();
    };

    const seek = (time: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = time;
    };

    const changeVolume = (value: number) => {
        if (!audioRef.current) return;

        audioRef.current.volume = value;
        setVolume(value);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const setMeta = () => setDuration(audio.duration);
        const handleEnded = () => playNextSong();

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", setMeta);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", setMeta);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    useEffect(() => {
        return () => {
            playlist.current.toArray().forEach(s => s.releasePreviewUrl());
        };
    }, []);

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
        playNextSong,
        playPreviousSong,
        playSongAt,
        moveSong,
        seek,
        changeVolume
    };
};