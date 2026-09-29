import { getDashboardData } from "@/lib/dashboard-data";
import DashboardClient from "./dashboard-client";

export const revalidate = 300;

export default async function Home() {
  const data = await getDashboardData();

  return <DashboardClient data={data} />;
}
