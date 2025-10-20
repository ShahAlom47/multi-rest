import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import CustomDrawer from "./CustomDrawer";

const DownloadDropDown = () => {
  return (
    <div>
      <CustomDrawer
        className="lg:w-[30%] md:w-[40%] w-[60%]"
        title="Download"
        trigger={
          <button className="text-xl hover:scale-110 ">
            <MdOutlineFileDownload />
          </button>
        }
      >
        <h1 className="text-lg font-bold">Drawer Content</h1>
        <p>This is the drawer body.</p>
      </CustomDrawer>
    </div>
  );
};

export default DownloadDropDown;
