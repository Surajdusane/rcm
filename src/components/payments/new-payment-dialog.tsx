"use client"

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Payment {
  id: string;
  patientName: string;
  claimNumber: string;
  paymentDate: string;
  paymentType: 'Insurance' | 'Patient' | 'Copay' | 'Deductible';
  paymentMethod: 'Check' | 'Cash' | 'Credit Card' | 'Electronic';
  amount: string;
  checkNumber?: string;
  referenceNumber?: string;
  notes: string;
  createdAt: string;
}

interface PaymentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Payment) => void;
}

export const NewPaymentDialog = ({ isOpen, onClose, onSave }: PaymentEditDialogProps) => {
  const [formData, setFormData] = useState<Payment>({
    id: '',
    patientName: '',
    claimNumber: '',
    paymentDate: '',
    paymentType: 'Patient',
    paymentMethod: 'Cash',
    amount: '',
    checkNumber: '',
    referenceNumber: '',
    notes: '',
    createdAt: '',
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
          <DialogTitle>Edit Payment</DialogTitle>
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
            <Label htmlFor="claimNumber">Claim Number</Label>
            <Input
              id="claimNumber"
              value={formData.claimNumber}
              onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label>Payment Type</Label>
            <Select value={formData.paymentType} onValueChange={(value) => setFormData({ ...formData, paymentType: value as Payment['paymentType'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Patient">Patient</SelectItem>
                <SelectItem value="Copay">Copay</SelectItem>
                <SelectItem value="Deductible">Deductible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label>Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as Payment['paymentMethod'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Electronic">Electronic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="checkNumber">Check Number</Label>
            <Input
              id="checkNumber"
              value={formData.checkNumber || ''}
              onChange={(e) => setFormData({ ...formData, checkNumber: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              value={formData.referenceNumber || ''}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};