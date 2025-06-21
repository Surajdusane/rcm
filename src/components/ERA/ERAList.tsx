"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Edit } from 'lucide-react';

interface ERARecord {
  id: string;
  eraNumber: string;
  payerName: string;
  checkNumber: string;
  checkDate: string;
  totalAmount: number;
  claimsCount: number;
  status: 'Processed' | 'Pending' | 'Error';
  claims: ERAClaim[];
  createdAt: string;
}

interface ERAClaim {
  claimNumber: string;
  patientName: string;
  serviceDate: string;
  chargedAmount: number;
  paidAmount: number;
  adjustmentAmount: number;
  status: 'Paid' | 'Denied' | 'Partial';
  reasonCodes: string[];
}

interface ERAListProps {
  eraRecords: ERARecord[];
  selectedERA: ERARecord | null;
  onSelectERA: (era: ERARecord) => void;
  onEditERA: (era: ERARecord) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processed': return 'default';
    case 'Pending': return 'outline';
    case 'Error': return 'destructive';
    case 'Paid': return 'default';
    case 'Denied': return 'destructive';
    case 'Partial': return 'outline';
    default: return 'secondary';
  }
};

export const ERAList = ({ eraRecords, selectedERA, onSelectERA, onEditERA }: ERAListProps) => {
  return (
    <Card className="h-fit bg-transparent">
      <CardHeader>
        <CardTitle>ERA Records ({eraRecords.length})</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-3">
          {eraRecords.map((era) => (
            <Card
              key={era.id}
              className={`bg-transparent cursor-pointer transition-colors ${
                selectedERA?.id === era.id ? 'bg-sidebar-accent/20' : ''
              }`}
              onClick={() => onSelectERA(era)}
            >
              <CardContent className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="font-semibold">{era.eraNumber}</p>
                    <p className="text-xs text-chart-3">{era.payerName}</p>
                  </div>
                  <div className="text-sm">
                    <p className='text-xs text-chart-4'>Check: {era.checkNumber}</p>
                    <p className='text-xs text-chart-4'>Date: {era.checkDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className='rounded-full' variant={getStatusColor(era.status)}>
                      {era.status}
                    </Badge>
                    <Badge variant={"secondary"} className="text-xs rounded-full">
                      {era.claimsCount} claims
                    </Badge>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-semibold text-emerald-400">
                    ${era.totalAmount.toFixed(2)}
                  </p>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditERA(era);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};