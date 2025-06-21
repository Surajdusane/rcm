"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Download, FileText, PieChart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ReportData {
  claimsByStatus: { name: string; value: number; color: string }[];
  monthlyRevenue: { month: string; revenue: number }[];
  agedReceivables: { range: string; amount: string; count: number }[];
  summaryStats: {
    totalRevenue: number;
    totalClaims: number;
    collectionRate: number;
    averageReimbursement: number;
  };
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<string>('summary');

  useEffect(() => {
    generateReportData();
  }, []);

  const generateReportData = () => {
    // In a real app, this would fetch data from various sources
    const claims = JSON.parse(localStorage.getItem('rcm_claims') || '[]');
    const payments = JSON.parse(localStorage.getItem('rcm_payments') || '[]');
    
    // Calculate claims by status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCounts = claims.reduce((acc: any, claim: any) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {});

    const claimsByStatus = [
      { name: 'Submitted', value: statusCounts.Submitted || 0, color: '#3b82f6' },
      { name: 'Paid', value: statusCounts.Paid || 0, color: '#10b981' },
      { name: 'Rejected', value: statusCounts.Rejected || 0, color: '#ef4444' },
      { name: 'Draft', value: statusCounts.Draft || 0, color: '#6b7280' },
      { name: 'Pending', value: statusCounts.Pending || 0, color: '#f59e0b' }
    ];

    // Generate monthly revenue data (demo data)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 125000 },
      { month: 'Feb', revenue: 135000 },
      { month: 'Mar', revenue: 145000 },
      { month: 'Apr', revenue: 155000 },
      { month: 'May', revenue: 148000 },
      { month: 'Jun', revenue: 162000 }
    ];

    // Generate aged receivables (demo data)
    const agedReceivables = [
      { range: '0-30 days', amount: '45000', count: 25 },
      { range: '31-60 days', amount: '28000', count: 18 },
      { range: '61-90 days', amount: '15000', count: 12 },
      { range: '90+ days', amount: '8000', count: 8 }
    ];

    // Calculate summary stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRevenue = payments.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount), 0);
    const totalClaims = claims.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paidClaims = claims.filter((claim: any) => claim.status === 'Paid').length;
    const collectionRate = totalClaims > 0 ? (paidClaims / totalClaims) * 100 : 0;
    const averageReimbursement = paidClaims > 0 ? totalRevenue / paidClaims : 0;

    setReportData({
      claimsByStatus,
      monthlyRevenue,
      agedReceivables,
      summaryStats: {
        totalRevenue,
        totalClaims,
        collectionRate,
        averageReimbursement
      }
    });
  };

  const reportTypes = [
    { id: 'summary', name: 'Summary Dashboard', icon: BarChart3 },
    { id: 'claims', name: 'Claims Analysis', icon: PieChart },
    { id: 'revenue', name: 'Revenue Report', icon: TrendingUp },
    { id: 'receivables', name: 'Aged Receivables', icon: FileText }
  ];

  const renderSummaryReport = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className='bg-transparent'>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-chart-3">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-400">
                ${reportData?.summaryStats.totalRevenue.toFixed(2)}
              </p>
              <Badge variant="default" className="mt-2">+12% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-transparent'>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-chart-3">Total Claims</p>
              <p className="text-2xl font-bold">{reportData?.summaryStats.totalClaims}</p>
              <Badge variant="secondary" className="mt-2">+5% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-transparent'>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-chart-3">Collection Rate</p>
              <p className="text-2xl font-bold">
                {reportData?.summaryStats.collectionRate.toFixed(1)}%
              </p>
              <Badge variant="default" className="mt-2">+2.1% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-transparent'>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-chart-3">Avg Reimbursement</p>
              <p className="text-2xl font-bold">
                ${reportData?.summaryStats.averageReimbursement.toFixed(2)}
              </p>
              <Badge variant="secondary" className="mt-2">+8% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData?.monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#212121" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart data={reportData?.claimsByStatus}>
                  {reportData?.claimsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAgedReceivables = () => (
    <Card className='bg-transparent'>
      <CardHeader>
        <CardTitle>Aged Receivables Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportData?.agedReceivables.map((item, index) => (
            <Card key={index} className="bg-transparent">
             <CardContent className="flex justify-between items-start">
             <div>
                <p className="font-medium">{item.range}</p>
                <p className="text-sm text-chart-3">{item.count} claims</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${item.amount.toLocaleString()}</p>
                <p className="text-sm text-chart-3">
                  {((parseFloat(item.amount) / reportData.summaryStats.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
             </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
      <div className="space-y-4 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((report) => (
              <Button
                key={report.id}
                variant={selectedReport === report.id ? 'default' : 'outline'}
                onClick={() => setSelectedReport(report.id)}
                className="flex items-center gap-2"
              >
                <report.icon className="h-4 w-4" />
                {report.name}
              </Button>
            ))}
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {reportData && (
          <>
            {selectedReport === 'summary' && renderSummaryReport()}
            {selectedReport === 'receivables' && renderAgedReceivables()}
            {selectedReport === 'claims' && (
              <Card className='bg-transparent'>
                <CardHeader>
                  <CardTitle>Claims Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-chart-3">Claims analysis report coming soon...</p>
                </CardContent>
              </Card>
            )}
            {selectedReport === 'revenue' && (
              <Card className='bg-transparent'>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-chart-3">Revenue analysis report coming soon...</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

  );
};

export default Reports;