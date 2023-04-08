import React, { FC, useEffect, useState } from 'react'
import { usePastEvents } from '../../../utils/usePastEvent'
import { useRecoilValue } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'
import TheSourceMemberToken from "../../../artifacts/contracts/TheSourceMemberToken.sol/TheSourceMemberToken.json"
import { useAccount, useContract, useContractEvent, useProvider } from 'wagmi'
import { BigNumber } from 'ethers'
import { ViewToken } from './ViewToken'
import styles from './MintMemberToken.module.css'

interface Props {
   
}

export const Gallery : FC<Props>= () => {

    const [myStock, setMyStock] = useState<number>(0)
    const [myTokenIds, setMyTokenIds] = useState<number[]>([])
    const { address } = useAccount()
    const contracts = useRecoilValue(ContractsState)
    const provider = useProvider()
    const memberTokenContract = useContract({
        address: contracts.memberToken,
        abi: TheSourceMemberToken.abi,
        signerOrProvider: provider,
    })

    // To Rerender
    useEffect(() => {  }, [address])
    useContractEvent({
        address: contracts.memberToken,
        abi: TheSourceMemberToken.abi,
        eventName: 'Transfer',
        listener(from, to, tokenId) {
            if (to === address && tokenId && BigNumber.isBigNumber(tokenId)) {
                setMyTokenIds([...myTokenIds, tokenId.toNumber()])
            }
        },
    })

    const events = usePastEvents(memberTokenContract, "Transfer", address, ['from', 'to', 'tokenId'])

    useEffect(() => {
        if (events.length > 0) {
            const values = events.flatMap(event => event.to === address ? event.tokenId.toNumber() : [])
            setMyTokenIds(values)
        }
    }, [events])

    return (
        <div className={styles.gallery}>
            {myTokenIds.map((tokenId, key) => 
                <div key={key} className={styles.boxImg}><ViewToken  tokenId={tokenId} /></div>
            )}
        </div>
    )
}

