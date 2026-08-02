'use client';

import { useRouter } from 'next/navigation';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.'
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await call.endCall();
    router.push('/');
  };

  return (
    <Button onClick={endCall} className='flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 active:scale-95'>
        <PhoneOff size={18}/>
        <span className='hidden sm:inline'>End Call</span>
    </Button>
  );
};

export default EndCallButton;