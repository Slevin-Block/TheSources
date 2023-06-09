import { BigNumber, ethers } from 'ethers'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import styles from './MemberTokenPrice.module.css'
import { useRecoilState } from 'recoil'
import { ContractsState } from '../../../store/ContractsState'

export default function MemberTokenPrice() {
    /* const [value, setValue] = useState(0)
    const debouncedMemberTokenPrice = useDebounce(value, 500)
    const [isUpdating, setIsUpdating] = useState(false)
    const { address } = useAccount()
    const { data: balance } = useBalance({ address });
    const contracts = useRecoilState(ContractsState)

    const { data: currentMemberTokenPrice } = useContractRead({
        address: contracts.marketPlace, abi: theSourceMarketPlace.abi,
        functionName: 'getMemberTokenPrice',
        watch: true,
    })
    const { data: ownerAddr } = useContractRead({
        address: contracts.marketPlace, abi: theSourceMarketPlace.abi,
        functionName: 'owner',
        watch: true,
    })
    const isOwner = ownerAddr === address && !!address && !!ownerAddr

    const { config: configMemberTokenPrice } = usePrepareContractWrite({
        address: contracts.marketPlace,
        abi: theSourceMarketPlace.abi,
        functionName: 'setMemberTokenPrice',
        args: [ethers.utils.parseEther((value / 1000).toString())],
        enabled: Boolean(debouncedMemberTokenPrice)
    })
    const { write, data } = useContractWrite(configMemberTokenPrice)
    const { isLoading } = useWaitForTransaction({ hash: data?.hash })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        !!parseInt(e.target.value) && setValue(parseInt(e.target.value))
        e.target.value === '' && setValue(0)
    }

    useEffect(() => { isLoading && setIsUpdating(true) }, [isLoading])
    useEffect(() => {
        isUpdating && setIsUpdating(false) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ,[currentMemberTokenPrice])

 */

    return (
        <div>
            Coucou
        </div>
    )
}
        /* <form
    className="block"
    onSubmit={(e) => {
        e.preventDefault()
        write?.()
    }}
>
    {!isOwner && <div className='overlay'></div>}
    <h2>memberTokenPrice</h2>
    <div className={styles.valueBox}>
        <p>{!!currentMemberTokenPrice && `${ethers.utils.formatEther(BigNumber.from(currentMemberTokenPrice))}${balance?.symbol}`}</p>
        <div className={styles.container} >{isUpdating && <div className='spinner '></div>}</div>
    </div>
    <label> Member token price in Finney (1000 finney = 1 eth) </label>

    <input id="memberTokenPrice" value={value} type="text" placeholder='value' onChange={handleChange} />
    <button disabled={!write || isLoading}
        className={`${isLoading ? "loader" : ""}`}
    >
        Send
    </button>
</form> */
