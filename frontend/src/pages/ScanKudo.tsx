import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import CreateKudoBar from '../components/CreateKudoBar/CreateKudoBar'
import dynamic from "next/dynamic";
import { Tabs } from '../components/CreateKudoBar/CreateKudoBar';
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
            <Navbar />
            <h1>Scan Kudo</h1>
            <CreateKudoBar tab={Tabs.Scan} />
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
