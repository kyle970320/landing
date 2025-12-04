"use client";

import { cn } from "@/app/ilb/cn";
import { Clock } from "lucide-react";
import { useState } from "react";

interface Props {
  title: string;
  desc: string;
  link: string;
  tags: Array<string>;
  color: string;
}
export default function GuideStep({ title, desc, link, tags, color }: Props) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMouse, setIsMouse] = useState<boolean>(false);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    setIsMouse(true);
    setPosition({ x, y });
  };
  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsMouse(false);
    setPosition({ x, y });
  };

  return (
    <a
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="min-h-50 relative flex flex-col flex-wrap justify-between p-5 rounded-2xl border-1 border-gray-400 overflow-hidden"
    >
      <div className="relative z-1 text-xl font-gmarket font-bold text-white">
        {title}
      </div>
      <div className="flex items-center">
        {tags.map((el, index) => {
          const key = `${el}_${index}`;
          return (
            <p
              key={key}
              className="relative z-1 flex items-center gap-0.5 px-1 py-0.5 text-xs rounded-2xl bg-[#ECECEC]"
            >
              <Clock size={10} />
              {el}
            </p>
          );
        })}
        <div className="relative z-1 text-gray-300">
          <div>{desc}</div>
        </div>
      </div>
      <div
        className={cn(
          "absolute translate-x-[-50%] translate-y-[-50%]",
          hasInteracted && isMouse ? "ripple-circle--active" : "ripple-circle",
        )}
        style={{
          top: position.y,
          left: position.x,
          backgroundColor: color,
        }}
      />
    </a>
  );
}
