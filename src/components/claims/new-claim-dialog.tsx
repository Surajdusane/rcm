"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Claim {
  id: string;
  patientName: string;
  claimNumber: string;
  serviceDate: string;
  cptCodes: string[];
  totalAmount: string;
  status: 'Draft' | 'Submitted' | 'Paid' | 'Rejected' | 'Pending';
  insuranceProvider: string;
  createdAt: string;
  submittedAt?: string;
  paidAt?: string;
}

interface ClaimEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (claim: Claim) => void;
}

export const NewClaimDialog = ({ isOpen, onClose, onSave }: ClaimEditDialogProps) => {
  const [formData, setFormData] = useState<Claim>({
    id: '',
    patientName: '',
    claimNumber: '',
    serviceDate: '',
    cptCodes: [],
    totalAmount: '',
    status: 'Draft',
    insuranceProvider: '',
    createdAt: '',
    submittedAt: '',
  });


  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Claim</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="serviceDate">Service Date *</Label>
            <Input
              id="serviceDate"
              type="date"
              value={formData.serviceDate}
              onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="totalAmount">Total Amount *</Label>
            <Input
              id="totalAmount"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Claim['status'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};