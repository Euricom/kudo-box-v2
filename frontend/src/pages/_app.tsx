import Head from 'next/head'
import { AppProps } from 'next/app';
import '../styles/globals.scss'
import AzureAD from '../components/AzureAD';
import { ToastProvider } from 'react-toast-notifications';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {

  const [screen, setScreen] = useState<boolean>(true);
  useEffect(() => {
    if (window.location.href.toLowerCase().includes("eventroom")) {
      setScreen(true);
      return;
    }
    if (window.innerWidth > 600) {
      setScreen(false);
      return;
    }
    if (window.innerWidth > window.innerHeight) {
      setScreen(false);
      return;
    }
  }, [])

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
      <AzureAD>
        <ToastProvider>
          {!screen && <h1>Screen is to big, try a phone instead.</h1>}
          {screen && <Component {...pageProps} />}
        </ToastProvider>
      </AzureAD>
    </>
  )
}

export default MyApp
