import React from 'react'
import styles from 'Header.module.css'
import { useRecoilState, useRecoilValue } from 'recoil'
import { User } from '../../store/User'
import { minifyStr } from '../../utils/minifyAddr'

import { Registration } from '../../configuration/Registration'
import Connection from '../../configuration/Connection'

export default function Header({switchTheme, theme} : {switchTheme : ()=> void, theme : string}) {
    const user = useRecoilValue(User)
    return (
        <div className='flex flex-row bg-base-100 w-screen h-1/6'>
            <button className="btn btn-primary" onClick={switchTheme} >{theme}</button>
            <div>
                address : {user.address ? minifyStr(user.address) : ''}
            </div>
            {user.isConnected ? 'Connecté' : 'Déconnecté'}
            <div>
                <Connection />
                <Registration />
            </div>
        </div>
    )
}
