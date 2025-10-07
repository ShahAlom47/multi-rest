// app/(auth)/login/page.tsx
import { Suspense } from "react";
import Login from "./LogingContent";
import { loginMetadata } from "@/utils/seo/staticMetadata";

export const metadata= loginMetadata;

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
