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
import useDebounce, { getNewStreamrClient } from '@/utils';
import { AppContext } from '@/pages/_app';
import { ProfileFragment } from '@lens-protocol/client';
import { Message } from './Message';

export const StreamComponent: FC<StreamProps> = ({ streamId }) => {
  const { data: signer } = useSigner();
  const router = useRouter();
  useAccount({ onDisconnect: () => router.push('/') });
  const { streamrClient, setStreamrClient, lensClient } =
    useContext(AppContext);
  const [newStreamName, setNewStreamName] = useState('');
  const [stream, setStream] = useState<Stream>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { address: currentlyConnectedUserAddress } = useAccount();

  const [addressToBeAddedToGroup, setAddressToBeAddedToGroup] = useState('');

  const [lensProfileSearchQuery, setLensProfileSearchQuery] = useState('');
  const debouncedLensProfileSearchQuery = useDebounce(lensProfileSearchQuery);
  const [lensProfileSearchResults, setLensProfileSearchResults] = useState<
    ProfileFragment[]
  >([]);

  if (!window || !streamId) {
    return null;
  }

  const cleanUp = () => {
    setStreamrClient(undefined);
    setStream(undefined);
    setMessages([]);
    setNewMessage('');
    setSubscribed(false);
  };

  useEffect(() => {
    (async () => {
      if (window.ethereum && signer) {
        cleanUp();
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
          await streamrClient?.setPermissions({
            streamId,
            assignments: [
              {
                public: true,
                permissions: [StreamPermission.SUBSCRIBE],
              },
            ],
          });
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
    addNewAddressToGroup(addressToBeAddedToGroup);
    setAddressToBeAddedToGroup('');
  };

  const addNewAddressToGroup = async (address: string) => {
    if (streamrClient && stream) {
      const permissions: PermissionAssignment = {
        user: address,
        permissions: [StreamPermission.SUBSCRIBE, StreamPermission.PUBLISH],
      };
      await stream.grantPermissions(permissions);
      console.log('permissions granted');
    }
  };

  useEffect(() => {
    setLensProfileSearchResults([]);
    (async () => {
      if (!lensClient) {
        console.error('Lens client not initialized');
        return;
      }
      console.log('here');
      if (debouncedLensProfileSearchQuery) {
        const results = await lensClient.search.profiles({
          query: debouncedLensProfileSearchQuery,
          limit: 10,
        });
        setLensProfileSearchResults(results.items);
      }
    })();
  }, [debouncedLensProfileSearchQuery]);

  return (
    <>
      <div>
        <h3>Currently connected to stream ID {streamId}</h3>

        <hr className='mt-2' />

        <div className='flex p-20 gap-12'>
          <div className='flex flex-col gap-2 w-9/12 my-12'>
            {messages.map((message) => {
              return (
                <Message message={message.message} author={message.author} />
              );
            })}

            <hr />

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='p-2 border-2 rounded'
              placeholder='Type your message here'
            />

            <button
              onClick={handleNewMessagePublish}
              className='p-2 border-2 rounded text-white bg-blue-700'
            >
              Send
            </button>
          </div>

          <div className='ml-auto w-3/12'>
            <h3 className='text-2xl font-bold'>☘️ Search Lens Profiles</h3>
            <p>
              Search for your friends on Lens and add them to this group chat!
            </p>
            <input
              value={lensProfileSearchQuery}
              onChange={(e) => setLensProfileSearchQuery(e.target.value)}
              className='p-2 border-2 rounded w-full'
              placeholder='Type a Lens handle eg. dhaiwat.lens'
            />

            <div className='flex flex-col gap-2'>
              {lensProfileSearchResults.map((profile) => {
                return (
                  <div className='flex flex-row gap-2' key={profile.id}>
                    <span>{profile.handle}</span>
                    <button
                      onClick={() => addNewAddressToGroup(profile.ownedBy)}
                      className='p-2 border-2 rounded'
                    >
                      Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <hr />

        <h3>Grant permissions</h3>
        <input
          value={addressToBeAddedToGroup}
          onChange={(e) => setAddressToBeAddedToGroup(e.target.value)}
          className='p-2 border-2 rounded'
          placeholder='0xabcd'
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
