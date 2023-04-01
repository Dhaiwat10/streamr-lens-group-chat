import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import StreamrClient from 'streamr-client';

const { chains, provider } = configureChains([polygon], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  const [streamrClient, setStreamrClient] = useState<StreamrClient>();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <AppContext.Provider value={{ streamrClient, setStreamrClient }}>
          <Component {...pageProps} />
        </AppContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

interface AppContextType {
  streamrClient: StreamrClient | undefined;
  setStreamrClient: Dispatch<SetStateAction<StreamrClient | undefined>>;
}

export const AppContext = createContext<AppContextType>({
  streamrClient: undefined,
  setStreamrClient: () => {},
});
