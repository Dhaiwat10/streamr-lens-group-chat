import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner } from 'wagmi';
import StreamrProvider from 'streamr-client-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { data: signer } = useSigner();
  const provider = signer?.provider;
  const router = useRouter();

  useEffect(() => {
    if (provider) {
      router.push('/chat');
    }
  }, [signer, provider]);

  return (
    <main>
      <h1>woot woot</h1>
      <ConnectButton />
    </main>
  );
}
