const TEMPLATES = [
  {
    title: "매거진",
    desc: "뉴스레터 등을 위한 매거진 템플릿입니다.",
    url: "/newsletter.png",
    type: "pro",
  },
  {
    title: "스타트업",
    desc: "스타트업의 속도감 있는 템플릿입니다.",
    url: "/company3.png",
    type: "pro",
  },
  {
    title: "스튜디오",
    desc: "스튜디오를 소개하기 적합한 템플릿입니다.",
    url: "/han_studio2.png",
    type: "pro",
  },
  {
    title: "법률사무소",
    desc: "법률사무소를 알릴 수 있는 템플릿입니다.",
    url: "/han_law2.png",
    type: "pro",
  },
  {
    title: "포트폴리오",
    desc: "포트폴리오에 적합한 템플릿입니다.",
    url: "/portfolio.png",
    type: "free",
  },
];
import TemplateCard from "./components/TemplateCard";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans overflow-x-hidden">
      <div className="mt-40 page-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((el, index) => {
          const key = `${el.title}_${index}`;
          return <TemplateCard key={key} {...el} />;
        })}
      </div>
    </div>
  );
}
