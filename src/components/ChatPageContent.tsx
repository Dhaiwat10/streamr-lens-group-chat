import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { PermissionAssignment, Stream, StreamPermission } from 'streamr-client';
import { getNewStreamrClient } from '@/utils';
import { AppContext } from '@/pages/_app';
import { StreamComponent } from './Stream';

const TEST_STREAM_ID = '0xA2AF948C508311e1D24270649d770cF4d4F5D0B5/test/stream';

export default () => {
  const [streamIdInputValue, setStreamIdInputValue] = useState('');
  const [streamIdToBePassedDown, setStreamIdToBePassedDown] = useState('');

  return (
    <div>
      <ConnectButton />
      <input
        value={streamIdInputValue}
        onChange={(e) => setStreamIdInputValue(e.target.value)}
        placeholder='Stream ID'
      />

      <button onClick={() => setStreamIdToBePassedDown(streamIdInputValue)}>
        Set Stream ID
      </button>

      <StreamComponent streamId={streamIdToBePassedDown || TEST_STREAM_ID} />
    </div>
  );
};
