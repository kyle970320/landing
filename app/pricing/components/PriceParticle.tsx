"use client";
import TextCanvas from "@/app/components/canvas/TextCanvas";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export default function PriceParticle() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoverNum, setHoverNum] = useState<number>(0.0);

  const handleMouseEnter = (num: number) => {
    setHoverNum(1.0);
    setActiveIndex(num);
  };
  const handleMouseLeave = () => {
    setHoverNum(0.0);
    setActiveIndex(-1);
  };
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="mt-[20vh] text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          성장에 맞춘 유연한 요금제
        </h2>
        <p className="text-sm md:text-base text-sub-title">
          D-Sket은 개인부터 기업까지, 모든 규모의 브랜딩 요구사항을 충족할 수
          있는 다양한 요금제를 제공합니다.
          <br />
          부담 없이 시작하고 필요에 따라 확장하세요.
        </p>
      </div>
      <div className="page-container h-full mt-[8vh] mx-auto flex relative z-10">
        <div
          className="relative top-20 flex-1 px-10 py-5 bg-white rounded-2xl price-shadow"
          onMouseEnter={() => {
            handleMouseEnter(0);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <p className="font-museo text-center text-xl font-bold text-main-title">
            Free
          </p>
          <p className="font-noto text-center text-sub-title">
            단일 페이지 무료 사용
          </p>
          <p className="font-noto font-bold text-center py-10 text-4xl text-indigo-400">
            ₩0
          </p>
          <div className="flex items-center mb-10">
            <p className="w-full px-2 py-1 text-center bg-[#F0F0F0] text-main-title rounded-lg cursor-pointer">
              무료로 시작하기
            </p>
          </div>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={16} color="#666666" />
            단일 템플릿 사용 가능
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            노션 문서 연동
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            실시간 동기화
          </p>
        </div>
        <div
          className="relative z-1 flex-1 px-10 py-5 bg-indigo-600 scale-110 rounded-2xl price-shadow"
          onMouseEnter={() => {
            handleMouseEnter(1);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <p className="absolute -top-3 -right-3 bg-white px-2 rounded-md font-bold text-sub border-sub border-3 shadow-2xl">
            Most Popular
          </p>
          <p className="font-museo text-center text-xl font-bold text-white">
            Pro
          </p>
          <p className="font-noto text-center text-[#ECECEC]">
            전문적인 브랜딩을 위한
            <br />
            완벽한 솔루션
          </p>
          <p className="font-noto text-center py-10 text-3xl leading-0">
            <span className="text-sub">₩15,000</span>
            <span className="text-indigo-300 text-sm">/월</span>
            <br />
            <span className="text-indigo-300 text-sm">부가세 포함</span>
          </p>
          <div className="flex items-center mb-10">
            <p className="w-full px-2 py-1 text-center text-sm bg-sub text-white rounded-lg cursor-pointer">
              지금 구독하기
            </p>
          </div>
          <p className="flex items-center gap-1 px-2 py-2 text-white text-sm">
            <CircleCheck size={14} color="white" />
            노션 문서 연동
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-white text-sm">
            <CircleCheck size={14} color="white" />
            실시간 동기화
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub text-sm">
            <CircleCheck size={14} color="#f6a53a" />
            Pro 템플릿 사용 가능
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub text-sm">
            <CircleCheck size={14} color="#f6a53a" />
            커스텀 도메인 구매 및 설정가능
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub text-sm">
            <CircleCheck size={14} color="#f6a53a" />
            SEO 기능
          </p>
        </div>
        <div
          className="relative top-6 flex-1 px-10 py-5 bg-white rounded-2xl price-shadow"
          onMouseEnter={() => {
            handleMouseEnter(2);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <p className="absolute -top-3 -right-3 bg-white px-2 rounded-md font-bold text-sub border-sub border-3 shadow-2xl">
            Preminum
          </p>
          <p className="font-museo text-center text-xl font-bold text-main-title">
            Enterprise
          </p>
          <p className="font-noto text-center text-sub-title">
            대규모 팀과 기업을 위한
            <br />
            맞춤형 솔루션
          </p>
          <p className="font-noto font-bold text-center py-10 text-3xl text-indigo-400">
            맞춤 견적
          </p>
          <div className="flex items-center mb-10">
            <p className="w-full px-2 py-1 text-center bg-[#F0F0F0] text-main-title rounded-lg cursor-pointer">
              문의하기
            </p>
          </div>
          <p className="flex items-center gap-1 px-2 py-2 text-main text-sm">
            <CircleCheck size={14} color="#4f39f6" />
            요구사항에 맞춘 전문적 솔루션
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            Pro 템플릿 사용 가능
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            노션 문서 연동
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            실시간 동기화
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            커스텀 도메인 구매 및 설정가능
          </p>
          <p className="flex items-center gap-1 px-2 py-2 text-sub-title text-sm">
            <CircleCheck size={14} color="#666666" />
            SEO 기능
          </p>
        </div>
      </div>
      <TextCanvas activeIndex={activeIndex} hoverNum={hoverNum} />
    </div>
  );
}
