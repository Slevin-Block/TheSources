import React from 'react'
import { useRecoilValue } from 'recoil'
import { UserState } from '../../../store/UserState'
import { minifyStr } from '../../../utils/minifyStr'
import styles from './Header.module.css'
import Connection from '../../atoms/Connection/Connection'

export default function Header() {
    const user = useRecoilValue(UserState)
    return (
        <div className={styles.full}>
            <div className={styles.logos}>
                <img src='/img/TheSourceMap - lite.png' alt='TheSourceMap' className={styles.map} />
                <img src='/img/TheSourceLogo.png' alt='TheSourceLogo' className={styles.logo} />
                <p className={styles.textLogo}>the</p><p className={styles.textLogoSup}>ourse</p>
            </div>
            {user.isConnected ?
                <div className={styles.addr}>
                    <p>add</p>
                    <p>{user.address ? minifyStr(user.address) : ''}</p>
                </div>
                :
                <p> Déconnecté </p>
            }
            <div className={styles.control} >
                <Connection />
            </div>
        </div>
    )
}
