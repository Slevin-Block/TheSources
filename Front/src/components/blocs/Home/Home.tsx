import React, { FC, useEffect, useState } from 'react'
import styles from './Home.module.css'
import { useRecoilValue } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'
import { useAccount, useContract, useProvider } from 'wagmi';
import TheSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import TheSourceArticle from "../../../artifacts/contracts/TheSourceArticle.sol/TheSourceArticle.json"
import { usePastEvents } from '../../../utils/usePastEvent'
import { BigNumber, ethers } from 'ethers';
import { Card } from '../../atoms/Card/Card';

interface Props {

}
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

export const Home: FC<Props> = () => {
    const contracts = useRecoilValue(ContractsState)
    const [articles, setArticles] = useState<Article[] | []>([])
    const provider = useProvider()
    const { address } = useAccount()

    const marketPlaceContract = useContract({
        address: contracts.marketPlace,
        abi: TheSourceMarketPlace.abi,
        signerOrProvider: provider
    })
    const articleContract = useContract({
        address: contracts.article,
        abi: TheSourceArticle.abi,
        signerOrProvider: provider
    })

    const events = usePastEvents(marketPlaceContract, 'createArticle', address, ['author', 'memberTokenId', 'articleId'])
    useEffect(() => {
        if (articleContract && events) {
            (async () => {
                try {
                    const articleIds = events.map(event => event.articleId.toNumber())
                    const [articles, uris] = await Promise.all([
                        Promise.all(articleIds.map(async (id) => await articleContract.getArticle(id))),
                        Promise.all(articleIds.map(async (id) => await articleContract.uri(id)))
                            .then(uris =>
                                Promise.all(uris.map(async (uri) =>
                                    await fetch(uri)
                                        .then(res => res.json())
                                )))
                    ])
                    const final = articles
                        .map((article, index) => { return { ...article, id : index+1, cover: uris[index].image, article: `${uris[index].attributes[5].value}/${uris[index].attributes[3].value}` } })
                        .filter(article => article.supply > 0)
                        .reverse()
                        .slice(0,4)
                    setArticles(final)
                }catch(err){
                    console.log(err)
                }
            })()
        }
    }, [articleContract, events])

    console.log(articles)
    return (
        <div className={styles.listing}>
            {articles.length > 0 && articles.map((article, index) => <Card key={index} article={article}/>)}
        </div>
    )
}
