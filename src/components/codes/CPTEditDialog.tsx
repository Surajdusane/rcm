"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CPTCode {
  id: string;
  code: string;
  description: string;
  category: string;
  unitPrice: string;
  isActive: boolean;
  createdAt: string;
}

interface CPTEditDialogProps {
  cptCode: CPTCode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cptCode: CPTCode) => void;
}

export const CPTEditDialog = ({ cptCode, isOpen, onClose, onSave }: CPTEditDialogProps) => {
  const [formData, setFormData] = useState<CPTCode | null>(null);

  useEffect(() => {
    if (cptCode) {
      setFormData(cptCode);
    }
  }, [cptCode]);

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
          <DialogTitle>Edit CPT Code</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='flex flex-col gap-y-2'>
            <Label htmlFor="code">CPT Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <Label htmlFor="unitPrice">Unit Price *</Label>
            <Input
              id="unitPrice"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
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