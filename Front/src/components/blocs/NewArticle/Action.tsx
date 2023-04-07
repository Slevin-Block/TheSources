import React, { FC, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ContractsState } from '../../../store/ContractsState';
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import { BigNumber, ethers } from 'ethers';
import styles from './NewArticle.module.css'
import { RoutingState } from '../../../store/RoutingState';

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

interface Props {
    article: Article;
    setAction : React.Dispatch<React.SetStateAction<boolean>>;
    value: string;
}


export const Action: FC<Props> = ({ article, setAction, value}) => {
    const [once, setOnce] = useState(false)
    const contracts = useRecoilValue(ContractsState)
    const [, setRouting] = useRecoilState(RoutingState)

    const { address } = useAccount()
    const { config } = usePrepareContractWrite({
        address: contracts.marketPlace,
        abi: theSourceMarketPlace.abi,
        functionName: 'mintArticle',
        args : [article.memberTokenId, article.title, article.description, article.authorName, article.supply, article.price, article.URI],
        overrides: {
            from: address,
            value: ethers.utils.parseEther(value),
        },
    })
    const { write: mintArticle, isError, isLoading, isSuccess} = useContractWrite(config)


    useEffect(() => {
        if (mintArticle && !once){
            setOnce(true)
            mintArticle()
        }
    }, [mintArticle])

    useEffect(()=>{
        if (isSuccess){
            setAction(false)
            clearTimeout(article.timeoutBreaker)
            setRouting('home')
        }
    }, [isSuccess])

    return (
        <div className={`spinner ${styles.spinnerAction}`}></div>
    )
}
