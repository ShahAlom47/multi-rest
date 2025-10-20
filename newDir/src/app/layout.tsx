import type { Metadata } from "next";
import "./globals.css";
import Header from "@/componets/Header";
import Provider from "@/Providers/Provider";
import Footer from "@/componets/Footer";

export const metadata: Metadata = {
  title: "TubeNight",
  description: "Youtube Video downloader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Header />
         <div className=" min-h-[70vh]">
           {children}
         </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
