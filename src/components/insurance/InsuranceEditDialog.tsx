
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Insurance {
  id: string;
  providerName: string;
  planType: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coverageTypes: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

interface InsuranceEditDialogProps {
  insurance: Insurance | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (insurance: Insurance) => void;
}

export const InsuranceEditDialog = ({ insurance, isOpen, onClose, onSave }: InsuranceEditDialogProps) => {
  const [formData, setFormData] = useState<Insurance | null>(null);

  useEffect(() => {
    if (insurance) {
      setFormData(insurance);
    }
  }, [insurance]);

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='min-w-[48vw] w-full'>
        <DialogHeader>
          <DialogTitle>Edit Insurance Provider</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap justify-start items-center gap-4 mt-4">
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="providerName">Provider Name *</Label>
            <Input
              id="providerName"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="planType">Plan Type *</Label>
            <Input
              id="planType"
              value={formData.planType}
              onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 sm:w-xs'>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            />
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