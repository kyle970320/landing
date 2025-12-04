"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const HowToUseSection = () => {
  const steps = [
    {
      id: 1,
      label: "Step 1",
      title: "쉽게 시작하기",
      description:
        "소셜 로그인을 통해 D-Sket에 가입하고, 계정을 연결해 바로 시작하세요.",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            fill="currentColor"
          />
          <path
            d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Step 2",
      title: "노션 문서 연동하기",
      description:
        "공유 설정을 완료한 노션 페이지의 링크를 붙여 넣어, D-Sket과 연결하세요.",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 7H7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M15 7H17C18.6569 7 20 8.34315 20 10C20 11.6569 18.6569 13 17 13H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 10H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 3,
      label: "Step 3",
      title: "컨텐츠 작성 및 편집",
      description:
        "노션에서 평소처럼 글과 이미지를 수정하면, 브랜딩 웹사이트도 함께 업데이트됩니다.",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.4443 5.66663L5.88881 14.2222C5.39993 14.7111 5.15549 14.9555 5.07438 15.2469C4.99327 15.5383 5.0154 15.8438 5.05967 16.4548L5.28881 19.1555C5.31606 19.5153 5.32969 19.6953 5.44772 19.8133C5.56576 19.9313 5.74583 19.945 6.10598 19.9722L8.80661 20.2014C9.41761 20.2457 9.72311 20.2678 10.0145 20.1867C10.3059 20.1056 10.5503 19.8611 11.0392 19.3722L19.5947 10.8166C20.8057 9.60553 21.4112 9.00001 21.4112 8.24996C21.4112 7.49991 20.8057 6.89439 19.5947 5.68329C18.3836 4.4722 17.7781 3.86663 17.028 3.86663C16.278 3.86663 15.6725 4.4722 14.4614 5.68329L14.4443 5.66663Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12.5557 7.55548L16.4446 11.4444"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 4,
      label: "Step 4",
      title: "브랜딩 사이트 공유",
      description:
        "완성된 퍼스널 브랜드 웹사이트 주소를 포트폴리오, SNS, 이력서 등에 자유롭게 공유하세요.",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12L9 16L19 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  // 각 step 일러스트 (지금 쓰시던 SVG 그대로 붙이면 됩니다)
  const StepIllustrations: Record<number, ReactNode> = {
    1: (
      <svg
        className="w-full h-auto max-h-full"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="300" rx="12" fill="#EEEEEE" />

        {/* Background elements */}
        <circle cx="330" cy="60" r="50" fill="#FAFAFA" fillOpacity="0.5" />
        <circle cx="70" cy="240" r="40" fill="#FAFAFA" fillOpacity="0.5" />

        {/* Center card */}
        <rect
          x="100"
          y="60"
          width="200"
          height="190"
          rx="12"
          fill="white"
          filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.05))"
        />

        <text
          x="200"
          y="100"
          fontFamily="sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#111827"
          textAnchor="middle"
        >
          D-SKET
        </text>

        <text
          x="200"
          y="140"
          fontFamily="sans-serif"
          fontSize="14"
          fontWeight="400"
          fill="#4B5563"
          textAnchor="middle"
        >
          소셜 로그인으로 시작하세요.
        </text>

        {/* Google 로그인 버튼 */}
        <rect
          x="120"
          y="160"
          width="160"
          height="32"
          rx="6"
          fill="white"
          stroke="#E5E7EB"
        />
        <circle cx="133" cy="176" r="8" fill="white" />
        <path
          d="M136.32 176.25C136.32 175.47 136.25 174.72 136.12 174H129V178.26H133.13C132.87 179.63 131.99 180.79 130.62 181.57V184.34H134.18C136.36 182.42 137.62 179.6 137.62 176.25H136.32Z"
          fill="#4285F4"
        />
        <path
          d="M129 186C132.18 186 134.86 185.02 136.68 183.34L133.12 180.57C132.16 181.2 130.73 181.58 129 181.58C126.11 181.58 123.68 179.67 122.8 177.09H119.13V179.94C120.95 183.53 124.69 186 129 186Z"
          fill="#34A853"
        />
        <path
          d="M122.8 177.09C122.58 176.43 122.45 175.73 122.45 175C122.45 174.27 122.58 173.57 122.8 172.91V170.06H119.13C118.41 171.55 118 173.22 118 175C118 176.78 118.41 178.45 119.13 179.94L122.8 177.09Z"
          fill="#FBBC05"
        />
        <path
          d="M129 168.42C130.62 168.42 132.05 168.96 133.16 170.06L136.31 166.91C134.41 165.13 131.93 164 129 164C124.69 164 120.95 166.47 119.13 170.06L122.8 172.91C123.68 170.33 126.11 168.42 129 168.42Z"
          fill="#EA4335"
        />
        <text
          x="200"
          y="177"
          fontFamily="sans-serif"
          fontSize="13"
          fontWeight="500"
          fill="#111827"
          textAnchor="middle"
        >
          구글로 로그인
        </text>

        {/* 카카오 로그인 버튼 */}
        <rect x="120" y="200" width="160" height="32" rx="6" fill="#FEE500" />
        <circle cx="133" cy="216" r="8" fill="#FEE500" />
        <path
          d="M133 211.6C129.8 211.6 127.2 213.7 127.2 216.3C127.2 217.9 128.2 219.3 129.7 220.1L129.4 221.4C129.4 221.4 129.3 221.7 129.5 221.9C129.7 222.1 130 221.9 130 221.9L131.6 220.9C132 221 132.4 221 132.8 221C136 221 138.7 218.9 138.7 216.3C138.6 213.7 136.1 211.6 133 211.6Z"
          fill="#371D1E"
        />
        <text
          x="200"
          y="217"
          fontFamily="sans-serif"
          fontSize="13"
          fontWeight="500"
          fill="#111827"
          textAnchor="middle"
        >
          카카오 로그인
        </text>
      </svg>
    ),
    2: (
      <svg
        className="w-full h-auto max-h-full"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="300" rx="12" fill="#EEEEEE" />

        {/* Background elements */}
        <circle cx="330" cy="60" r="50" fill="#FAFAFA" fillOpacity="0.5" />
        <circle cx="70" cy="240" r="40" fill="#FAFAFA" fillOpacity="0.5" />

        {/* Connection lines */}
        <path
          d="M180 150 L220 150"
          stroke="#1F2937"
          strokeWidth="3"
          strokeDasharray="6 3"
        />
        <circle cx="200" cy="150" r="15" fill="#E5E7EB" />
        <path
          d="M195 150 L205 150 M200 145 L200 155"
          stroke="#1F2937"
          strokeWidth="1.5"
        />

        {/* Notion card */}
        <rect
          x="80"
          y="110"
          width="100"
          height="80"
          rx="8"
          fill="white"
          filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
        />
        <text
          x="115"
          y="135"
          fontFamily="sans-serif"
          fontSize="14"
          fontWeight="bold"
          fill="#333333"
          textAnchor="middle"
        >
          노션
        </text>
        <rect x="95" y="145" width="70" height="4" rx="2" fill="#E4E4E7" />
        <rect x="95" y="155" width="50" height="4" rx="2" fill="#E4E4E7" />
        <rect x="95" y="165" width="60" height="4" rx="2" fill="#E4E4E7" />

        {/* D-Sket card */}
        <rect
          x="220"
          y="110"
          width="100"
          height="80"
          rx="8"
          fill="white"
          filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
        />
        <text
          x="258"
          y="135"
          fontFamily="sans-serif"
          fontSize="14"
          fontWeight="bold"
          fill="#1F2937"
          textAnchor="middle"
        >
          D-Sket
        </text>
        <rect x="235" y="145" width="70" height="4" rx="2" fill="#FAFAFA" />
        <rect x="235" y="155" width="50" height="4" rx="2" fill="#FAFAFA" />
        <rect x="235" y="165" width="60" height="4" rx="2" fill="#FAFAFA" />

        {/* Connection indicators */}
        <circle cx="180" cy="150" r="4" fill="#1F2937" />
        <circle cx="220" cy="150" r="4" fill="#1F2937" />
        {/* <text
          x="200"
          cy="190"
          fontFamily="sans-serif"
          fontSize="10"
          fontWeight="500"
          fill="#4F46E5"
          textAnchor="middle"
        >
          실시간 동기화
        </text> */}
      </svg>
    ),
    3: (
      <svg
        className="w-full h-auto max-h-full"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="300" rx="12" fill="#EEEEEE" />

        {/* Background elements */}
        <circle cx="330" cy="60" r="50" fill="#FAFAFA" fillOpacity="0.5" />
        <circle cx="70" cy="240" r="40" fill="#FAFAFA" fillOpacity="0.5" />

        {/* Document card */}
        <rect
          x="70"
          y="70"
          width="120"
          height="160"
          rx="8"
          fill="white"
          filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
        />
        <rect x="85" y="90" width="90" height="8" rx="4" fill="#1F2937" />
        <rect x="85" y="110" width="70" height="4" rx="2" fill="#E4E4E7" />
        <rect x="85" y="120" width="80" height="4" rx="2" fill="#E4E4E7" />
        <rect x="85" y="130" width="75" height="4" rx="2" fill="#E4E4E7" />
        <rect x="85" y="150" width="60" height="4" rx="2" fill="#E4E4E7" />
        <rect x="85" y="160" width="70" height="4" rx="2" fill="#E4E4E7" />
        <rect x="85" y="170" width="65" height="4" rx="2" fill="#E4E4E7" />
        <text
          x="130"
          y="210"
          fontFamily="sans-serif"
          fontSize="12"
          fontWeight="500"
          fill="#1F2937"
          textAnchor="middle"
        >
          문서 작성
        </text>

        {/* Magic transformation */}
        <path d="M190 150 L210 150" stroke="#1F2937" strokeWidth="2" />
        <path d="M196 144 L190 150 L196 156" stroke="#1F2937" strokeWidth="2" />
        <path d="M204 144 L210 150 L204 156" stroke="#1F2937" strokeWidth="2" />

        {/* Stars/magic effect */}
        <path
          d="M200 130 L202 125 L204 130 L209 132 L204 134 L202 139 L200 134 L195 132 L200 130Z"
          fill="#4F46E5"
        />
        <path
          d="M200 170 L201 167 L202 170 L205 171 L202 172 L201 175 L200 172 L197 171 L200 170Z"
          fill="#4F46E5"
        />
        <path
          d="M183 150 L184 147 L185 150 L188 151 L185 152 L184 155 L183 152 L180 151 L183 150Z"
          fill="#4F46E5"
        />
        <path
          d="M217 150 L218 147 L219 150 L222 151 L219 152 L218 155 L217 152 L214 151 L217 150Z"
          fill="#4F46E5"
        />

        {/* Website card */}
        <rect
          x="210"
          y="70"
          width="120"
          height="160"
          rx="8"
          fill="white"
          filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
        />
        <rect
          x="210"
          y="70"
          width="120"
          height="24"
          rx="8 8 0 0"
          fill="#1F2937"
        />
        <circle cx="222" cy="82" r="4" fill="white" />
        <circle cx="234" cy="82" r="4" fill="white" />
        <circle cx="246" cy="82" r="4" fill="white" />

        <rect x="225" y="104" width="90" height="6" rx="3" fill="#4F46E5" />
        <rect x="225" y="120" width="70" height="4" rx="2" fill="#FAFAFA" />
        <rect x="225" y="130" width="80" height="4" rx="2" fill="#FAFAFA" />
        <rect x="225" y="140" width="75" height="4" rx="2" fill="#FAFAFA" />

        <rect x="225" y="155" width="50" height="35" rx="4" fill="#F5F5F5" />
        <rect x="285" y="155" width="30" height="35" rx="4" fill="#F5F5F5" />
        <rect x="225" y="195" width="90" height="20" rx="4" fill="#FAFAFA" />
        <text
          x="270"
          y="210"
          fontFamily="sans-serif"
          fontSize="12"
          fontWeight="500"
          fill="#1F2937"
          textAnchor="middle"
        >
          웹페이지
        </text>
      </svg>
    ),
    4: (
      <svg
        className="w-full h-auto max-h-full"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="300" rx="12" fill="#EEEEEE" />

        {/* Background elements */}
        <circle cx="330" cy="60" r="50" fill="#FAFAFA" fillOpacity="0.5" />
        <circle cx="70" cy="240" r="40" fill="#FAFAFA" fillOpacity="0.5" />

        {/* Website preview */}
        <rect
          x="100"
          y="60"
          width="200"
          height="160"
          rx="12"
          fill="white"
          filter="drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.08))"
        />

        {/* Header */}
        <rect
          x="100"
          y="60"
          width="200"
          height="32"
          rx="12 12 0 0"
          fill="#1F2937"
        />
        <circle cx="116" cy="76" r="4" fill="white" />
        <circle cx="128" cy="76" r="4" fill="white" />
        <circle cx="140" cy="76" r="4" fill="white" />
        <rect
          x="170"
          y="72"
          width="40"
          height="8"
          rx="4"
          fill="white"
          fillOpacity="0.8"
        />
        <rect
          x="220"
          y="72"
          width="40"
          height="8"
          rx="4"
          fill="white"
          fillOpacity="0.8"
        />
        <rect
          x="270"
          y="72"
          width="20"
          height="8"
          rx="4"
          fill="white"
          fillOpacity="0.8"
        />

        {/* Content */}
        <rect x="115" y="102" width="170" height="10" rx="5" fill="#4F46E5" />
        <rect x="115" y="122" width="130" height="6" rx="3" fill="#FAFAFA" />
        <rect x="115" y="134" width="150" height="6" rx="3" fill="#FAFAFA" />
        <rect x="115" y="146" width="140" height="6" rx="3" fill="#FAFAFA" />

        {/* Image placeholders */}
        <rect x="115" y="162" width="80" height="48" rx="6" fill="#FAFAFA" />
        <rect x="205" y="162" width="80" height="48" rx="6" fill="#FAFAFA" />

        {/* Check marks */}
        <circle cx="150" cy="230" r="15" fill="#1F2937" />
        <path
          d="M144 230L148 234L156 226"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="200" cy="230" r="15" fill="#1F2937" />
        <path
          d="M194 230L198 234L206 226"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="250" cy="230" r="15" fill="#4F46E5" />
        <path
          d="M244 230L248 234L256 226"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Labels */}
        <text
          x="150"
          y="260"
          fontFamily="sans-serif"
          fontSize="10"
          fontWeight="500"
          fill="#1F2937"
          textAnchor="middle"
        >
          디자인 완료
        </text>
        <text
          x="200"
          y="260"
          fontFamily="sans-serif"
          fontSize="10"
          fontWeight="500"
          fill="#1F2937"
          textAnchor="middle"
        >
          컨텐츠 연동
        </text>
        <text
          x="250"
          y="260"
          fontFamily="sans-serif"
          fontSize="10"
          fontWeight="500"
          fill="#4F46E5"
          textAnchor="middle"
        >
          배포 준비
        </text>
      </svg>
    ),
  };

  return (
    <section className="py-16 md:py-24 bg-main-bg">
      <div className="page-container">
        {/* 상단 타이틀 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            D-Sket으로 퍼스널 브랜드 웹사이트 만들기
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            노션 연동 기반으로 단 몇 분 만에 나만의 브랜딩 사이트를 완성하세요.
          </p>
        </div>

        {/* 카드 2 × 2 그리드 */}
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {steps.map((step) => (
            <motion.article
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: step.id * 0.05 }}
              className="flex flex-col"
            >
              {/* 카드 + 일러스트 */}

              <div className="relative h-80">
                <div className="absolute h-full inset-0">
                  {StepIllustrations[step.id]}
                </div>
              </div>

              {/* 텍스트 영역 */}
              <div className="mt-7 px-8">
                <p className="text-xs md:text-sm text-gray-400 mb-1">
                  {step.label}
                </p>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;
