export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col">
          {/* Links - Now at the top */}
          <div className="flex mb-6 space-x-6">
            <a
              href="https://d-sket.notion.site/1f93947be60a80418181f816ea142b56?pvs=73"
              className="text-sm text-gray-600 hover:text-gray-900 py-2 px-1"
            >
              이용약관
            </a>
            <a
              href="https://d-sket.notion.site/1f93947be60a80a1aaa8f4ec5bf1ac3b"
              className="text-sm text-gray-600 hover:text-gray-900 font-semibold py-2 px-1"
            >
              개인정보처리방침
            </a>
          </div>

          {/* Company Info - Left aligned */}
          <div className="text-sm text-gray-600 text-left">
            <p>상호명: (주)데이터스케쳐스 | 대표: 최신범</p>
            <p className="mt-2">본사: 서울시립대로 160 SI STATION1 3층</p>
            <p className="mt-4">
              &copy; 2024 - {new Date().getFullYear()} D-Sket, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
