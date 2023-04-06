import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useAccount, useBalance, useContract, useContractEvent, useContractRead } from 'wagmi'
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace/TheSourceMarketPlace.json"
import styles from './MintMemberToken.module.css'
import { ContractsState } from '../../../store/ContractsState'
import { useRecoilValue } from 'recoil'
import { Action } from './Action'
import { ViewToken } from './ViewToken'


export default function MintMemberToken() {
    const [price, setPrice] = useState<undefined | string>('')
    const [newTokenId, setNewTokenId] = useState<number>(0)
    const [isUpdating, setIsUpdating] = useState(false)
    const { address } = useAccount()
    const { data: balance } = useBalance({ address });
    const contracts = useRecoilValue(ContractsState)

    // READ THE CURRENT PRICE OF MEMBER TOKEN
    const { data: currentMemberTokenPrice } = useContractRead({
        address: contracts.marketPlace, abi: theSourceMarketPlace.abi,
        functionName: 'getMemberTokenPrice',
        watch: true,
    })

    // READ THE NUMBER OF CURRENT USER
    const { data: numberOfMemberToken } = useContractRead({
        address: contracts.marketPlace, abi: theSourceMarketPlace.abi,
        functionName: 'balanceOfMemberToken',
        watch: true,
        overrides: {
            from: address
        },
    })

    // PREPARE TRANSACTION TO MINT A NEW TOKEN MEMBER
    const marketPlaceContract = useContract({
        address: contracts.marketPlace,
        abi: theSourceMarketPlace.abi
    })

    useContractEvent({
        address: contracts.marketPlace,
        abi: theSourceMarketPlace.abi,
        eventName: 'newMemberToken',
        listener(tokenId) {
            if (BigNumber.isBigNumber(tokenId)) {
                setNewTokenId(tokenId.toNumber())
            } else {
                console.error("Wrong typeof tokenId, expected BigNumber")
            }
        },
    })

    useEffect(()=>{ isUpdating && setNewTokenId(0) }, [isUpdating])
    

    // UPDATE DATA
    useEffect(() => {
        !!numberOfMemberToken && setPrice(ethers.utils.formatEther(BigNumber.from(currentMemberTokenPrice)))
        isUpdating && setIsUpdating(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfMemberToken])

    return (
        <>
            <div className={`block ${styles.block}`} >
                <div className={`${styles.subBlock}`} >
                    <h2>mintMemberToken</h2>
                    <div className={styles.valueBox}>
                        <div>
                            <p>{!!numberOfMemberToken && `Yours : ${parseInt(BigNumber.from(numberOfMemberToken).toString())}`}</p>
                            <div className={styles.container} >{isUpdating && <div className='spinner '></div>}</div>
                        </div>
                        <p>{!!price && `${price}${balance?.symbol}`}</p>
                    </div>
                    {price && <Action
                        value={price}
                        disabled={!marketPlaceContract || !address || isUpdating}
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                    />}
                </div>
                <div className={`${styles.subBlock}`} >
                    {newTokenId !== 0 && <ViewToken tokenId={newTokenId} />}
                </div>
            </div>
            <div className={`block ${styles.block}`} >
                
            </div>
        </>
    )
}