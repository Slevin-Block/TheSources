import React, { useEffect, useRef, useState } from 'react'
import DragDropFiles from '../../atoms/DragAndDrop/DragDropFiles'
import { useAccount, useContract, useContractRead, useProvider } from 'wagmi';
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import styles from './NewArticle.module.css'
import { BigNumber, ethers } from 'ethers';
import { useRecoilValue } from 'recoil';
import { ContractsState } from '../../../store/ContractsState';
import TheSourceMemberToken from "../../../artifacts/contracts/TheSourceMemberToken.sol/TheSourceMemberToken.json"
import { usePastEvents } from '../../../utils/usePastEvent';
import { Action } from './Action';

type MetadataType = {
    name: string;
    description: string;
    image?: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
}
type Article = {
    memberTokenId: number;
    title: string;
    description: string;
    authorName: string;
    supply: BigNumber;
    price: BigNumber;
    URI: string;
    folderCID: string,
    timeoutBreaker : NodeJS.Timeout,
}


export default function NewArticle() {
    const [newArticle, setNewArticle] = useState<Article | null>(null);
    const [myTokenIds, setMyTokenIds] = useState<number[] | []>([]);
    const [error, setError] = useState<string | null>(null)
    const [cover, setCover] = useState<FileList | null>(null);
    const [article, setArticle] = useState<FileList | null>(null);
    const tokenIdRef = useRef<HTMLSelectElement>(null)
    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const authorRef = useRef<HTMLInputElement>(null)
    const quantityRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isMinting, setIsMinting] = useState(false)




    const { address } = useAccount()
    const contracts = useRecoilValue(ContractsState)
    const provider = useProvider()
    const memberTokenContract = useContract({
        address: contracts.memberToken,
        abi: TheSourceMemberToken.abi,
        signerOrProvider: provider,
    })
    const events = usePastEvents(memberTokenContract, "Transfer", address, ['from', 'to', 'tokenId'])

    useEffect(() => {
        if (events.length > 0) {
            const values = events.flatMap(event => event.to === address ? event.tokenId.toNumber() : [])
            setMyTokenIds(values)
        }
    }, [events])

// READ THE CURRENT PRICE OF MEMBER TOKEN
    const { data: currentArticlePrice } = useContractRead({
        address: contracts.marketPlace, abi: theSourceMarketPlace.abi,
        functionName: 'getArticlePrice',
        watch: true,
    })




    const handleClick = async () => {
        const title = titleRef.current?.value
        const description = descriptionRef.current?.value
        const author = authorRef.current?.value
        const supply = quantityRef.current?.value
        const price = priceRef.current?.value
        const tokenId = tokenIdRef.current?.value;
        if (!title || !description || !author || !supply || !price || !cover || !article || !tokenId) return setError('Missing field')
        if (!parseInt(supply) || !parseFloat(price)) return setError('Invalid field')
        if (parseInt(supply) < 0) return setError('Wrong supply')
        if (parseInt(tokenId) < 0) return setError('Wrong tokenId')
        if (parseFloat(price) < 0) return setError('Wrong price')
        if (!BigNumber.isBigNumber(currentArticlePrice)) return setError('Wrong Article Fees')
        setIsLoading(true)
        if (cover && article && title && author) {
            const myCover = cover[0]
            const myArticle = article[0]
            try {

                if (!["jpg", "png", "svg"].includes(myCover.name.split('.')[1])) {
                    return setError(`Cover hasn't the good format : , ${myCover.name.split('.').at(1)}`)
                }
                if (myArticle.name.split('.')[1] !== 'pdf') {
                    return setError(`Article hasn't the good format : ${myArticle.name.split('.').at(1)}`)
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
                setIsLoading(false)
                if (!folderCID || !metadataCID) return setError('Wrong CIDs generation')

                if (body.status = 'ok') {
                    setIsMinting(true)
                    // AUTOMATIC UNPINNING
                    const timeout = setTimeout(() => {
                        console.log('Try to unpin')
                        fetch('/api/unpin', { method: "POST", body: JSON.stringify({ cid: metadataCID }) })
                            .then(res => res.json())
                            .then(data => console.log(data))
                            .catch(err => console.log(err))
                        fetch('/api/unpin', { method: "POST", body: JSON.stringify({ cid: folderCID }) })
                            .then(res => res.json())
                            .then(data => console.log(data))
                            .catch(err => console.log(err))
                    }, 30000)

                    setNewArticle({
                        memberTokenId: parseInt(tokenId),
                        title: title,
                        description: description,
                        authorName: author,
                        supply: ethers.BigNumber.from(supply.toString()),
                        price: ethers.utils.parseEther(price),
                        URI: metadataCID,
                        folderCID: folderCID,
                        timeoutBreaker : timeout
                    })
                }
            } catch (err) {
                setError("Transfert error")
                setIsLoading(false)
            }

        } else { console.log("Error, il manque des éléments") }
    }

    useEffect(() => { if (error) { setTimeout(() => { setError(null) }, 2000) } }, [error])

    return (
        <>
            <div className={styles.container}>
                {isLoading && <div className={`spinner ${styles.spinner}`}></div>}
                {error && <div className={`error ${styles.error}`}>{error}</div>}
                <h2>New Article</h2>
                <div className={styles.box}>
                    <div className={styles.field}>
                        <label>Select TokenID</label>
                        <select disabled={isLoading} ref={tokenIdRef}>
                            {myTokenIds.map((id, key) => <option key={key} value={id}>{id}</option>)}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Author of the article</label>
                        <input placeholder='Author' ref={authorRef} defaultValue="Moi" disabled={isLoading} />
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.field}>
                        <label>Title of your article</label>
                        <input placeholder='Title' ref={titleRef} defaultValue="Mon Titre" disabled={isLoading} maxLength={20}/>
                    </div>
                    <div className={styles.field}>
                        <label>Description of your article</label>
                        <input placeholder='Description' ref={descriptionRef} defaultValue="Mon super article" disabled={isLoading} maxLength={20}/>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.field}>
                        <label>Quantity of NFT</label>
                        <input placeholder='Quantity' ref={quantityRef} defaultValue={10} disabled={isLoading} type="number" min={0} max={100}/>
                    </div>
                    <div className={styles.field}>
                        <label>Price of each NFT</label>
                        <input placeholder='Price of each NFT' ref={priceRef} defaultValue={0.05} disabled={isLoading} type="number" min={0} step={0.005}/>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.field}>
                        <label>Add your cover</label>
                        <DragDropFiles files={cover} setFiles={setCover} type="image" disabled={isLoading} />
                    </div>
                    <div className={styles.field}>
                        <label>Add your article</label>
                        <DragDropFiles files={article} setFiles={setArticle} type="pdf" disabled={isLoading} />
                    </div>
                </div>
                {!isMinting &&<button onClick={() => handleClick()} disabled={isLoading} >Mint your article</button>}
                {(isMinting && !!newArticle) &&<Action article={newArticle} setAction={setIsMinting} value={ethers.utils.formatEther(BigNumber.from(currentArticlePrice))}/>}

            </div>
        </>
    )
}