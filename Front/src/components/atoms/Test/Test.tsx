import React from 'react'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace/TheSourceMarketPlace.json"

export default function Test() {
    /* 0x0165878A594ca255338adfa4d48449f69242Eb8F */
    const { data: balanceOf } = useContractRead({
        address: '0x0165878A594ca255338adfa4d48449f69242Eb8F', abi: theSourceMarketPlace.abi,
        functionName: 'balanceOf(address)',
        args: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'],
        watch: true,
    })

    const { data: NumberofMemberToken } = useContractRead({
        address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', abi: theSourceMarketPlace.abi,
        functionName: 'balanceOfMemberToken()',
        args: [],
        watch: true,
    })

    console.log('Balance du Journaliste via balanceOf',balanceOf)
    console.log('Balance du user en cours balanceOfMemberToken', NumberofMemberToken)
  return (
    <div>test</div>
  )
}
