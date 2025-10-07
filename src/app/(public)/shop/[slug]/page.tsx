// app/portfolio/[slug]/page.tsx --> ✅ Server Component

import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
console.log(slug)

  return (
    <section className="max-w mx-auto p-2 pt-5">
    details page
    </section>
  );
}
