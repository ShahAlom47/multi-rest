import { getTenantBySubdomain } from "@/lib/helperFunctions/getTenantIdFromDb";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname.toLowerCase();
    const token = req.nextauth.token;
    const role = token?.role;

    // 🔹 Step 1: Host & subdomain extract করা
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0]; // remove port
    const subdomain = hostname.includes(".") ? hostname.split(".")[0] : "";

    // 🟢 Step 2: Tenant detect & validate
    // যদি subdomain থাকে (যেমন rest1.lvh.me বা rest1.orders.com)
    if (subdomain && subdomain !== "www" && subdomain !== "lvh") {
      const tenant = await getTenantBySubdomain(subdomain);
      if (!tenant) {
        // ❌ যদি tenant না পাওয়া যায় → 404
        return NextResponse.json(
          { success: false, message: "Invalid tenant subdomain" },
          { status: 404 }
        );
      }

      // ✅ tenantId inject করা headers-এ backend API usage-এর জন্য
      const res = NextResponse.next();
      res.headers.set("x-tenant-id", tenant.tenantId);
      return res;
    }

    // 🟡 Step 3: PUBLIC routes
    const publicRoutes = ["/", "/login", "/register", "/about", "/portfolio"];
    const publicApiRoutes = ["/api/public-data", "/api/blogs"];
    if (
      publicRoutes.includes(pathname) ||
      publicApiRoutes.includes(pathname) ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // 🔴 Step 4: Unauthenticated users redirect
    if (!token) {
      const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?redirect=${redirectTo}`, req.url)
      );
    }

    // 🧠 Step 5: Role-based access control
    const adminApiRoutes = [
      "/api/orders/allOrders",
      "/api/portfolio/updatePortfolio",
    ];

    // ✅ Admin dashboard & admin API
    if ((pathname.startsWith("/dashboard/admin") || adminApiRoutes.includes(pathname)) && role === "admin") {
      return NextResponse.next();
    }

    // ✅ User dashboard & user API (user or admin)
    if (
      (pathname.startsWith("/dashboard/user") ||
        pathname.startsWith("/api/user") ||
        pathname.startsWith("/user")) &&
      (role === "user" || role === "admin")
    ) {
      return NextResponse.next();
    }

    // ✅ Common dashboard access
    if (pathname === "/dashboard" && (role === "admin" || role === "user")) {
      return NextResponse.next();
    }

    // ❌ Step 6: Unauthorized fallback
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  },
  {
    callbacks: {
      // 🔹 Step 7: Authorized callback
      authorized({ token, req }) {
        const path = req.nextUrl.pathname.toLowerCase();

        const publicRoutes = ["/", "/login", "/register", "/about", "/portfolio"];
        const publicApiRoutes = ["/api/public-data", "/api/blogs"];

        // ✅ Public access allowed
        if (
          publicRoutes.includes(path) ||
          publicApiRoutes.includes(path) ||
          path.startsWith("/api/auth")
        ) {
          return true;
        }

        // ✅ Private access only if token exists
        return !!token;
      },
    },
  }
);

// ✅ Middleware active for dashboard + API + user routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/user/:path*"],
};
