import ParticleCanvas from "./components/canvas/ParticleCanvas";
import HeroSection from "./components/sections/HeroSection";
import HowToUseSection from "./components/sections/HowToUseSection";
import VideoSection from "./components/sections/VideoSection";

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-[#FBFBFB] font-sans overflow-x-hidden">
      <ParticleCanvas />
      <HeroSection />
      <VideoSection />
      <HowToUseSection />
    </div>
  );
}
