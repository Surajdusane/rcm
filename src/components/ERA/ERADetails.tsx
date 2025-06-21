"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign } from 'lucide-react';

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

interface ERADetailsProps {
  selectedERA: ERARecord | null;
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

export const ERADetails = ({ selectedERA }: ERADetailsProps) => {
  return (
    <Card className="h-fit bg-transparent">
      <CardHeader>
        <CardTitle>
          {selectedERA ? `ERA Details - ${selectedERA.eraNumber}` : 'Select an ERA to view details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {selectedERA ? (
          <div className="space-y-6">
            {/* ERA Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
              <div>
                <p className="text-sm mb-1 text-chart-3">Payer</p>
                <p className="font-medium">{selectedERA.payerName}</p>
              </div>
              <div>
                <p className="text-sm mb-1 text-chart-3">Check Number</p>
                <p className="font-medium">{selectedERA.checkNumber}</p>
              </div>
              <div>
                <p className="text-sm mb-1 text-chart-3">Check Date</p>
                <p className="font-medium">{selectedERA.checkDate}</p>
              </div>
              <div>
                <p className="text-sm mb-1 text-chart-3">Total Amount</p>
                <p className="font-medium text-emerald-400">
                  ${selectedERA.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Claims Details */}
            <div>
              <h4 className="font-medium mb-4">Claim Details</h4>
              <div className="border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Charged</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Adjustment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedERA.claims.map((claim, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{claim.claimNumber}</p>
                            <p className="text-xs text-chart-3">Service: {claim.serviceDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>{claim.patientName}</TableCell>
                        <TableCell className='flex gap-x-1'>
                          <Badge variant={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                          {claim.reasonCodes.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {claim.reasonCodes.map((code, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {code}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${claim.chargedAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-400">
                          ${claim.paidAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-rose-400">
                          ${claim.adjustmentAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className='text-chart-3'>Select an ERA record to view detailed information</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};