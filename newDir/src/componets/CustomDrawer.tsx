"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";

interface DrawerProps {
  trigger: React.ReactNode; // ✅ trigger হিসাবে button বা icon
  children: React.ReactNode;
  className?: string;
  title:string;
  direction?: "left" | "right" | "top" | "bottom"; // ✅ drawer এর দিক
}

const CustomDrawer = ({ trigger, children,title, className ,direction }: DrawerProps) => {
  return (
    <Drawer direction={direction || "right"}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
       <DrawerContent direction={direction || "right"} className={className  }>
        <DrawerTitle className="text-lg  px-4  border-b-2 border-red-500 mb-0  py-1">
         {title}
        </DrawerTitle>
        
        <div className=" w-full">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
