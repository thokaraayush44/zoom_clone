"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Call } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { useGetCalls } from "@/hooks/useGetCalls";

type CallListType = "ended" | "upcoming" | "recordings";
type Recording = Awaited<ReturnType<Call["listRecordings"]>>["recordings"][number] & {
  callId: string;
  description: string;
};

const emptyMessages: Record<CallListType, string> = {
  ended: "No Previous Calls",
  upcoming: "No Upcoming Calls",
  recordings: "No Recordings",
};

const CallList = ({ type }: { type: CallListType }) => {
  const router = useRouter();
  const { calls, endedCalls, upcomingCalls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);

  useEffect(() => {
    if (type !== "recordings" || isLoading) return;

    let isCurrent = true;
    const loadRecordings = async () => {
      setIsLoadingRecordings(true);

      const results = await Promise.allSettled(
        calls.map(async (call) => {
          const { recordings: callRecordings } = await call.listRecordings();
          return callRecordings.map((recording) => ({
            ...recording,
            callId: call.id,
            description: String(call.state.custom.description ?? "Meeting recording"),
          }));
        }),
      );

      if (!isCurrent) return;

      const loadedRecordings = results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : [],
      );
      const failedRequests = results.filter(
        (result) => result.status === "rejected",
      ).length;

      setRecordings(loadedRecordings);
      setIsLoadingRecordings(false);

      if (failedRequests > 0) {
        toast.error("Some recordings could not be loaded.");
      }
    };

    void loadRecordings();
    return () => {
      isCurrent = false;
    };
  }, [calls, isLoading, type]);

  const meetings = type === "upcoming" ? upcomingCalls : endedCalls;
  const isLoadingList = isLoading || (type === "recordings" && isLoadingRecordings);
  const hasItems = type === "recordings" ? recordings.length > 0 : meetings.length > 0;

  if (isLoadingList) {
    return <p className="text-white">Loading {type}...</p>;
  }

  if (!hasItems) {
    return <p className="text-white">{emptyMessages[type]}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {type === "recordings"
        ? recordings.map((recording) => (
            <article
              key={`${recording.callId}-${recording.filename}`}
              className="flex flex-col gap-3 rounded-xl bg-dark-1 p-5 text-white"
            >
              <h2 className="text-xl font-semibold">{recording.description}</h2>
              <p className="text-sm text-slate-300">
                {new Date(recording.start_time).toLocaleString()}
              </p>
              <a
                className="w-fit text-blue-300 underline"
                href={recording.url}
                target="_blank"
                rel="noreferrer"
              >
                Watch recording
              </a>
            </article>
          ))
        : meetings.map((call) => (
            <article
              key={call.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-dark-1 p-5 text-white"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">
                  {String(call.state.custom.description ?? "Meeting")}
                </h2>
                <p className="text-sm text-slate-300">
                  {call.state.startsAt?.toLocaleString() ?? "Time not specified"}
                </p>
              </div>
              <button
                className="rounded bg-blue-1 px-4 py-2"
                onClick={() => router.push(`/meeting/${call.id}`)}
                type="button"
              >
                {type === "upcoming" ? "Join" : "View"}
              </button>
            </article>
          ))}
    </div>
  );
};

export default CallList;
