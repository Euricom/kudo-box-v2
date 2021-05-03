import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import CreateKudoBar from '../components/CreateKudoBar'
import dynamic from "next/dynamic";
import classes from '../styles/ScanKudo.module.scss';

const QrReader = dynamic(() => import('react-weblineindia-qrcode-scanner').then((a) => a.QrReader), { ssr: false });

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
            <CreateKudoBar tab={1} />
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
