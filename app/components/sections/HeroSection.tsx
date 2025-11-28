"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [isVisible] = useState(true);
  const words = useMemo(() => ["웹사이트", "홈페이지"], []);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    // Simple interval for word cycling
    const wordInterval = setInterval(() => {
      const nextIndex = (wordIndex + 1) % words.length;
      setWordIndex(nextIndex);
      setCurrentWord(words[nextIndex]);
    }, 3000);

    return () => clearInterval(wordInterval);
  }, [wordIndex, words]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const mockupElementVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.6 + custom * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  const pulseAnimation = {
    scale: [1, 1.15, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  return (
    <div className="min-h-screen flex items-center justify-center container mx-auto py-10 px-4 max-w-6xl relative z-10 pointer-events-none">
      <motion.div
        className="flex items-center justify-center"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          variants={itemVariants}
        >
          <motion.div className="mb-4 inline-block" variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-black rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
              노션 연동형 웹빌더 솔루션
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            단{" "}
            <span className="text-black relative">
              3분
              <svg
                className="absolute bottom-2 left-0 w-full"
                viewBox="0 0 120 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </span>{" "}
            만에
            <motion.span
              className="block mt-2 font-light text-5xl md:text-6xl lg:text-7xl text-black dark:text-black"
              variants={itemVariants}
            >
              만드는{" "}
              <motion.span
                className="font-bold text-indigo-600 inline-block"
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [10, 0, 0, -10],
                }}
                transition={{
                  duration: 3,
                  times: [0, 0.2, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
                key={currentWord}
              >
                {currentWord}
              </motion.span>{" "}
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 dark:text-black mb-8"
            variants={itemVariants}
          >
            D-Sket은 노션에서 작성한 콘텐츠를 단 1분 만에
            <br />
            브랜딩 웹사이트로 변환해주는 노코드 솔루션입니다.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
