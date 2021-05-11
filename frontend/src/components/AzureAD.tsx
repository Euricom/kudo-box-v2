import { AuthenticationResult, Configuration, EventMessage, EventType, InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef } from "react";
import { CustomNavigationClient } from "../auth/CustomNavigationClient";

const msalConfig = {
    auth: {
        clientId: '520f1246-722b-41f7-8159-e052d24378dd',
        authority: 'https://login.microsoftonline.com/0b53d2c1-bc55-4ab3-a161-927d289257f2',
        postLogoutRedirectUri: '/'
    },
} as Configuration

export const loginRequest = {
    scopes: ['User.Read']
}

interface Props {
    children: ReactNode
}

const AzureAD = ({children}: Props) => {
    const router = useRouter();
    const msalInstanceRef = useRef(new PublicClientApplication(msalConfig));

    useEffect(() => {
        setMsalRouter();
        setActiveMsalAccount();
    }, [])

    const setMsalRouter = () => {
        const navigationClient = new CustomNavigationClient(router);
        msalInstanceRef.current.setNavigationClient(navigationClient);
    }

    const setActiveMsalAccount = () => {
        const accounts = msalInstanceRef.current.getAllAccounts();
        if (accounts.length > 0) {
            msalInstanceRef.current.setActiveAccount(accounts[0]);
        }

        msalInstanceRef.current.addEventCallback((event: EventMessage) => {
            if (event.payload && event.eventType === EventType.LOGIN_SUCCESS && (event.payload as AuthenticationResult).account) {
                const account = (event.payload as AuthenticationResult).account;
                msalInstanceRef.current.setActiveAccount(account);
            }
        });
    }

    return (
        <MsalProvider instance={msalInstanceRef.current}>
            <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={loginRequest}>
                {children}
            </MsalAuthenticationTemplate>
        </MsalProvider>
    );
}

export default AzureAD;