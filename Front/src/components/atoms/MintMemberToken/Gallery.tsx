import React, { useEffect, useState } from 'react'
import { usePastEvents } from '../../../utils/usePastEvent'
import { useRecoilValue } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'
import TheSourceMemberToken from "../../../artifacts/contracts/TheSourceMemberToken/TheSourceMemberToken.json"
import { useAccount, useContract, useContractEvent, useProvider } from 'wagmi'
import { BigNumber } from 'ethers'
import { ViewToken } from './ViewToken'

export const Gallery = () => {
    const [myTokenIds, setMyTokenIds] = useState<number[]>([])
    const {address} = useAccount()
    const contracts = useRecoilValue(ContractsState)
    const provider = useProvider()
    const memberTokenContract = useContract({
        address :contracts.memberToken,
        abi : TheSourceMemberToken.abi,
        signerOrProvider : provider,
    })


    useContractEvent({
    address :contracts.memberToken,
        abi : TheSourceMemberToken.abi,
    eventName: 'Transfer',
    listener(from, to, tokenId) {
      if(to === address && tokenId && BigNumber.isBigNumber(tokenId)){
        setMyTokenIds([...myTokenIds, tokenId.toNumber()])
      }
    },
  })

    const events = usePastEvents(memberTokenContract, "Transfer", ['from', 'to', 'tokenId'])

    useEffect(()=>{
        if (events.length > 0){
            const values = events.flatMap(event => event.to === address ? event.tokenId.toNumber() : [])
            setMyTokenIds(values)
        }
    }, [events])

    console.log(myTokenIds)
    return (
        <div>
                {myTokenIds.map((tokenId, key) => <ViewToken key={key} tokenId={tokenId}/>)}
        </div>
    )
}

