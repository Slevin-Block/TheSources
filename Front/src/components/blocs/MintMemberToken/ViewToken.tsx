import { FC, useEffect, useState } from 'react'
import TheSourceMemberToken from "../../../artifacts/contracts/TheSourceMemberToken.sol/TheSourceMemberToken.json"
import { useContractRead } from 'wagmi';
import { useRecoilValue } from 'recoil';
import { ContractsState } from '../../../store/ContractsState';

interface Props {
    tokenId: number;
}
export const ViewToken: FC<Props> = ({tokenId}) => {

    const [src, setSrc] = useState<string>("")
    const contracts = useRecoilValue(ContractsState)

// READ THE CURRENT PRICE OF MEMBER TOKEN
    const { data: URI } = useContractRead({
        address: contracts.memberToken, abi: TheSourceMemberToken.abi,
        functionName: 'tokenURI',
        args: [tokenId],
        watch: true,
    })
    useEffect(() =>{
        if (URI){
            (async () => {
                try{
                    const res = await fetch(URI.toString())
                    const data = await res.json()
                    if (data?.image){
                        setSrc(data.image)
                    }else{
                        console.log("Wrong json, miss image")
                    }
                }catch(err){
                    console.log(err)
                }
            })()
        }
    }, [URI])

    return (
        <>
            {src.length > 0 ?
                <img src={src}/>
            :
                <div className='blockSpinner'>
                    <div className='spinner '></div>
                </div>
            }
            
        </>
    )
}
