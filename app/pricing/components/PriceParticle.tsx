"use client";
import TextCanvas from "@/app/components/canvas/TextCanvas";
import { useState } from "react";

export default function PriceParticle() {
  const [hoverNum, setHoverNum] = useState<number>(0.0);
  return (
    <div className="relative min-h-screen">
      <div className="page-container mt-20 mx-auto flex relative z-10 gap-10">
        <div
          className="flex-1 h-150 bg-gray-100 border border-gray-500"
          onMouseEnter={() => {
            setHoverNum(1.0);
          }}
          onMouseLeave={() => {
            setHoverNum(0.0);
          }}
        >
          free test
        </div>
        <div
          className="flex-1 h-150 bg-gray-100 border border-gray-500 "
          onMouseEnter={() => {
            setHoverNum(1.0);
          }}
          onMouseLeave={() => {
            setHoverNum(0.0);
          }}
        >
          pro test
        </div>
        <div
          className="flex-1 h-150 bg-gray-100 border border-gray-500"
          onMouseEnter={() => {
            setHoverNum(1.0);
          }}
          onMouseLeave={() => {
            setHoverNum(0.0);
          }}
        >
          enterPrise test
        </div>
      </div>
      <TextCanvas hoverNum={hoverNum} />
    </div>
  );
}
