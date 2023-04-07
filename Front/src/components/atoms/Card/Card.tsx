import React, { FC } from 'react'
import styles from './Card.module.css'
import { BigNumber, ethers } from 'ethers';

type Article = {
    title: string;
    description: string;
    authorName: string;
    authorAddress: `0x${string}`;
    supply: number | BigNumber;
    price: number | string | BigNumber;
    cover?: string;
    article?: string;
    id? : number;
};


interface Props {
    article : Article;
}

export const Card : FC<Props> = ({article}) => {


  return (
    <div className={styles.card}>
        <div className={styles.cover}>
            <img src={article.cover} />
        </div>
        <div className={styles.infos}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <div className={styles.subInfos}>
                <p>Price : {ethers.utils.formatEther(article.price)}</p>
                <p>Items : {article.supply.toString()}</p>
            </div>
            <a href={article.article} target="_blank">Lire l'article</a>
        </div>

    </div>
  )
}
