import UserLayoutWrapper from "@/components/wrappers/UserLayoutWraper";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w my-4">
      <UserLayoutWrapper>{children}</UserLayoutWrapper>
    </main>
  );
}
