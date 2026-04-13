export class Song {

    private _id: string;
    private _name: string;
    private _artist: string;
    private _file: File;
    private _previewUrl: string;

    constructor(artist: string = "Desconocido", file: File) {

        this._id = crypto.randomUUID();
        this._name = file.name; //Nombre del archivo como título inicial.
        this._artist = artist;
        this._file = file;

        // Crear una URL temporal que el navegador entiende.
        this._previewUrl = URL.createObjectURL(file);
    }

    // Getters y Setters.

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        if (newName.trim().length > 0) {
            this._name = newName;
        }
    }

    get artist(): string {
        return this._artist;
    }

    set artist(newArtist: string) {
        if (newArtist.trim().length > 0) {
            this._artist = newArtist;
        }
    }

    get file(): File {
        return this._file;
    }

    get previewUrl(): string {
        return this._previewUrl;
    }

    // Liberar URL temporal cuando ya no se necesite.
    public releasePreviewUrl() {
        URL.revokeObjectURL(this._previewUrl);
    }
}