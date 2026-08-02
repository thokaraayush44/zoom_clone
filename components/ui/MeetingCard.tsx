"use client";

import Image from "next/image";

const colors = {
  orange: "bg-orange-1",
  blue: "bg-blue-1",
  purple: "bg-purple-1",
  yellow: "bg-yellow-1",
};

interface MeetingCardProps {
  icon: string;
  title: string;
  description: string;
  color: keyof typeof colors;
  handleClick: () => void;
}

const MeetingCard = ({
  icon,
  title,
  description,
  color,
  handleClick,
}: MeetingCardProps) => {
  return (
    <div  
      onClick={handleClick}
      className={`${colors[color]} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}
      >
      <div className="flex items-center justify-center glassmorphism size-12 rounded-[10px]">
        <Image src={icon} alt={title} height={27} width={27}/>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default MeetingCard;