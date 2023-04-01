import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { StreamComponent } from './Stream';

const TEST_STREAM_ID = '0xA2AF948C508311e1D24270649d770cF4d4F5D0B5/test/stream';

export default () => {
  const [streamIdInputValue, setStreamIdInputValue] = useState('');
  const [streamIdToBePassedDown, setStreamIdToBePassedDown] = useState('');

  return (
    <div className='px-20 py-5 flex flex-col gap-6'>
      <ConnectButton />

      <div className='flex flex-col gap-2'>
        <input
          value={streamIdInputValue}
          onChange={(e) => setStreamIdInputValue(e.target.value)}
          placeholder='Stream ID'
          className='rounded p-2 border-2 shadow'
        />

        <button
          className='rounded p-2 border-2 shadow'
          onClick={() => setStreamIdToBePassedDown(streamIdInputValue)}
        >
          Set Stream ID
        </button>
      </div>

      <StreamComponent streamId={streamIdToBePassedDown || TEST_STREAM_ID} />
    </div>
  );
};
