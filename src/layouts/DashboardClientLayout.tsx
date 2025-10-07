"use client";



export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="min-h-screen  ">
  {
    children
  }
    </div>
  );
}
