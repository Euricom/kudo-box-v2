import React, { useEffect, useState } from 'react';
import Drawer from '../components/Drawer/Drawer'
import PageTab from '../components/PageTab/PageTab'
import dynamic from "next/dynamic";
import { Tabs } from '../components/PageTab/PageTab';
import classes from '../styles/ScanKudo.module.scss';

// const QrReader = dynamic(() => import('react-weblineindia-qrcode-scanner').then((a) => a.QrReader), { ssr: false });

export default function ScanKudo() {

    const [state, setState] = useState("no result");

    // const handleScan = (data) => {
    //     if (data) {
    //         setState(data)
    //     }
    // }
    // const handleError = (err) => {
    //     console.error(err)
    // }

    // const previewStyle = {
    //     height: 240,
    //     width: 320,
    // }
    return (
        <div>
            <Drawer />
            <h1>Scan Kudo</h1>
            <PageTab
                isRouting={true}
                firstTab={{ text: 'Scan', href: '/ScanKudo' }}
                secondTab={{ text: 'Create', href: '/ChooseTheme' }}
                selectedTab={Tabs.SECOND}
            />
            {/* <QrReader
                // delay={}
                // style={previewStyle}
                onError={handleError}
                onScan={handleScan}
            />
            <p>{state}</p> */}
        </div>
    )
}
