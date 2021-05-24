import React from 'react';

import classes from './PageTab.module.scss';
import Tab from './Tab/Tab';

export enum Tabs {
    FIRST,
    SECOND
}

interface Tab {
    isRouting: boolean;
    firstText: string;
    secondText: string;
    selectedTab: Tabs;
    onTabChange?: (tab: Tabs) => void;
}

export default function PageTab({ isRouting, firstText, secondText, selectedTab, onTabChange }: Tab) {
    const handleClick = (tab: Tabs) => {
        if(onTabChange) onTabChange(tab);
    }

    return (
        <div className={classes.holder}>
            <Tab isRouting={isRouting} text={firstText} isSelected={selectedTab === Tabs.FIRST} onClick={() => handleClick(Tabs.FIRST)} />
            <Tab isRouting={isRouting} text={secondText} isSelected={selectedTab === Tabs.SECOND} onClick={() => handleClick(Tabs.SECOND)} />
        </div >
    );
}

