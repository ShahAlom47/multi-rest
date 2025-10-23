
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";







const Home = async () => {
 

  return (
    <div className="min-h-screen ">
      <Navbar />
   

      <div className="flex justify-center items-center h-full">
        <h1 className="text-4xl font-bold">Home Page</h1>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Home;

