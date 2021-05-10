import Head from 'next/head'
import { AppProps } from 'next/app';
import '../styles/globals.scss'
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { AuthenticationResult, EventMessage, EventType, InteractionType, PublicClientApplication, RedirectRequest } from '@azure/msal-browser';
import { loginRequest, msalConfig } from '../auth/MsalConfig';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CustomNavigationClient } from '../auth/CustomNavigationClient';

const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();
console.log(accounts);
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.payload && event.eventType === EventType.LOGIN_SUCCESS && (event.payload as AuthenticationResult).account) {
    const account = (event.payload as AuthenticationResult).account;
    msalInstance.setActiveAccount(account);
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const navigationClient = new CustomNavigationClient(router);
  msalInstance.setNavigationClient(navigationClient);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Ekudo</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/euricom.png"
          rel="icon"
          type="image/png"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <MsalProvider instance={msalInstance}>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={loginRequest}
        >
          <Component {...pageProps} />
        </MsalAuthenticationTemplate>
      </MsalProvider>
    </>
  )
}

export default MyApp
