"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';

interface Stats {
  totalPatients: number;
  pendingClaims: number;
  monthlyRevenue: number;
  collectionRate: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    pendingClaims: 0,
    monthlyRevenue: 0,
    collectionRate: 0
  });

  useEffect(() => {
    // Load stats from localStorage or set demo data
    const savedStats = localStorage.getItem('rcm_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Demo data
      const demoStats = {
        totalPatients: 1247,
        pendingClaims: 89,
        monthlyRevenue: 125000,
        collectionRate: 94.2
      };
      setStats(demoStats);
      localStorage.setItem('rcm_stats', JSON.stringify(demoStats));
    }
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims.toString(),
      change: '-8%',
      changeType: 'positive',
      icon: FileText
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Collection Rate',
      value: `${stats.collectionRate}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200 rounded-none bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold  mb-2">{stat.value}</div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};