"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingCard from "./MeetingCard";
import MeetingModal from "./MeetingModal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";


const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<
    "isInstantMeeting" | "isJoiningMeeting" | "isScheduleMeeting"| undefined
    >();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
      dateTime: new Date(),
      description: '',
      link: ''
    })

    const  [callDetails, setcallDetails] =useState<Call>()

    const createMeeting= async ()=>{
        if(!client || !user) return;

        try{
          if(!values.dateTime){
            toast.error("Please select Date and Time.");
            return;
          }
          const id = crypto.randomUUID();
          const call = client.call('default', id);
        

          if(!call) throw new Error('Failed to create a call')
          
          const startsAt = values.dateTime.toISOString() ||
          new Date(Date.now()).toISOString();
          const description = values.description || 'Instant meeting';

          await  call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description
              }
            }
          })
          setcallDetails(call);

          if(!values.description){
            router.push(`/meeting/${call.id}`)
            toast.success("Meeting Created", {
               description: "Your meeting has been created successfully.",
            });
          }
        } catch (error){
          console.log(error);
          toast.error("Failed to create meeting", {
             description: "Failed to create a meeting.Please try again.",
          });

        }
    }
  return (
    <>
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

      <MeetingCard
        icon="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        color="orange"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />

      <MeetingCard
        icon="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        color="blue"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />

      <MeetingCard
        icon="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        color="purple"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />

      <MeetingCard
        icon="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        color="yellow"
        handleClick={() => router.push("/recordings")}
      />

      <MeetingModal
       isOpen={meetingState === "isInstantMeeting"}
       onClose={()=> setMeetingState(undefined)}
       title="Start an Instant Meeting"
       className="text-center"
       buttontext="Start Meeting"
       handleClick={createMeeting}
      />

    </section>

    

    </>
  );
};

export default MeetingTypeList;