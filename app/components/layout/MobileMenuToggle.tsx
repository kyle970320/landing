// MobileMenuToggle.tsx
"use client";

import { useMenuStore } from "./MobileMenu";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function MobileMenuToggle() {
  return (
    <button
      type="button"
      onClick={() => useMenuStore.setState({ isOpen: true })}
      className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
    >
      <span className="sr-only">메뉴 열기</span>
      <Bars3Icon aria-hidden="true" className="size-6" />
    </button>
  );
}
