import RotatingRingParticles from "../canvas/RingCanvas";
import FreeTextParticles from "../canvas/TextCanvas";

export default function EndingSection() {
  return (
    <div className="relative min-h-screen">
      {/* <FreeTextParticles /> */}
      <RotatingRingParticles />
      <div className="page-container min-h-screen mx-auto flex flex-col gap-2 items-center justify-center text-5xl">
        <div>
          딱 <span className="font-bold">3분</span>만 투자해서
        </div>
        <div className="text-indigo-600 font-bold text-center">
          자신만의 브랜딩 웹을
          <p>가져보세요!</p>
        </div>
      </div>
    </div>
  );
}
