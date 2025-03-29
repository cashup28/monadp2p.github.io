// /pages/_app.js
import '../styles/globals.css';
import { UserProvider } from '../context/UserContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function App({ Component, pageProps }) {
  return (
    <TonConnectUIProvider manifestUrl="https://monadp2p-github-io-ac.vercel.app/tonconnect-manifest.json">
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </TonConnectUIProvider>
  );
}
