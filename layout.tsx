
import "./globals.css";
import Providers from "@/Providers/RootProvider/Providers";
// import Footer from "@/components/Footer";
// import ConditionalWrapper from "@/components/wrappers/ConditionalWrapper";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className="min-h-screen bg-white">
        <Providers>

    

          {children}
          
        </Providers>
      </body>
    </html>
  );
}
