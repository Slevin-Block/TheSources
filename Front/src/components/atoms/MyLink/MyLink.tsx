import React, { ReactNode } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RoutingState } from '../../../store/RoutingState';
import styles from './MyLink.module.css'

interface MyLinkProps {
    children: ReactNode;
    field?: string;
}

export const MyLink = ({ children, field }: MyLinkProps) => {
    const [, setRouting] = useRecoilState(RoutingState)
    const route = useRecoilValue(RoutingState)
    const handelClick = () => {
        field && setRouting(field)
    }

    const style = `${styles.link} ${route === field ? styles.selected : ''}`



    return (
        <div onClick={handelClick} className={style}>{children}</div>
    );
};