"use client";

import { useEffect, useState } from "react";

const MeetingTime = () => {
  const [dateTime, setDateTime] = useState({
    time: "",
    date: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setDateTime({
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        date: now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className="text-4xl font-extrabold lg:text-7xl">
        {dateTime.time}
      </h1>

      <p className="text-lg font-medium text-sky-1 lg:text-2xl">
        {dateTime.date}
      </p>
    </>
  );
};

export default MeetingTime;