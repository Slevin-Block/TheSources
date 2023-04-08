import Editor from '../components/_archives/Editor'
import Header from '../components/blocs/Header/Header'
import MyNavBar from '../components/blocs/MyNavBar/MyNavBar'
import MemberTokenPrice from '../components/atoms/MemberTokenPrice/MemberTokenPrice'
import MintMemberToken from '../components/blocs/MintMemberToken/MintMemberToken'
import NFTPurchases from '../components/atoms/NFTPurchases/NFTPurchases'
import { useRecoilValue, useRecoilState } from 'recoil'
import { RegisterState } from '../store/RegisterState'
import { useEffect } from 'react'
import { RoutingState } from '../store/RoutingState'
import { Home } from '../components/blocs/Home/Home'
import { ContractsState } from '../store/ContractsState'
import { BlockchainLink } from '../components/atoms/BlockchainLink/BlockchainLink'
import NewArticle from '../components/blocs/NewArticle/NewArticle'
import { BuyArticle } from '../components/blocs/BuyArticle/BuyArticle'
import TheSourceMarketPlace from '../artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json'
import { getContract, getProvider } from '@wagmi/core'
import { useProvider } from 'wagmi'

function Page() {
    const [routing, setRouting] = useRecoilState(RoutingState)
    const [contracts, setContracts] = useRecoilState(ContractsState)
    const isRegistred = useRecoilValue(RegisterState)
    const mainContractIsLoaded = contracts.marketPlace !== '0x'
    /* Routing */
    useEffect(()=>{ (!isRegistred || !contracts.ready) && setRouting('home') }, [isRegistred, contracts.ready])

    const provider = useProvider()

    /* Load memberTokenContract */
    useEffect(()=>{
        (async () => {
            const response = await fetch('/api/marketplace', { method: "GET"})
            const data = await response.json()
            /* const contract = getContract({
                address: data.address,
                abi: TheSourceMarketPlace.abi,
                signerOrProvider: provider,
            })
            const filter = contract.filters.deploy()
            console.log("Try to find ...")
            const res = await contract.queryFilter(filter, 0, 'latest')
            console.log("Find : ", res) */
            setContracts({...contracts, marketPlace : data.address, blocknumber : data.blocknumber})
        })()
    },[])

    return (
        <div className='full'>
            <div className='header'>
                <Header />
                {(mainContractIsLoaded && !contracts.ready) && <BlockchainLink/>}
            </div>
            {isRegistred &&
                <MyNavBar></MyNavBar>
            }
            {contracts.ready ?
                <div className='body'>
                    {(routing === 'home' && (<Home />))}
                    {(routing === 'token' && <MintMemberToken /> )}
                    {(routing === 'article' && <NewArticle /> )}
                    {(routing === 'buy' && <BuyArticle /> )}
                </div>

            :
                <div className='body'>
                    Loading ...
                </div>
            
            }
        </div>
    )
}

export default Page
