'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import Loader from '@/components/ui/Loader';
import MeetingSetup from '@/components/ui/MeetingSetup';
import MeetingRoom from '@/components/ui/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';

const Meeting = () => {
  const { id } = useParams<{ id: string }>();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (isCallLoading) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;