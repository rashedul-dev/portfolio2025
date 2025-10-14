import type { Metadata } from "next";
import DashboardClient from "./DashBoardClient";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "Manage your portfolio content",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

export default function Page() {
  return <DashboardClient></DashboardClient>;
}
