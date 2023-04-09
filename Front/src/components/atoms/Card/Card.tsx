import React, { FC, useEffect, useState } from 'react'
import styles from './Card.module.css'
import { BigNumber, ethers } from 'ethers';
import { Action } from './Action';
import { useAccount } from 'wagmi';
import { useRecoilValue } from 'recoil';
import { ContractsState } from '../../../store/ContractsState';

type Article = {
    title: string;
    description: string;
    authorName: string;
    authorAddress: `0x${string}`;
    supply: number | BigNumber;
    price: number | string | BigNumber;
    cover?: string;
    article?: string;
    id?: number;
};

interface Props {
    article: Article;
}

export const Card: FC<Props> = ({ article }) => {
    const contracts = useRecoilValue(ContractsState)
    const [tokenId, setTokenId] = useState<number>(0)
    const [unitPrice, setUnitPrice] = useState<string>('')
    const [action, setAction] = useState(false)
    const { address } = useAccount()

    useEffect(()=>{
        if (!tokenId && article && !isNaN(Number(article.id))) setTokenId(Number(article.id))
        if (!unitPrice && article && BigNumber.isBigNumber(article.price)) setUnitPrice(ethers.utils.formatEther(article.price))
    },[article])


    return (
        <div className={styles.card}>
            <div className={styles.cover}>
                {article.cover && <img src={article.cover} alt='Cover' />}
            </div>
            <div className={styles.infos}>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <div className={styles.subInfos}>
                    <p>Price : {ethers.utils.formatEther(article.price)}</p>
                    <p>Items : {article.supply.toString()}</p>
                </div>
                <a href={article.article} target="_blank" rel="noreferrer" >read article</a>
            </div>

            {(unitPrice !== '' && tokenId) && <Action tokenId={tokenId} unitPrice={unitPrice} setAction={setAction} />}
        </div>
    )
}
