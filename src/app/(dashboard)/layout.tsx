"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const navigationMap = {
  "/": "RCM Dashboard",
  "/patients": "Patient Registration",
  "/insurance": "Insurance Management",
  "/appointments": "Appointments",
  "/codes": "CPT/ICD Codes",
  "/claims": "Claims",
  "/era": "ERA Viewer",
  "/payments": "Payment Posting",
  "/reports": "Reports",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const queryClient = new QueryClient();
  const title =
    navigationMap[
      path === "/"
        ? "/"
        : (("/" + path.split("/")[1]) as keyof typeof navigationMap)
    ] || "RCM Dashboard";
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="flex flex-1 relative">
          <div className="flex flex-1">
            <div className="flex flex-col overflow-hidden w-full">
              <header className="shadow-sm border-b px-4 h-[70px] flex items-center justify-between flex-row py-4">
                <div className="flex items-center">
                  <SidebarTrigger className="size-9" />
                  <h1 className="text-xl font-medium text-chart-3">{title}</h1>
                </div>
                <Button className="rounded-none" variant={"secondary"}>
                  Demo Mode
                </Button>
              </header>
              <div className="px-4">{children}</div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
