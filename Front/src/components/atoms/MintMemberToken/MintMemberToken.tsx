import { BigNumber, ethers } from 'ethers'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import styles from './MintMemberToken.module.css'
import { ContractsState } from '../../../store/ContractsState'
import { useRecoilValue } from 'recoil'


export default function MintMemberToken() {
    const [value, setValue] = useState(0)
    const debouncedNumberMemberToken = useDebounce(value, 500)
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
    const { config: configBuyMemberToken } = usePrepareContractWrite({
        address: contracts.marketPlace,
        abi: theSourceMarketPlace.abi,
        functionName: 'buyMemberToken',
        args: [],
        overrides: {
            from: address,
            value: BigNumber.from(currentMemberTokenPrice)
        },
        enabled: Boolean(debouncedNumberMemberToken)
    })
    
    // TRANSACTION FUNCTION
    const { write, data } = useContractWrite(configBuyMemberToken)
    const { isLoading } = useWaitForTransaction({ hash: data?.hash })

    // UPDATE DATA
    useEffect(() => { isLoading && setIsUpdating(true) },[isLoading])
    useEffect(() => {
        !!numberOfMemberToken && setValue(parseInt(BigNumber.from(numberOfMemberToken).toString()))
        isUpdating && setIsUpdating(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfMemberToken])


    return (
        <form
            className="block"
            onSubmit={(e) => {
                e.preventDefault()
                write?.()
            }}
        >
            <h2>mintMemberToken</h2>
            <div className={styles.valueBox}>
                <div>
                    <p>{!!numberOfMemberToken && parseInt(BigNumber.from(numberOfMemberToken).toString())}</p>
                    <div className={styles.container} >{isUpdating && <div className='spinner '></div>}</div>
                </div>
                <p>{!!currentMemberTokenPrice && `${ethers.utils.formatEther(BigNumber.from(currentMemberTokenPrice))}${balance?.symbol}`}</p>
            </div>
            <button disabled={!write || isLoading}
                className={`${isLoading ? "loader" : ""}`}
            >
                Mint
            </button>
        </form>
    )
}