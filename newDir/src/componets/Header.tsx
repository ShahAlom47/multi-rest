import Image from "next/image";
import logo from "../assets/logo/Tube.png";
import SearchBox from "./SearchBox";
// import DownloadDropDown from "./DownloadDropDown";
import NavMenu from "./NavMenu";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-white shadow-md px-4 py-2 gap-2   ">
   <Link href="/" className="flex items-center ">
      <Image className="lg:w-20 md:w-18 w-16 h-auto" src={logo} alt="logo"></Image>
    </Link>


      <div className=" flex-1  w-6/12 mx-2"><SearchBox></SearchBox></div>
      <div className="flex items-center space-x-4">
        {/* <DownloadDropDown></DownloadDropDown> */}
        <NavMenu></NavMenu>
      </div>
    </div>
  );
};

export default Header;
