import Link from 'next/link'
import { MouseEvent } from 'react';
import { Tabs } from '../PageTab';

import classes from './Tab.module.scss';

export interface TabObj {
    text: string;
    href?: string;
}

interface Props {
    tab: TabObj;
    isSelected: boolean;
    isRouting: boolean;
    onClick?: () => void;
}

const Tab = ({ tab, isSelected, isRouting, onClick }: Props) => {
    const routingTab = () => {
        if(!tab.href) return null;
        return (
            // <Link href={"/ScanKudo"}>
            <Link href={tab.href}>
                <a className={`${classes.tab} ${isSelected ? classes.border : ''}`}>{tab.text}</a>
            </Link>
        )
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
        if(onClick) onClick();
    }

    const pageTab = () => {
        return (
            <div className={`${classes.tab} ${isSelected ? classes.border : ''}`} onClick={handleClick}>
                {tab.text}
            </div>
        )
    }

    return isRouting ? routingTab() : pageTab();
}

export default Tab;