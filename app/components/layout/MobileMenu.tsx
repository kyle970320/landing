"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { create } from "zustand";
import { useState } from "react";
import LogoImage from "../images/logo/D-SKET-LOGO.png";
import Image from "next/image";
import { Dialog } from "@headlessui/react";

// Create a store for managing mobile menu state
export const useMenuStore = create<{ isOpen: boolean }>(() => ({
  isOpen: false,
}));

type MobileMenuProps = {
  navigation: { name: string; href: string }[];
};

export default function MobileMenu({ navigation }: MobileMenuProps) {
  // Get the state from the store
  const [mounted] = useState(true);
  const isOpen = useMenuStore((state) => state.isOpen);

  if (!mounted) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={() => useMenuStore.setState({ isOpen: false })}
      className="lg:hidden"
    >
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
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
          <button
            type="button"
            onClick={() => useMenuStore.setState({ isOpen: false })}
            className="rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 text-right"
                  onClick={() => useMenuStore.setState({ isOpen: false })}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                // href="https://d-sket.notion.site/2553947be60a80aa9669ea600d163062"
                href="https://app.d-sket.io"
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 text-right"
                onClick={() => useMenuStore.setState({ isOpen: false })}
              >
                대시보드
              </Link>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
