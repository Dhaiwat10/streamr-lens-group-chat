interface StreamProps {
  streamId: string;
}

import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import {
  PermissionAssignment,
  STREAMR_STORAGE_NODE_GERMANY,
  Stream,
  StreamPermission,
} from 'streamr-client';
import { getNewStreamrClient } from '@/utils';
import { AppContext } from '@/pages/_app';

export const StreamComponent: FC<StreamProps> = ({ streamId }) => {
  const { data: signer } = useSigner();
  const router = useRouter();
  useAccount({ onDisconnect: () => router.push('/') });
  const { streamrClient, setStreamrClient } = useContext(AppContext);
  const [newStreamName, setNewStreamName] = useState('');
  const [stream, setStream] = useState<Stream>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { address: currentlyConnectedUserAddress } = useAccount();

  const [addressToBeAddedToGroup, setAddressToBeAddedToGroup] = useState('');

  if (!window || !streamId) {
    return null;
  }

  useEffect(() => {
    (async () => {
      if (window.ethereum && signer) {
        const client = getNewStreamrClient();
        console.log(client);
        setStreamrClient(client);

        const stream = await client.getOrCreateStream({
          id: streamId,
        });
        setStream(stream);

        const isStoredStream = await client.isStoredStream(
          stream.id,
          STREAMR_STORAGE_NODE_GERMANY
        );
        if (!isStoredStream) {
          await stream.addToStorageNode(STREAMR_STORAGE_NODE_GERMANY);
        }
      }
    })();
  }, [window, signer, streamId]);

  useEffect(() => {
    (async () => {
      if (streamrClient && stream && !subscribed) {
        await streamrClient.subscribe(
          {
            id: stream.id,
            resend: {
              last: 10,
            },
          },
          (message) => {
            console.log(message);
            setMessages((messages) => [...messages, message]);
          }
        );
        setSubscribed(true);
      }
    })();
  }, [stream]);

  const handleNewMessagePublish = async () => {
    if (streamrClient && stream) {
      await stream.publish({
        message: newMessage,
        author: currentlyConnectedUserAddress,
      });
      setNewMessage('');
    }
  };

  const handleAddNewAddressToGroup = async () => {
    if (streamrClient && stream) {
      const permissions: PermissionAssignment = {
        user: addressToBeAddedToGroup as string,
        permissions: [StreamPermission.SUBSCRIBE, StreamPermission.PUBLISH],
      };
      await stream.grantPermissions(permissions);
      console.log('permissions granted');
      setAddressToBeAddedToGroup('');
    }
  };

  return (
    <>
      <h1>Chat page</h1>

      <div>
        <h3>Stream id: {streamId}</h3>

        {messages.map((message) => {
          return (
            <div>
              <pre>{JSON.stringify(message, null, 2)}</pre>
            </div>
          );
        })}

        <hr />

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='p-2 border-2 rounded'
        />

        <button
          onClick={handleNewMessagePublish}
          className='p-2 border-2 rounded'
        >
          Send
        </button>

        <hr />

        <h3>Grant permission</h3>
        <input
          value={addressToBeAddedToGroup}
          onChange={(e) => setAddressToBeAddedToGroup(e.target.value)}
          className='p-2 border-2 rounded'
        />
        <button
          onClick={handleAddNewAddressToGroup}
          className='p-2 border-2 rounded'
        >
          Add
        </button>
      </div>
    </>
  );
};
