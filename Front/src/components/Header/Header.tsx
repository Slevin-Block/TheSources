import React from 'react'
import styles from 'Header.module.css'
import { useRecoilState, useRecoilValue } from 'recoil'
import { UserState } from '../../store/UserState'
import { minifyStr } from '../../utils/minifyAddr'

import Connection from '../Connection'

export default function Header({switchTheme, theme} : {switchTheme : ()=> void, theme : string}) {
    const user = useRecoilValue(UserState)
    return (
        <div className='flex flex-row bg-base-100 w-screen h-1/6 gap-28'>
            <button className="btn btn-primary" onClick={switchTheme} >{theme}</button>
            <div>
                address : {user.address ? minifyStr(user.address) : ''}
            </div>
            {/* {user.isConnected ? 'Connecté' : 'Déconnecté'} */}
            <div>
                <Connection />
            </div>
        </div>
    )
}
