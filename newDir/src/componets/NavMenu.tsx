"use client";
import { HiOutlineDotsVertical, HiOutlineFolderDownload } from "react-icons/hi";
import CustomDrawer from "./CustomDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoHistory } from "react-icons/go";
import WatchHistory from "./WatchHistory";
import DownloadHistory from "./DownloadHistory";

const NavMenu = () => {
  return (
    <div>
      <CustomDrawer
        className="lg:w-[30%] md:w-[40%] w-[60%]  "
        title="History"
        trigger={
          <button className="text-xl hover:scale-110 ">
            <HiOutlineDotsVertical />
          </button>
        }
      >
        <Tabs defaultValue="account" className="w-full px-2">
          <TabsList className=" w-full justify-start pt-0 -mt-[2px] bg-transparent space-x-1">
            <TabsTrigger
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-200  rounded-t-none text-gray-800 flex items-center gap-2 font-normal"
              value="account"
            >
              <GoHistory /> Watch
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-200  rounded-t-none text-gray-800 flex items-center gap-2 font-normal"
              value="password"
            >
              {" "}
              <HiOutlineFolderDownload />
              Download
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <WatchHistory />
          </TabsContent>
          <TabsContent value="password">
            <DownloadHistory />
          </TabsContent>
        </Tabs>
      </CustomDrawer>
    </div>
  );
};

export default NavMenu;
