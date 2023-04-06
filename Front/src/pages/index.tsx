import Editor from '../components/_archives/Editor'
import Header from '../components/blocs/Header/Header'
import MyNavBar from '../components/blocs/MyNavBar/MyNavBar'
import MemberTokenPrice from '../components/atoms/MemberTokenPrice/MemberTokenPrice'
import MintMemberToken from '../components/atoms/MintMemberToken/MintMemberToken'
import NFTPurchases from '../components/atoms/NFTPurchases/NFTPurchases'
import { useRecoilValue, useRecoilState } from 'recoil'
import { RegisterState } from '../store/RegisterState'
import { useEffect } from 'react'
import { RoutingState } from '../store/RoutingState'
import { Home } from '../components/blocs/Home/Home'
import { ContractsState } from '../store/ContractsState'
import { BlockchainLink } from '../components/atoms/BlockchainLink/BlockchainLink'
import NewArticle from '../components/blocs/NewArticle/NewArticle'


function Page() {
    const [routing, setRouting] = useRecoilState(RoutingState)
    const [contracts, setContracts] = useRecoilState(ContractsState)
    const isRegistred = useRecoilValue(RegisterState)
    const mainContractIsLoaded = contracts.marketPlace !== '0x'
    /* Routing */
    useEffect(()=>{ (!isRegistred || !contracts.ready) && setRouting('home') }, [isRegistred, contracts.ready])

    /* Load memberTokenContract */
    useEffect(()=>{
        (async () => {
            const response = await fetch('/api/marketplace', { method: "GET"})
            const data = await response.json()
            setContracts({...contracts, marketPlace : data.address})
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
                        {/*
                        <MemberTokenPrice />
                        <NFTPurchases />
                        */}
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
