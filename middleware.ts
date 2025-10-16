import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getTenantBySubdomain } from "@/lib/helperFunctions/getTenantIdFromDb";

export default withAuth(
  async function middleware(req) {
    // const pathname = req.nextUrl.pathname.toLowerCase();
    const token = req.nextauth?.token;
    const role = token?.role;

    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const subdomain = hostname.includes(".") ? hostname.split(".")[0] : "";

    // 🔹 Identify tenant (skip for super_admin)
    let tenantId: string | null = null;
    if (role !== "super_admin" && subdomain && subdomain !== "www" && subdomain !== "lvh") {
      const tenant = await getTenantBySubdomain(subdomain);
      if (!tenant) {
        return NextResponse.json({ success: false, message: "Invalid tenant subdomain" }, { status: 404 });
      }
      tenantId = tenant.tenantId;

      // inject tenantId into headers for backend API usage
      const res = NextResponse.next();
      if (tenantId) res.headers.set("x-tenant-id", tenantId);
      return res;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const path = req.nextUrl.pathname.toLowerCase();
        const publicRoutes = ["/", "/login", "/register", "/about", "/portfolio"];
        const publicApiRoutes = ["/api/public-data", "/api/blogs"];
        if (publicRoutes.includes(path) || publicApiRoutes.includes(path) || path.startsWith("/api/auth"))
          return true;

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/user/:path*"],
};
