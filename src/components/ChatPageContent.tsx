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
  const [streamId, setStreamId] = useState('');

  return (
    <div>
      <ConnectButton />
      <input
        value={streamId}
        onChange={(e) => setStreamId(e.target.value)}
        placeholder='Stream ID'
      />

      <StreamComponent streamId={streamId || TEST_STREAM_ID} />
    </div>
  );
};
