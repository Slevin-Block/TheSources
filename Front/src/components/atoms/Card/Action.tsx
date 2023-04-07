import React, { FC, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'
import { useAccount, useContract, useContractWrite, usePrepareContractWrite, useProvider } from 'wagmi';
import TheSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import { ethers } from 'ethers';
import styles from './Card.module.css'
import { RoutingState } from '../../../store/RoutingState';

interface Props {
    tokenId: number;
    unitPrice: string;
    setAction: React.Dispatch<React.SetStateAction<boolean>>;
}


export const Action: FC<Props> = ({ tokenId, unitPrice, setAction }) => {

    const [, setRouting] = useRecoilState(RoutingState)
    const contracts = useRecoilValue(ContractsState)
    const [once, setOnce] = useState(false)
    const { address } = useAccount()
    
    const { config } = usePrepareContractWrite({
        address: contracts.marketPlace,
        abi: TheSourceMarketPlace.abi,
        functionName: 'buyArticle',
        args : [tokenId, 1],
        overrides: {
            from: address,
            value: ethers.utils.parseEther(unitPrice),
        },
    })
    const { write: buyArticle, isError, isLoading, isSuccess} = useContractWrite(config)

    useEffect(() => {
        if (!!buyArticle && !once) {
            console.log (buyArticle)
            setOnce(true)
            try{
                buyArticle()
            }catch(err){
                console.log(err)
                setAction(false)
            }
        }
    }, [buyArticle])


    // On success
    useEffect(() => {
        if (isSuccess) {
            setAction(false)
            setRouting('list')
        }
    }, [isSuccess])

    // On error
    useEffect(() => { if (isError) setAction(false) }, [isError])



    return (
        <div className={`spinner ${styles.spinnerAction}`}></div>
    )
}
