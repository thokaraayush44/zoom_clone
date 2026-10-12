"use client";

import { useEffect, useState, ReactNode } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { tokenProvider } from "@/actions/stream.actions";
import { Loader } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user || !apiKey) return;

    const client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      },
      tokenProvider,
    });

    setVideoClient(client);

    // Don't disconnect the singleton client here.
    // React Strict Mode can run effect cleanup during development.
  }, [user?.id, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="size-8 animate-spin text-white" />
      </div>
    );
  }

  // Public pages can render without Stream authentication
  if (!user) {
    return <>{children}</>;
  }

  if (!videoClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="size-8 animate-spin text-white" />
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;