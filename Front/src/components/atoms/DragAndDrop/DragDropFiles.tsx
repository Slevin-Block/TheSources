import { useState, useRef, MutableRefObject, FC, Dispatch  } from "react";
import { minifyStr } from "../../../utils/minifyStr";
import { FileImport, Validate, Cancel } from "../svgs";
import styles from "./DragDropFiles.module.css"

interface Props {
  files: FileList | null;
  setFiles: Dispatch<React.SetStateAction<FileList | null>>;
}

const DragDropFiles: FC<Props> = ({files, setFiles}) => {
    const inputRef : MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null!);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setFiles(event.dataTransfer.files)
    };

    if (files) return (
        <>
            <div className={styles.uploads}>
                <p>{minifyStr(Array.from(files)[0].name)}</p>
                <div className="actions">
                    <button onClick={() => setFiles(null)}><Cancel className={`${styles.iconButton} ${styles.cancel}`}/></button>
                    {/* <button onClick={handleUpload}><Validate className={`${styles.iconButton} ${styles.validate}`}/></button> */}
                </div>
            </div>
        </>
    )

    return (
        <>
            <div
                className={styles.dropzone}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <FileImport className={styles.icon} />
                <input
                    type="file"
                    multiple
                    onChange={(event) => setFiles(event.target.files)}
                    hidden
                    accept="image/png, image/jpeg"
                    ref={inputRef}
                />
            </div>
        </>
    );
};

export default DragDropFiles;
