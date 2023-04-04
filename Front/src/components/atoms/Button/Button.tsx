import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  className?: string
}

const Button = ({ children, className: externalClass, ...props }: ButtonProps) => {
  return (
    <button {...props} className={`${styles.button} ${externalClass}`}>
      {children}
    </button>
  )
}

export default Button
