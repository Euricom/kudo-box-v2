import { InteractionStatus, InteractionType, RedirectRequest } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { Divider } from '@material-ui/core';
import React from 'react';
import { loginRequest } from '../auth/MsalConfig';
import Navbar from '../components/Navbar/Navbar'

export default function Home() {
    const { instance } = useMsal();

    const login = () => {
        instance.loginRedirect(loginRequest);
    }

    return (
        <div>
            <Navbar />
                
                    <h1>Home</h1>
                
        </div>
    );
}