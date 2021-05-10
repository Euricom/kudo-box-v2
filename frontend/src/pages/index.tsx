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

                <MsalAuthenticationTemplate
                    interactionType={InteractionType.Redirect}
                    authenticationRequest={loginRequest}
                    loadingComponent={() => <div>Loading</div>}
                    errorComponent={() => <div>Error</div>}

                >
                    <h1>Home</h1>
                    <button onClick={login}>Log In</button>
                </MsalAuthenticationTemplate>
        </div>
    );
}