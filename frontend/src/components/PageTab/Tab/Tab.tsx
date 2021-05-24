import Link from 'next/link'
import { MouseEvent } from 'react';
import { Tabs } from '../PageTab';

import classes from './Tab.module.scss';

interface Props {
    text: string;
    isSelected: boolean;
    isRouting: boolean;
    onClick?: () => void;
}

const Tab = ({ text, isSelected, isRouting, onClick }: Props) => {
    const routingTab = () => {
        return (
            <Link href="/ScanKudo">
                <a className={`${classes.tab} ${isSelected ? classes.border : ''}`}>{text}</a>
            </Link>
        )
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
        if(onClick) onClick();
    }

    const pageTab = () => {
        return (
            <div className={`${classes.tab} ${isSelected ? classes.border : ''}`} onClick={handleClick}>
                {text}
            </div>
        )
    }

    return isRouting ? routingTab() : pageTab();
}

export default Tab;