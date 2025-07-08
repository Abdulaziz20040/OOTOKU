// app/layout.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import "../app/globals.css";
import ClientWrapper from "../components/ClientWrapper";
import { usePathname } from "next/navigation";
import React from "react";
import Followers from "./Foollowers";
import DashboardLayout from "@/app/admin/layouts/layout";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Login yoki register sahifalari bo‘lsa, faqat sahifa chiqadi
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/admin" ||
    pathname === "/chat";

  // Agar auth sahifasi bo‘lsa, faqat content ko‘rsatiladi
  if (isAuthPage) {
    return (
      <html lang="en">
        <body>
          <div className="">{children}</div>
        </body>
      </html>
    );
  }

  // Agar /admin/dashboard sahifasiga kirmoqchi bo'lsa, faqat DashboardLayout ko'rsatiladi
  if (pathname.startsWith("/admin/dashboard")) {
    return (
      <html lang="en">
        <body>
          <DashboardLayout>{children}</DashboardLayout>{" "}
          {/* Faqat dashboard layout */}
        </body>
      </html>
    );
  }

  // Boshqa sahifalar uchun to‘liq layout
  return (
    <html lang="en">
      <body>
        <div
          className="container flex flex-col min-h-screen text-black"
          style={{
            background:
              "linear-gradient(135deg,rgb(233, 233, 233),rgb(244, 244, 244),rgb(229, 229, 229),rgb(246, 245, 245))",
          }}
        >
          <ClientWrapper className="w-full" />
          <div className="flex flex-1 mt-8">
            <Sidebar className="w-1/4 min-w-[250px]" />

            <main className="flex justify-center flex-1 max-h-[87vh] overflow-y-auto scrollbar-hidden">
              <div className="w-[920px]">{children}</div>
            </main>

            <Followers className="w-1/4 min-w-[250px] border-l border-gray-300" />
          </div>
        </div>
      </body>
    </html>
  );
}
