import React, { FC, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'
import { useAccount, useContract, useContractWrite, useNetwork, usePrepareContractWrite, useProvider } from 'wagmi';
import TheSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import { BigNumber, ethers } from 'ethers';
import styles from './Card.module.css'
import { RoutingState } from '../../../store/RoutingState';
import { Buy } from '../svgs';

interface Props {
    tokenId: number;
    unitPrice: string;
    setAction: React.Dispatch<React.SetStateAction<boolean>>;
}


export const Action: FC<Props> = ({ tokenId, unitPrice, setAction }) => {

    const [, setRouting] = useRecoilState(RoutingState)
    const contracts = useRecoilValue(ContractsState)
    const [ready, setReady] = useState(false)
    const { address } = useAccount()
    const {chain} = useNetwork()
    

    /* const { config } = usePrepareContractWrite({
        address: contracts.marketPlace,
        abi: TheSourceMarketPlace.abi,
        functionName: 'buyArticle',
        args : [tokenId, 1],
        chainId : chain?.id,
        overrides: {
            from: address,
            value: ethers.utils.parseEther(unitPrice),
        },
    }) */

    const { write: buyArticle, isError } = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: contracts.marketPlace,
        abi: TheSourceMarketPlace.abi,
        functionName: 'buyArticle',
        args : [tokenId, 1],
        chainId : chain?.id,
        overrides: {
            from: address,
            value: ethers.utils.parseEther(unitPrice),
        },
    
    })

    useEffect(() => {
        if (!!buyArticle) {
            console.log(buyArticle)
            setReady(true)
        }
    }, [buyArticle])


    // On success
    /*useEffect(() => {
        if (isSuccess) {
            setAction(false)
            setRouting('list')
        }
    }, [isSuccess])

    // On error
    useEffect(() => { if (isError) setAction(false) }, [isError])
 */


    return ( 
        <div className={styles.actionContainer}>
            <button className={styles.buy} onClick={() => buyArticle()}><Buy /></button>
            {/* <div className={`spinner ${styles.spinnerAction}`}></div> */}
        </div>
    )
}
