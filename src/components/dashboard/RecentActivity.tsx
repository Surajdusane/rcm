import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, X, UserPlus, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

const recentActivities = [
  {
    id: 1,
    type: 'claim_submitted',
    patient: 'Sarah Johnson',
    amount: '$450.00',
    time: '2 hours ago',
    status: 'submitted'
  },
  {
    id: 2,
    type: 'payment_received',
    patient: 'Michael Chen',
    amount: '$275.50',
    time: '4 hours ago',
    status: 'paid'
  },
  {
    id: 3,
    type: 'claim_rejected',
    patient: 'Emily Davis',
    amount: '$185.00',
    time: '6 hours ago',
    status: 'rejected'
  },
  {
    id: 4,
    type: 'patient_registered',
    patient: 'James Wilson',
    amount: null,
    time: '8 hours ago',
    status: 'new'
  },
  {
    id: 5,
    type: 'appointment_scheduled',
    patient: 'Lisa Anderson',
    amount: null,
    time: '1 day ago',
    status: 'scheduled'
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'claim_submitted': return FileText;
    case 'payment_received': return DollarSign;
    case 'claim_rejected': return X;
    case 'patient_registered': return UserPlus;
    case 'appointment_scheduled': return Calendar;
    default: return FileText;
  }
};

const getActivityText = (activity: typeof recentActivities[0]) => {
  switch (activity.type) {
    case 'claim_submitted':
      return `Claim submitted for ${activity.patient}`;
    case 'payment_received':
      return `Payment received from ${activity.patient}`;
    case 'claim_rejected':
      return `Claim rejected for ${activity.patient}`;
    case 'patient_registered':
      return `New patient registered: ${activity.patient}`;
    case 'appointment_scheduled':
      return `Appointment scheduled for ${activity.patient}`;
    default:
      return `Activity for ${activity.patient}`;
  }
};

const getStatusBadge = (status: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: Record<string, any> = {
    submitted: { variant: 'secondary', text: 'Submitted' },
    paid: { variant: 'default', text: 'Paid' },
    rejected: { variant: 'destructive', text: 'Rejected' },
    new: { variant: 'secondary', text: 'New' },
    scheduled: { variant: 'outline', text: 'Scheduled' }
  };

  const config = variants[status] || { variant: 'outline', text: status };
  return <Badge variant={config.variant}>{config.text}</Badge>;
};

export const RecentActivity = () => {
  return (
    <Card className="h-full bg-background">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg transition-colors">
                <IconComponent className="h-5 w-5 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {getActivityText(activity)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs">{activity.time}</p>
                    {activity.amount && (
                      <p className="text-sm font-semibold text-emerald-400">{activity.amount}</p>
                    )}
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button className="w-full rounded-none">
            View All Activity
          </Button>
        </div>
      </CardContent>        
    </Card>
  );
};