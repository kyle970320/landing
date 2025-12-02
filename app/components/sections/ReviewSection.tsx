"use client";

import ReviewCard from "../review/ReviewCard";

const reviews = [
  {
    id: "1",
    img: "/images/review-1.jpg",
    name: "이도현",
    subTitle: "프리랜서 디자이너",
    content:
      "노션 기반으로 웹사이트를 자동 생성하는 서비스는 처음 사용해봤는데 기대 이상이었습니다. 특히 노션에서 블록만 잘 구성하면 즉시 웹에 반영되는 흐름이 너무 자연스러워 작업 효율이 크게 올랐습니다. 기존에는 따로 디자인 작업과 퍼블리싱을 병행해야 해서 시간이 많이 들었는데, 지금은 콘텐츠 작성에만 집중할 수 있어 정말 만족스럽습니다.",
  },
  {
    id: "2",
    img: "/images/review-2.jpg",
    name: "김서연",
    subTitle: "개발자 포트폴리오 운영",
    content:
      "포트폴리오 페이지를 직접 개발하려다가 시간이 너무 많이 들어 포기했었는데, 이 서비스를 사용하고 나서는 몇 시간 만에 완성할 수 있었습니다. 노션에서 작성한 문서 구조를 그대로 가져와 섹션별로 정리해주는 기능이 특히 좋았습니다. 유지보수도 거의 필요 없어서 앞으로도 꾸준히 사용할 생각입니다.",
  },
  {
    id: "3",
    img: "/images/review-3.jpg",
    name: "박지훈",
    subTitle: "스타트업 마케터",
    content:
      "팀 블로그를 운영하면서 가장 어려웠던 점이 개발 리소스가 부족해 페이지 수정이 늦어진다는 것이었는데, 이제는 마케팅팀에서 직접 노션만 수정하면 바로 웹사이트에 반영되어 작업 속도가 엄청 빨라졌습니다. 웹사이트의 가독성과 레이아웃도 기본 템플릿이 워낙 잘 잡혀 있어서 최소한의 수정만으로도 충분히 브랜드 이미지를 표현할 수 있었습니다.",
  },
  {
    id: "4",
    img: "/images/review-4.jpg",
    name: "정민호",
    subTitle: "교육 콘텐츠 크리에이터",
    content:
      "새로운 강의 페이지를 만들 때마다 매번 웹디자이너와 커뮤니케이션하는 과정이 번거로웠는데, 이제는 노션 페이지 하나만 준비하면 자동으로 웹사이트가 만들어져 너무 편합니다. 특히 이미지나 영상 임베드 지원이 자연스러워서 콘텐츠를 구성할 때 제약이 거의 없다는 점이 가장 마음에 듭니다. 플랫폼 안정성도 뛰어나 재방문자가 많은 제 사이트에 딱 맞습니다.",
  },
  {
    id: "5",
    img: "/images/review-5.jpg",
    name: "서윤하",
    subTitle: "1인 기업 창업가",
    content:
      "처음에는 단순한 랜딩페이지를 만들기 위해 이용했는데, 생각보다 훨씬 다양한 구성과 확장성을 제공해서 놀랐습니다. 노션을 이미 업무 관리에 사용하고 있어서 추가적인 툴을 배우지 않아도 된다는 점이 가장 큰 장점입니다. 고객 반응에 따라 빠르게 문구나 구성을 바꿀 수 있어 실험적인 마케팅에도 큰 도움이 되었습니다.",
  },
  {
    id: "6",
    img: "/images/review-6.jpg",
    name: "김도윤",
    subTitle: "프리랜서 웹디자이너",
    content:
      "클라이언트별로 빠르게 콘셉트를 제안해야 하는데, 이 시스템을 쓰고 나서는 시안 제작 시간이 절반 이하로 줄었습니다. 무엇보다도 컴포넌트 기반이라 디자인을 바꿔도 전체 구조가 무너지지 않아 유지 보수에 큰 장점이 있어요. 작업 효율이 확실히 올라갔습니다.",
  },

  {
    id: "7",
    img: "/images/review-7.jpg",
    name: "박채원",
    subTitle: "교육 콘텐츠 기획자",
    content:
      "기존에 파워포인트로 강의안을 만들다가 이걸 써보고 완전히 갈아탔습니다. 레이아웃과 텍스트 구조가 깨지지 않아 학습자 관점에서 보기 좋고, 모바일 대응도 기본적으로 잘 되어 있어요. 빠르게 반복 실험해야 하는 교육 콘텐츠에 딱 맞는 도구입니다.",
  },

  {
    id: "8",
    img: "/images/review-8.jpg",
    name: "정하림",
    subTitle: "브랜딩 스튜디오 대표",
    content:
      "브랜드 초기 제안 단계에서 실제 웹사이트처럼 보여주는 것이 중요한데, 기존 툴보다 훨씬 빠르게 결과물을 만들 수 있었습니다. 클라이언트 미팅 때 바로 수정하고 실시간으로 보여줄 수 있어서 설득력이 크게 올라갔습니다.",
  },

  {
    id: "9",
    img: "/images/review-9.jpg",
    name: "이준우",
    subTitle: "리서치 기반 마케터",
    content:
      "A/B 테스트용 랜딩을 반복적으로 만들어야 했는데, 이 툴은 작업 속도 면에서 압도적입니다. 노션 데이터와 자동으로 연동되는 구조라 반복적인 수정 작업도 거의 필요 없어요. 실험 주기가 빨라지니 데이터 품질도 자연스럽게 좋아졌습니다.",
  },

  {
    id: "10",
    img: "/images/review-10.jpg",
    name: "한가연",
    subTitle: "커뮤니티 운영자",
    content:
      "소규모 커뮤니티라 별도 개발자를 두기 힘들었는데, 이 솔루션은 비개발자도 충분히 다룰 수 있을 만큼 직관적이었습니다. 이벤트 페이지나 공지 페이지를 바로 만들 수 있어 운영 난이도가 크게 낮아졌습니다. 무엇보다 수정할 때마다 바로 반영되는 점이 가장 만족스럽습니다.",
  },
];

export default function ReviewSection() {
  const splitIntoThree = <T,>(list: T[]): [T[], T[], T[]] => {
    const result: [T[], T[], T[]] = [[], [], []];

    list.forEach((item, index) => {
      result[index % 3].push(item);
    });

    return result;
  };

  const splited = splitIntoThree(reviews);

  return (
    <div className="page-container mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          D-Sket으로 사용자 리뷰
        </h2>
        <p className="text-sm md:text-base text-gray-300">
          사용자 리뷰 섹션입니다.
        </p>
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col gap-6 p-3 w-1/3">
          {splited[0].map((el, index) => {
            const key = `${el.name}_${index}`;
            return <ReviewCard key={key} {...el} />;
          })}
        </div>
        <div className="flex flex-col gap-6 p-3 w-1/3">
          {splited[1].map((el, index) => {
            const key = `${el.name}_${index}`;
            return <ReviewCard key={key} {...el} />;
          })}
        </div>
        <div className="flex flex-col gap-6 p-3 w-1/3">
          {splited[2].map((el, index) => {
            const key = `${el.name}_${index}`;
            return <ReviewCard key={key} {...el} />;
          })}
        </div>
      </div>
    </div>
  );
}
