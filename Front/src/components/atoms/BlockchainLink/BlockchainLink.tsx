import React, { useEffect } from 'react'
import TheSourceMarketPlace from '../../../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json'
import { useRecoilState } from 'recoil';
import { ContractsState } from '../../../store/ContractsState';
import { useContractRead } from 'wagmi';
import styles from './BlockchainLink.module.css'
type ContractType = `0x${string}` | undefined;

interface UseContractReadOptions {
  address: `0x${string}`;
  abi: any[];
  functionName: string;
  watch?: boolean;
}

interface UseContractReadReturn<T> {
  loading?: boolean;
  error?: Error | null;
  data?: T;
}


export const BlockchainLink = () => {
    const [contracts, setContracts] = useRecoilState(ContractsState)

    const { data: memberTokenContract }: UseContractReadReturn<ContractType> = useContractRead({
        address: contracts.marketPlace, abi: TheSourceMarketPlace.abi,
        functionName: 'memberTokenContract',
        watch: true,
    })
    const { data: articleContract }: UseContractReadReturn<ContractType> = useContractRead({
        address: contracts.marketPlace, abi: TheSourceMarketPlace.abi,
        functionName: 'articleContract',
        watch: true,
    })

    useEffect(()=>{
        if (articleContract && memberTokenContract){
            setContracts({...contracts, article : articleContract, memberToken : memberTokenContract, ready : true})
        }else if(articleContract){
            setContracts({...contracts, article : articleContract})
        }else if(memberTokenContract){
            setContracts({...contracts, memberToken : memberTokenContract})
        }
    },[articleContract, memberTokenContract])


    return (
        <div className={styles.container}>
            <div className='spinner '></div>
        </div>
    )
}
