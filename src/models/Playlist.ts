import { SongNode } from "./SongNode";
import { Song } from "./Song";

export class Playlist {

    private _firstSong: SongNode | null = null;
    private _lastSong: SongNode | null = null;
    private _length: number = 0;

    private _currentSong: SongNode | null = null;

    get currentSong(): SongNode | null {
        return this._currentSong;
    }

    public setCurrentSong(node: SongNode | null): void {
        this._currentSong = node;
    }

    public appendSong(song: Song): void {
        const newNode = new SongNode(song);

        if (!this._firstSong) {
            this._firstSong = newNode;
            this._lastSong = newNode;
        } else {
            newNode.prevSong = this._lastSong;
            if (this._lastSong) this._lastSong.nextSong = newNode;
            this._lastSong = newNode;
        }

        this._length++;
    }

    public remove(index: number): void {

        if (index < 0 || index >= this._length) return;

        const node = this.traverseToIndex(index);
        if (!node) return;

        if (node === this._currentSong) {
            this._currentSong = node.nextSong || node.prevSong;
        }

        if (node.prevSong) node.prevSong.nextSong = node.nextSong;
        else this._firstSong = node.nextSong;

        if (node.nextSong) node.nextSong.prevSong = node.prevSong;
        else this._lastSong = node.prevSong;

        node.value.releasePreviewUrl();

        this._length--;
    }

    public traverseToIndex(index: number): SongNode | null {
        let current = this._firstSong;
        let i = 0;

        while (current && i < index) {
            current = current.nextSong;
            i++;
        }

        return current;
    }

    public playFirst(): SongNode | null {
        this._currentSong = this._firstSong;
        return this._currentSong;
    }

    public playNext(): SongNode | null {
        if (!this._currentSong) return this.playFirst();

        this._currentSong = this._currentSong.nextSong || this._firstSong;
        return this._currentSong;
    }

    public playPrev(): SongNode | null {
        if (!this._currentSong) return this.playFirst();

        this._currentSong = this._currentSong.prevSong || this._lastSong;
        return this._currentSong;
    }

    public toArray(): Song[] {
        const result: Song[] = [];
        let current = this._firstSong;

        while (current) {
            result.push(current.value);
            current = current.nextSong;
        }

        return result;
    }

    //  MOVER DE POSICIÓN
    public move(from: number, to: number): void {

        if (from === to) return;

        const node = this.traverseToIndex(from);
        if (!node) return;

        const isCurrent = node === this._currentSong;

        // Desconectar nodo.
        if (node.prevSong) node.prevSong.nextSong = node.nextSong;
        else this._firstSong = node.nextSong;

        if (node.nextSong) node.nextSong.prevSong = node.prevSong;
        else this._lastSong = node.prevSong;

        this._length--;

        // Insertar nodo en nueva posición.
        if (to <= 0) {
            node.prevSong = null;
            node.nextSong = this._firstSong;

            if (this._firstSong) this._firstSong.prevSong = node;

            this._firstSong = node;

            if (!this._lastSong) this._lastSong = node;
        } else if (to >= this._length) {
            node.nextSong = null;
            node.prevSong = this._lastSong;

            if (this._lastSong) this._lastSong.nextSong = node;

            this._lastSong = node;
        } else {
            const prev = this.traverseToIndex(to - 1);
            if (!prev) return;

            const next = prev.nextSong;

            prev.nextSong = node;
            node.prevSong = prev;

            node.nextSong = next;
            if (next) next.prevSong = node;
        }

        this._length++;

        if (isCurrent) {
            this._currentSong = node;
        }
    }

    public insert(song: Song, position: number): void {

        if (position <= 0) {
            const newNode = new SongNode(song);

            newNode.nextSong = this._firstSong;
            if (this._firstSong) this._firstSong.prevSong = newNode;

            this._firstSong = newNode;

            if (!this._lastSong) this._lastSong = newNode;

            this._length++;
            return;
        }

        if (position >= this._length) {
            this.appendSong(song);
            return;
        }

        const prev = this.traverseToIndex(position - 1);
        if (!prev) return;

        const newNode = new SongNode(song);

        const next = prev.nextSong;

        prev.nextSong = newNode;
        newNode.prevSong = prev;

        newNode.nextSong = next;
        if (next) next.prevSong = newNode;

        this._length++;
    }
}