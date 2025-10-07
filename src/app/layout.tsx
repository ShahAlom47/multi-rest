
import "./globals.css";
import "../style/animatedBorder.css";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white relative">
      
                {children}
      </body>
    </html>
  );
}
