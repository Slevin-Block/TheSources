import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useAccount, useBalance, useContract, useContractEvent, useContractRead } from 'wagmi'
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import styles from './MintMemberToken.module.css'
import { ContractsState } from '../../../store/ContractsState'
import { useRecoilValue } from 'recoil'
import { Action } from './Action'
import { ViewToken } from './ViewToken'
import { Gallery } from './Gallery'


export default function MintMemberToken() {
    const [numberOfTokens, setNumberOfTokens] = useState<number>(0)
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

    // READ THE NUMBER TOKEN OF CURRENT USER
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

    useEffect(()=>{
        isUpdating && setNewTokenId(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUpdating])
    

    // UPDATE DATA
    useEffect(() => {
        !!currentMemberTokenPrice && setPrice(ethers.utils.formatEther(BigNumber.from(currentMemberTokenPrice)))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMemberTokenPrice])

    useEffect(() => {
        if (numberOfMemberToken){
            const value = parseInt(BigNumber.from(numberOfMemberToken).toString())
            setNumberOfTokens(value)
        }
        if(isUpdating) {
            setIsUpdating(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfMemberToken])

    console.log(numberOfTokens)

    return (
        <>
            <div className={`block ${styles.block}`} >
                <div className={`${styles.subBlock}`} >
                    <h2>Mint Member Token</h2>
                    <div className={styles.valueBox}>
                        <div>
                            <p>{`Yours : ${numberOfTokens}`}</p>
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
            {numberOfTokens>0 &&
                <div className={`block ${styles.block}`} >
                    <Gallery />
                </div>
            }
        </>
    )
}