"use client";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "../images/logo/D-SKET-LOGO.png";
import MobileMenu from "./MobileMenu";
import MobileMenuToggle from "./MobileMenuToggle";

const navigation = [
  // { name: 'About', href: '/about' },
  // { name: 'Blog', href: '#' },
  { name: "Templates", href: "/templates" },
  // { name: 'Showcase', href: '/showcase' },
  { name: "Pricing", href: "/pricing" },
  {
    name: "Guide",
    href: "/guide",
  },
  // { name: 'Contact', href: '/contact' },
];

export default function Header() {
  return (
    <header className="fixed z-100 w-full bg-[rgba(255,255,255,0.5)] border-b border-indigo-100 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-400 via-indigo-600 to-black" />
      <nav
        aria-label="Global"
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">D-SKET</span>
            <Image
              src={LogoImage}
              alt="D-SKET Logo"
              className="h-12 w-auto"
              width={150}
              height={60}
              priority
            />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600 relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
              </Link>
            );
          })}
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <Link
            // href="https://d-sket.notion.site/2553947be60a80aa9669ea600d163062"
            href="https://app.d-sket.io"
            target="_blank"
            className="hidden lg:inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>대시보드</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <MobileMenuToggle />
        </div>
      </nav>
      <MobileMenu navigation={navigation} />
    </header>
  );
}
