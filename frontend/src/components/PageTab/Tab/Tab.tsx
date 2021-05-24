import Link from 'next/link'

import classes from './Tab.module.scss';

interface Props {
    text: string;
    isSelected: boolean;
    isRouting: boolean;
}

const Tab = ({ text, isSelected, isRouting }: Props) => {
    const routingTab = () => {
        return (
            <Link href="/ScanKudo">
                <a className={`${classes.tab} ${isSelected ? classes.border : ''}`}>{text}</a>
            </Link>
        )
    }

    const pageTab = () => {
        return (
            <div className={`${classes.tab} ${isSelected ? classes.border : ''}`}>
                {text}
            </div>
        )
    }

    return isRouting ? routingTab() : pageTab();
}

export default Tab;