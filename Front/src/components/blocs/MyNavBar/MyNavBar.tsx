import React from 'react'
import { MyLink } from '../../atoms/MyLink/MyLink'
import styles from './MyNavBar.module.css'

export default function NabBar() {
  return (
    <div className={`navbar ${styles.container}`}>
        <MyLink field='home'>       Home            </MyLink>
        <MyLink field='token'>      Begin Member</MyLink>
        <MyLink field='article'>    Mint Article </MyLink>
        {/* <MyLink field='list'>       My Articles     </MyLink> */}
        <MyLink field='buy'>       Buy Article </MyLink>
    </div>
  )
}
