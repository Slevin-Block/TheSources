import React, { useEffect, useState } from 'react'
import { useAccount, useContract, useContractRead, useProvider } from 'wagmi'
import TheSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import TheSourceArticle from "../../../artifacts/contracts/TheSourceArticle.sol/TheSourceArticle.json"
import { usePastEvents } from '../../../utils/usePastEvent'
import { useRecoilValue } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'
import { BigNumber, ethers } from 'ethers'


type BookList = [] | {
    title : string;
    description : string;
    author : string;
    authorAddr : `0x${string}`;
    qty : number;
    price : number | string;
}[];



export const Home = () => {
    const contracts = useRecoilValue(ContractsState)
    const [articles, setArticles] = useState<BookList>([])
    const provider = useProvider()
    const {address} = useAccount()

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
                let final
                const articleIds = events.map(event => event.articleId.toNumber())
                const res = articleIds.map(async (id) => await articleContract.getArticle(id))
                Promise.all(res).then(articles => {
                    const final = articles.map(article => {return {
                        title : article.title,
                        description : article.description,
                        author : article.authorName,
                        authorAddr : article.authorAddress,
                        qty : article.supply.toNumber(),
                        price : ethers.utils.formatEther(BigNumber.from(article.price)),
                    }})
                    setArticles(final)
                }).catch(error => {
                    console.error(error);
                });
            })()

        }
    }, [articleContract, events])

    return (
        <div>
            {articles.length > 0 &&
                <ul>
                    {articles.slice(-3).reverse().map((article, key) => <li key={key}>{`${article.title} ${article.author} ${article.price}`}</li>)}
                </ul>
            
            }
        
        </div>
    )
}
