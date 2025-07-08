import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setIsMobileNavOpen } from "@/store/features/NavigationSlice";
import { MenuIcon } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.navigation.isMobileNavOpen
  );

  return (
    <header className="border-b backdrop-blur-xl top-0 z-20">
      <div className="flex items-center justify-between px-4 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setIsMobileNavOpen(!isOpen))}
            className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="flex gap-2 items-baseline">
            <p className="text-neutral-700 font-semibold">Good Morning,</p>
            <p className="text-xl font-semibold text-[#8300EA]">John Doe</p>
          </div>
        </div>

        <div className="flex items-center">
        </div>
      </div>
    </header>
  );
};

export default Header;
