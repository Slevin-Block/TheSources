import React, { useRef, useState } from 'react'
import DragDropFiles from '../../atoms/DragAndDrop/DragDropFiles'
import { useAccount } from 'wagmi';
import styles from './NewArticle.module.css'

type MetadataType = {
    name: string;
    description: string;
    image?: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
}


export default function NewArticle() {
    const [cover, setCover] = useState<FileList | null>(null);
    const [article, setArticle] = useState<FileList | null>(null);
    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const authorRef = useRef<HTMLInputElement>(null)
    const quantityRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    const {address} = useAccount()


    const handleClick = async () => {
        const title = titleRef.current?.value
        const description = descriptionRef.current?.value
        const author = authorRef.current?.value
        

        if (cover && article && title && author) {
            const myCover = cover[0]
            const myArticle = article[0]

            if (!["jpg", "png", "svg"].includes(myCover.name.split('.')[1])){
                return console.log("Cover hasn't the good format : ", myCover.name.split('.').at(1))
            }
            if (myArticle.name.split('.')[1] !== 'pdf'){
                return console.log("Article hasn't the good format : ", myArticle.name.split('.').at(1))
            }
            let metadata = {
                name: titleRef.current?.value,
                description,
                attributes: [
                    {
                        trait_type: "Author reference",
                        value: author
                    },
                    {
                        trait_type: "Author address",
                        value: address
                    },
                    {
                        trait_type: "Cover",
                        value: `cover.${myCover.name.split('.').at(1)}`
                    },
                    {
                        trait_type: "Article",
                        value: `article.${myArticle.name.split('.').at(1)}`
                    },
                    {
                        trait_type: "Metadata",
                        value: 'metadata.json'
                    },
                ]
            }

            const formData = new FormData();
            const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
            const myMetadata = new File([blob], 'metadata.json', { type: 'application/json' })
            formData.append('file', myCover, `cover.${myCover.name.split('.').at(1)}`);
            formData.append('file', myArticle, `article.${myArticle.name.split('.').at(1)}`);
            formData.append('file', myMetadata, 'metadata.json');
            const response = await fetch('/api/upload', { method: "POST", body: formData })
            const body = await response.json() as { status: 'ok' | 'fail', message: string, cid?: string };
            const folderCID = body.message.split(' ').at(1)
            const metadataCID = `https://gateway.pinata.cloud/ipfs/${body.cid}`
            console.log('Response : ', folderCID, metadataCID)

            if (body.status = 'ok') {
                // AUTOMATIC UNPINNING
                setTimeout(() => {
                    console.log('Try to unpin')
                    fetch('/api/unpin', { method: "POST", body: JSON.stringify({ cid: metadataCID }) })
                        .then(res => res.json())
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                    fetch('/api/unpin', { method: "POST", body: JSON.stringify({ cid: folderCID }) })
                        .then(res => res.json())
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                }, 3000)
            }
        } else { console.log("Error, il manque des éléments") }
    }


    return (
        <>
            <div className={styles.container}>
                <div className={styles.box}>
                    <div>
                        <label>Title of your article</label>
                        <input placeholder='Title' ref={titleRef} defaultValue="Mon Titre" />
                    </div>
                    <div>
                        <label>Author of the article</label>
                        <input placeholder='Author' ref={authorRef} defaultValue="Moi" />
                    </div>
                </div>
                <div>
                    <label>Description of your article</label>
                    <input placeholder='Description' ref={descriptionRef} defaultValue="Mon super article" />
                </div>
                <div className={styles.box}>
                    <div>
                        <label>Quantity of NFT</label>
                        <input placeholder='Quantity' ref={quantityRef} defaultValue="4" />
                    </div>
                    <div>
                        <label>Price of each NFT</label>
                        <input placeholder='Price of each NFT' ref={priceRef} defaultValue="0.2" />
                    </div>
                </div>
                <div className={styles.box}>
                    <div>
                        <label>Add your cover</label>
                        <DragDropFiles files={cover} setFiles={setCover} type="image"/>
                    </div>
                    <div>
                        <label>Add your article</label>
                        <DragDropFiles files={article} setFiles={setArticle} type="pdf"/>
                    </div>
                </div>
                <button onClick={() => handleClick()}>Button</button>
            </div>
        </>
    )
}