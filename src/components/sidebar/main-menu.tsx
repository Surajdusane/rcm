"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Calendar, ClipboardList, CreditCard, DollarSign, FileText, LucideProps, Shield, TrendingUp, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const navigation = [
  { name: 'RCM Dashboard', href: '/', icon: BarChart3 },
  { name: 'Patient Registration', href: '/patients', icon: Users },
  { name: 'Insurance Management', href: '/insurance', icon: Shield },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'CPT/ICD Codes', href: '/codes', icon: FileText },
  { name: 'Claims', href: '/claims', icon: ClipboardList },
  { name: 'ERA Viewer', href: '/era', icon: DollarSign },
  { name: 'Payment Posting', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
];

interface ItemProps {
  item: { name: string; href: string; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> };
  isActive: boolean;
  onSelect?: () => void;
}

const Item = ({ item, isActive, onSelect }: ItemProps) => {

  return (
    <TooltipProvider delayDuration={70}>
      <Link prefetch href={item.href} onClick={() => onSelect?.()}>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <div
              className={cn(
                "relative border border-transparent flex size-[40px] items-center md:justify-center",
                "hover:bg-accent hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C] dark:text-[#666666] text-black hover:!text-primary",
                isActive &&
                  "bg-[#F2F1EF] dark:bg-secondary border-[#DCDAD2] dark:border-[#2C2C2C] dark:!text-white",
              )}
            >
              <div className="relative">
                <div className="flex space-x-3 p-0 items-center justify-center pl-2 md:pl-0">
                  <item.icon />
                  <span className="flex md:hidden">{item.name}</span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="px-3 py-1.5 text-xs hidden md:flex items-center gap-1"
            sideOffset={6}
          >
            {item.name}
          </TooltipContent>
        </Tooltip>
      </Link>
    </TooltipProvider>
  );
};

type Props = {
  onSelect?: () => void;
};

export function MainMenu({ onSelect }: Props) {
  const pathname = usePathname();
  const part = pathname?.split("/")[1];

  return (
    <div className="mt-6">
      <nav>
        <div className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive =
              (pathname === "/" && item.href === "/") ||
              (pathname !== "/" && item.href.startsWith(`/${part}`));

            return (
              <Item
                key={item.href}
                item={item}
                isActive={isActive}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      </nav>
    </div>
  );
}