import { AppContext } from '@/pages/_app';
import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface IMessageProps {
  message: string;
  author?: string;
}

export const Message = ({ message, author }: IMessageProps) => {
  const { address } = useAccount();
  const isTheMessageFromMe = author === address;

  const { lensClient } = useContext(AppContext);

  const [lensHandle, setLensHandle] = useState<string>();

  const getLensHandleFromAddress = async () => {
    if (!lensClient || !author) {
      console.error('Lens client not initialized');
      return;
    }
    const { items: profiles } = await lensClient.profile.fetchAll({
      ownedBy: [author],
    });
    return profiles[0]?.handle;
  };

  useEffect(() => {
    getLensHandleFromAddress().then((handle) => setLensHandle(handle));
  }, [author]);

  return (
    <div className={`${isTheMessageFromMe ? 'ml-auto' : 'mr-auto'}`}>
      <p
        className={`shadow rounded-full px-4 py-1 w-fit text-xl ${
          isTheMessageFromMe ? 'bg-blue-600 text-white' : 'bg-slate-100'
        }`}
      >
        {message}
      </p>
      <p className='text-sm text-slate-800'>{lensHandle || author || ''}</p>
    </div>
  );
};
