import Image from "next/image";

export default function ExplainSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FBFBFB] min-h-screen">
      <div className="page-container">
        {/* 상단 타이틀 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            D-Sket으로 웹사이트 만들기
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            웹사이트 만들기 설명웹사이트 만들기 설명웹사이트 만들기 설명웹사이트
            만들기 설명웹사이트 만들기 설명웹사이트 만들기 설명웹사이트 만들기
            설명웹사이트 만들기 설명웹사이트 만들기 설명웹사이트 만들기
            설명웹사이트 만들기 설명웹사이트 만들기 설명웹사이트 만들기
            설명웹사이트 만들기 설명웹사이트 만들기 설명웹사이트 만들기
            설명웹사이트 만들기 설명웹사이트 만들기 설명웹사이트 만들기
            설명웹사이트 만들기 설명웹사이트 만들기 설명
          </p>
        </div>
        <div className="relative">
          <img
            className="absolute w-4/5 rounded-2xl"
            src="/active-web.png"
            alt=""
          />
          <img
            className="absolute right-0 top-[150px] w-3/5 rounded-2xl shadow-3xl"
            src="/custom-web.png"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
