import React, { FC } from 'react'
import styles from './Card.module.css'




interface Props {
    article : Article;
}

export const Card : FC<Props> = () => {
  return (
    <div>Card</div>
  )
}
