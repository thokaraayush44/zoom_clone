"use client";

import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";

export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();
    const { user } = useUser();

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return;

            setIsLoading(true);

            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: "starts_at", direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { members: { $in: [user.id] } },
                            { created_by_user_id: user.id },
                        ],
                    },
                });

                setCalls(calls);
            } catch (error) {
                console.error("Failed to fetch calls:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCalls();
    }, [client, user]);

    const now = new Date();
    const upcomingCalls = calls.filter(({ state }) => {
        return state.startsAt && state.startsAt > now && !state.endedAt;
    });

    const endedCalls = calls.filter(({ state }) => Boolean(state.endedAt));

    return { calls, endedCalls, upcomingCalls, isLoading };
}
