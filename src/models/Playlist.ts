import { SongNode } from "./SongNode";
import { Song } from "./Song";

export class Playlist {

    private _firstSong: SongNode | null;
    private _lastSong: SongNode | null;
    private _length: number;

    private _currentSong: SongNode | null;

    constructor() {
        this._firstSong = null;
        this._lastSong = null;
        this._length = 0;
        this._currentSong = null;

    }

    // GETTERS.

    get firstSong(): SongNode | null {
        return this._firstSong;
    }

    get lastSong(): SongNode | null {
        return this._lastSong;
    }

    get length(): number {
        return this._length;
    }

    get currentSong(): SongNode | null {
    return this._currentSong;
}

    // MÉTODOS ESPECIALES.

    // 1. Agregar por el final de la lista.
    public appendSong(song: Song): void {

        // Nuevo Nodo.
        const newSongNode = new SongNode(song);

        if (this._firstSong === null) {
            this._firstSong = newSongNode;
            this._lastSong = newSongNode;
        }

        else {

            newSongNode.prevSong = this._lastSong;

            if (this._lastSong != null) { this._lastSong.nextSong = newSongNode; }

            this._lastSong = newSongNode;
        }

        this._length++;
    }

    // 2. Agregar por el inicio de la lista.
    public prependSong(song: Song): void {

        const newSongNode = new SongNode(song);

        if (this._firstSong ===  null) {
            this._firstSong = newSongNode;
            this._lastSong = newSongNode;
        }

        else {

            newSongNode.nextSong = this._firstSong;
            this._firstSong.prevSong = newSongNode;
            this._firstSong = newSongNode;
        }

        this._length++;
    }   

    // 3. Rastreador.
    public traverseToIndex(index: number): SongNode | null {

        if (index < 0 || index >= this._length) return null;

        let currentSong = this._firstSong;
        let counter = 0;

        while (counter !== index && currentSong !== null) {
            currentSong = currentSong.nextSong;
            counter++;
        }

        return currentSong;
    }

    // 4. Agregar en cualquier posición de la lista.
    public insert(song: Song, position: number): void {

        // 1. Insertar por el inicio.
        if (position <= 0) {
            this.prependSong(song);
            return;
        }

        // 2. Insertar por el final.
        if (position >= this._length) {
            this.appendSong(song);
            return;
        }

        // 3. Insertar en medio.
        const newSongNode = new SongNode(song);
        const prevSongNode = this.traverseToIndex(position - 1);

        if (prevSongNode) {
            const nextSongNode = prevSongNode.nextSong;

            // Conectamos el anterior con el nuevo.
            prevSongNode.nextSong = newSongNode;
            newSongNode.prevSong = prevSongNode;

            // Conectamos el nuevo con el siguiente.
            newSongNode.nextSong = nextSongNode;

            if (nextSongNode) {
                nextSongNode.prevSong = newSongNode;
            }

            this._length++; 
        } 
    }

    // 5. Eliminar por posición.
    public remove(position: number): void {

    // Validación
    if (position < 0 || position >= this._length) return;

    let songNodeToRemove: SongNode | null = null;

    // Eliminar inicio
    if (position === 0) {
        songNodeToRemove = this._firstSong;

        this._firstSong = this._firstSong?.nextSong || null;

        if (this._firstSong) {
            this._firstSong.prevSong = null;
        } else {
            this._lastSong = null;
        }
    }

    // Eliminar final
    else if (position === this._length - 1) {
        songNodeToRemove = this._lastSong;

        this._lastSong = this._lastSong?.prevSong || null;

        if (this._lastSong) {
            this._lastSong.nextSong = null;
        } else {
            this._firstSong = null;
        }
    }

    // Eliminar en medio
    else {
        const previousSongNode = this.traverseToIndex(position - 1);

        if (previousSongNode && previousSongNode.nextSong) {
            songNodeToRemove = previousSongNode.nextSong;

            const nextSongNode = songNodeToRemove.nextSong;

            previousSongNode.nextSong = nextSongNode;

            if (nextSongNode) {
                nextSongNode.prevSong = previousSongNode;
            }
        }
    }

    // si se elimina la que está sonando.
    if (songNodeToRemove === this._currentSong) {
        this._currentSong =
            songNodeToRemove?.nextSong ||
            songNodeToRemove?.prevSong ||
            null;
    }

    // Liberar memoria
    if (songNodeToRemove) {
        songNodeToRemove.value.releasePreviewUrl();
    }

    this._length--;
}

    // 6. Mostrar las canciones.
    public printPlaylist(): void {

        let currentSong = this._firstSong;
        let result: string[] = [];

        while (currentSong !== null) {
            if (currentSong.value) {
            
                result.push(currentSong.value.name);
            }
            currentSong = currentSong.nextSong;
        }

        console.log(result.join(" - "));
    }

    // REPRODUCCIÓN DE CANCIONES.

    // 1. Reproducir siguiente canción.
    public playNext(): SongNode | null {

    if (!this._currentSong) {
        return this.playFirst();
    }

    if (this._currentSong.nextSong) {
        this._currentSong = this._currentSong.nextSong;
    } else {
        this._currentSong = this._firstSong; 
    }

    return this._currentSong; }

    // 2. Reproducir canción anterior.
    public playPrev(): SongNode | null {

    if (!this._currentSong) {
        return this.playFirst();
    }

    if (this._currentSong.prevSong) {
        this._currentSong = this._currentSong.prevSong;
    } else {
        this._currentSong = this._lastSong; 
    }

    return this._currentSong; }

    // 3. Reproducir primer canción.
    public playFirst(): SongNode | null {
    this._currentSong = this._firstSong;
    return this._currentSong; }

    // OBTENER LA LISTA COMO ARRAY.
    public toArray(): Song[] {

    let current = this._firstSong;
    const songs: Song[] = [];

    while (current !== null) {
        songs.push(current.value);
        current = current.nextSong;
    }

    return songs; }
}