import { AuthenticationResult, Configuration, EventMessage, EventType, InteractionType, PublicClientApplication, RedirectRequest } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useRef } from "react";
import { CustomNavigationClient } from "../auth/CustomNavigationClient";

const msalConfig = {
    auth: {
        clientId: process.env.AAD_CLIENT_ID,
        authority: process.env.AAD_LOGIN_URL,
        postLogoutRedirectUri: '/'
    },
} as Configuration

export const loginRequest = {
    scopes: [process.env.AAD_DEFAULT_SCOPE]
} as RedirectRequest

interface Props {
    children: ReactNode
}

export const UserIdContext = createContext<string | undefined>(undefined);

const AzureAD = ({ children }: Props) => {
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

    const getIdActiveAccount = () => {
        return msalInstanceRef.current.getActiveAccount()?.localAccountId;
    }

    return (
        <MsalProvider instance={msalInstanceRef.current}>
            <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={loginRequest}>
                <UserIdContext.Provider value={getIdActiveAccount()}>
                    {children}
                </UserIdContext.Provider>
            </MsalAuthenticationTemplate>
        </MsalProvider>
    );
}

export default AzureAD;