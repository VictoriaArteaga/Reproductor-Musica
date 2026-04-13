import { Song } from "./Song";

export class SongNode {

    private _value: Song;
    private _prevSong: SongNode | null;
    private _nextSong: SongNode | null;


    constructor(song: Song) {
        this._value = song;
        this._prevSong = null;
        this._nextSong = null;
    }

    // Getters y Setters.

    get value(): Song {
        return this._value;
    }

    get prevSong(): SongNode | null {
        return this._prevSong;
    } 

    set prevSong(song: SongNode | null) {
        this._prevSong = song;
    }

    get nextSong(): SongNode | null {
        return this._nextSong;
    }

    set nextSong(song: SongNode | null) {
        this._nextSong = song;
    }

}