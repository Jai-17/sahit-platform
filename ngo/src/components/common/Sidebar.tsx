"use client";

import Image from "next/image";
import React from "react";
import {
  Award,
  History,
  Home,
  LogOut,
  MessageSquareDot,
  Star,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "@/store/store";
import { closeMobileNav } from "@/store/features/NavigationSlice";
import { Button } from "../ui/button";
import { clearAuth } from "@/store/features/authSlice";

const navItems = [
  { label: "Home", path: "/", icon: <Home size={18} /> },
  {
    label: "Requests",
    path: "/requests",
    icon: <MessageSquareDot size={18} />,
  },
  { label: "History", path: "/history", icon: <History size={18} /> },
  { label: "Feedbacks", path: "/feedbacks", icon: <Star size={18} /> },
  { label: "Profile", path: "/profile", icon: <User size={18} /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isMobileNavOpen = useSelector(
    (state: RootState) => state.navigation.isMobileNavOpen
  );

  function handleLogout() {
    dispatch(clearAuth());
    persistor.pause(); 
    persistor.flush().then(() => {
      persistor.purge();
      localStorage.removeItem("persist:root");
      window.location.reload();
    });
  }

  return (
    <>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => dispatch(closeMobileNav())}
        />
      )}

      <div
        className={cn(
          "fixed flex flex-col z-50 border-r bg-[#F7F8FA] w-64 p-7 justify-between lg:inset-y-0 bottom-0 left-0 backdrop-blur-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 top-0",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <Image
            src="/sahit-logo.png"
            width={170}
            height={50}
            alt="sahit-logo"
            className="mb-12"
          />
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname === item.path ||
                  pathname.startsWith(item.path + "/");

            return (
              <Link
                href={item.path}
                key={item.label}
                className={cn(
                  "flex gap-2 px-4 py-3 mb-6 rounded font-medium text-sm transition",
                  isActive
                    ? "bg-[#8300EA] text-white shadow"
                    : "text-neutral-600 bg-transparent hover:bg-[#8300EA10]"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-70 lg:mt-80">
          <Link
            href="/apply-award"
            className={cn(
              "flex gap-2 text-sm transition px-4 py-3 rounded",
              pathname === "/apply-award"
                ? "bg-neutral-200"
                : "text-neutral-600 bg-transparent hover:bg-neutral-200"
            )}
          >
            <Award size={18} />
            Awards
          </Link>
          <Button
            type="button"
            onClick={handleLogout}
            className="flex gap-2 mt-6 w-full justify-baseline cursor-pointer text-sm text-neutral-600 bg-transparent hover:bg-neutral-200 transition px-4 py-3 rounded"
          >
            <LogOut size={18} className="ml-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
