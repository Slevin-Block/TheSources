import React, { useEffect, useState } from 'react'
import { useContract, useContractEvent, useProvider } from 'wagmi'
import { marketplace } from '../../../pages/_app'
import TheSourceMemberToken from "../../../artifacts/contracts/TheSourceMemberToken.sol/TheSourceMemberToken.json"
import { BigNumber, Contract } from 'ethers'
import { usePastEvents } from '../../../utils/usePastEvent'

export default function NFTPurchases() {

    /* useContractEvent({
        address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        abi: TheSourceMemberToken.abi,
        eventName: 'Transfer',
        listener(to, from, tokenId) {
            console.log(to, from, tokenId)
        },
    }) */

    const provider = useProvider()
    const contract = useContract({
        address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        abi: TheSourceMemberToken.abi,
        signerOrProvider: provider
    })
    const events = usePastEvents(contract, 'Transfer')

    return (
        <div>
            {!!events &&
                events.map((event, key) => <li key={key}>{event[1]} {parseInt(BigNumber.from(event[2]).toString())}</li>)
            }
        </div>
    )
}
