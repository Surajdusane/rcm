"use client";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <main className="overflow-y-auto py-4 w-full">
      <div className="w-full space-y-6">
        <DashboardStats />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
          <div className="xl:col-span-2 w-full">
            <DashboardCharts />
          </div>
          <div className="w-full">
            <RecentActivity />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
