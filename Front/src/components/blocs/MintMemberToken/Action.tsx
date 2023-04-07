import React, { FC, useEffect } from 'react'
import { useRecoilValue } from 'recoil';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ContractsState } from '../../../store/ContractsState';
import theSourceMarketPlace from "../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json"
import { ethers } from 'ethers';
interface Props {
    value: string;
    disabled: boolean;
    isUpdating: boolean;
    setIsUpdating : React.Dispatch<React.SetStateAction<boolean>>;
}


export const Action: FC<Props> = ({ value, disabled, isUpdating, setIsUpdating}) => {
    const contracts = useRecoilValue(ContractsState)

    const { address } = useAccount()
    const { config } = usePrepareContractWrite({
        address: contracts.marketPlace,
        abi: theSourceMarketPlace.abi,
        functionName: 'buyMemberToken',
        overrides: {
            from: address,
            value: ethers.utils.parseEther(value),
        },
    })
    const { write: buyMemberToken, isError } = useContractWrite(config)

    const handleClick = () => {
        if (buyMemberToken){
            buyMemberToken()
            setIsUpdating(true)
        }
    }

    useEffect(() => {
        if (isError) setIsUpdating(false)
    }, [isError])

    return (
        <button disabled={disabled}
            onClick={handleClick}
        >
            Mint
        </button>
    )
}
