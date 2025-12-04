import GuideStep from "./components/GuideStep";

const GUIDES = [
  {
    title: "Step 1. 로그인 및 노션 연동하기",
    desc: "간편 로그인과 Notion 연동을 알려드립니다.",
    link: "/newsletter.png",
    tags: ["약 5분"],
    color: "#9a8dfc",
  },
  {
    title: "Step 2. 페이지 구조 파악하기",
    desc: "페이지 구조를 이해하고 원하는 다자인을 만들어보세요.",
    link: "/company3.png",
    tags: ["약 5분"],
    color: "#7462fa",
  },
  {
    title: "Step 3. Notion 콘텐츠를 웹사이트에 적용하기",
    desc: "전체 흐름을 파악하고 콘텐츠를 관리해보세요.",
    link: "/han_studio2.png",
    tags: ["약 3분"],
    color: "#4f39f6",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-main-bg font-sans overflow-x-hidden">
      <div className="my-40 page-container flex flex-col gap-10">
        {GUIDES.map((el, index) => {
          const key = `${el.title}_${index}`;
          return <GuideStep key={key} {...el} />;
        })}
      </div>
    </div>
  );
}
