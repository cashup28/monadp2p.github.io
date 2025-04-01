// /context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [monadWallet, setMonadWallet] = useState('');
  const [tonBalance, setTonBalance] = useState(0);
  const [monadBalance, setMonadBalance] = useState(0);

  useEffect(() => {
    // Cüzdan bağlandığında userId ve monadWallet örnek şekilde oluşturuluyor
    if (walletAddress) {
      const newId = `user_${walletAddress.slice(-8)}`;
      setUserId(newId);

      // Monad cüzdanı simülasyonu (bot tarafında gerçek adres atanacak)
      const fakeMonadAddress = `0x${walletAddress.slice(-40)}`;
      setMonadWallet(fakeMonadAddress);
    }
  }, [walletAddress]);

  return (
    <UserContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        userId,
        monadWallet,
        tonBalance,
        setTonBalance,
        monadBalance,
        setMonadBalance,
      }}
    >
      <TonConnectUIProvider
        manifestUrl="https://monadp2p-github-io.vercel.app/tonconnect-manifest.json"
      >
        {children}
      </TonConnectUIProvider>
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
