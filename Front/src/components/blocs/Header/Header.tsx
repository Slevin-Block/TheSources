import React from 'react'
import styles from 'Header.module.css'
import { useRecoilValue } from 'recoil'
import { UserState } from '../../../store/UserState'
import { minifyStr } from '../../../utils/minifyStr'

import Connection from '../../atoms/Connection/Connection'

export default function Header() {
    const user = useRecoilValue(UserState)
    return (
        <>
            <div>
                address : {user.address ? minifyStr(user.address) : ''}
            </div>
            {user.isConnected ? 'Connecté' : 'Déconnecté'}
            <div>
                <Connection />
            </div>
        </>
    )
}
