import React from 'react'
import { useRecoilValue } from 'recoil'
import { UserState } from '../../../store/UserState'
import { minifyStr } from '../../../utils/minifyStr'
import styles from './Header.module.css'
import Connection from '../../atoms/Connection/Connection'
import { useAccount, useNetwork, useBalance } from 'wagmi'
import Image from 'next/image'

export default function Header() {
    const { isConnected, address } = useAccount()
    const {data : balance} = useBalance({ address, watch: true, });
    const { chain } = useNetwork()
    return (
        <div className={styles.full}>
            <div className={styles.logos}>
                <img src='/img/TheSourceMap - lite.png' alt='TheSourceMap' className={styles.map} />
                <img src='/img/TheSourceLogo.png' alt='TheSourceLogo' className={styles.logo} />
                <p className={styles.textLogo}>the</p><p className={styles.textLogoSup}>ource</p>
            </div>
            <div className={styles.infos} >
                {isConnected ?
                    <>
                        <div className={styles.addr}>
                            <p> addr </p>
                            <p>{address ? minifyStr(address) : ''}</p>
                        </div>
                        <div className={styles.addr}>
                            <p>{chain?.name ? chain?.name : ''}</p>
                        </div>
                        <div className={styles.addr}>
                            <p>{balance ? `${balance?.formatted.slice(0,10)}... ${balance.symbol}` : ''}</p>
                        </div>
                    
                    </>
                    :
                    <p> Déconnecté </p>
                }
            </div>
            <div className={styles.control} >
                <Connection />
            </div>
        </div>
    )
}
