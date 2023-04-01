import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner } from 'wagmi';
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
      <h1 className='text-4xl font-bold'>Lens x Streamr Group Chat</h1>
      <p>Connect your wallet to get started.</p>
      <ConnectButton />
    </main>
  );
}
