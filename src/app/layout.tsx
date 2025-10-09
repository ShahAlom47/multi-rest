
import "./globals.css";
import "../style/animatedBorder.css";
import RootProvider from "@/Providers/RootProvider/Providers";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white relative">
      <RootProvider>
                {children}
      </RootProvider>
      </body>
    </html>
  );
}
