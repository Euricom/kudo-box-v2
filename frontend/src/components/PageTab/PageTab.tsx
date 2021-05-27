import React from 'react';

import classes from './PageTab.module.scss';
import Tab, { TabObj } from './Tab/Tab';

export enum Tabs {
    FIRST,
    SECOND
}

interface Tab {
    isRouting: boolean;
    firstTab: TabObj;
    secondTab: TabObj;
    selectedTab: Tabs;
    onTabChange?: (tab: Tabs) => void;
}

export default function PageTab({ isRouting, firstTab, secondTab, selectedTab, onTabChange }: Tab) {
    const handleClick = (tab: Tabs) => {
        if(onTabChange) onTabChange(tab);
    }

    return (
        <div className={classes.holder}>
            <Tab isRouting={isRouting} tab={firstTab} isSelected={selectedTab === Tabs.FIRST} onClick={() => handleClick(Tabs.FIRST)} />
            <Tab isRouting={isRouting} tab={secondTab} isSelected={selectedTab === Tabs.SECOND} onClick={() => handleClick(Tabs.SECOND)} />
        </div >
    );
}

