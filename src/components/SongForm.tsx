type Props = {
    onAddSong: (file: File) => void;
};

const SongForm = ({ onAddSong }: Props) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => onAddSong(file));
    };

    return (
        <input type="file" accept="audio/*" multiple onChange={handleChange} />
    );
};

export default SongForm;