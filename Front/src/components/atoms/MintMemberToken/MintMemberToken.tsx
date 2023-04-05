import { BigNumber, ethers } from 'ethers'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import styles from './MintMemberToken.module.css'
import {marketplace} from "../../../pages/_app"


export default function MintMemberToken() {
    const [value, setValue] = useState(0)
    const debouncedNumberMemberToken = useDebounce(value, 500)
    const [isUpdating, setIsUpdating] = useState(false)

    const { data: numberOfMemberToken } = useContractRead({
        address: marketplace, abi: theSourceMarketPlace.abi,
        functionName: 'balanceOfMemberToken',
        watch: true,
    })
    console.log(numberOfMemberToken)

    /* const { config: configBuyMemberToken } = usePrepareContractWrite({
        address: marketplace,
        abi: theSourceMarketPlace.abi,
        functionName: 'buyMemberToken',
        args: [],
        //enabled: Boolean(debouncedNumberMemberToken)
    }) */
    /* const { write, data } = useContractWrite(configBuyMemberToken) */
    /* const { isLoading } = useWaitForTransaction({ hash: data?.hash }) */

    /* useEffect(()=>{ isLoading && setIsUpdating(true) }, [isLoading]) */
    useEffect(()=>{
        !!numberOfMemberToken && setValue(parseInt(BigNumber.from(numberOfMemberToken).toString()))
        isUpdating && setIsUpdating(false)
    }, [numberOfMemberToken])


const write = true
const isLoading = false
  return (
    <form
        className="block"
        /* onSubmit={(e) => {
            e.preventDefault()
            write?.()
        }} */
    >
        <h2>mintMemberToken</h2>
        <div className={styles.valueBox}>
            <p>{!!numberOfMemberToken && parseInt(BigNumber.from(numberOfMemberToken).toString())}</p>
            <div className={styles.container} >{isUpdating && <div className='spinner '></div> }</div>
        </div>
        <button disabled={!write || isLoading}
                className={`${isLoading ? "loader" : ""}`}
        >
            Mint
        </button>
    </form>
  )
}