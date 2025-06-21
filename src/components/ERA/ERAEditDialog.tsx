"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface ERAEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingERA: ERARecord | null;
  onUpdateERA: (era: ERARecord) => void;
  onSave: () => void;
}

export const ERAEditDialog = ({ 
  isOpen, 
  onClose, 
  editingERA, 
  onUpdateERA, 
  onSave 
}: ERAEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit ERA Record</DialogTitle>
        </DialogHeader>
        {editingERA && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ERA Number</label>
              <Input
                value={editingERA.eraNumber}
                onChange={(e) => onUpdateERA({
                  ...editingERA,
                  eraNumber: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payer Name</label>
              <Input
                value={editingERA.payerName}
                onChange={(e) => onUpdateERA({
                  ...editingERA,
                  payerName: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check Number</label>
              <Input
                value={editingERA.checkNumber}
                onChange={(e) => onUpdateERA({
                  ...editingERA,
                  checkNumber: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check Date</label>
              <Input
                type="date"
                value={editingERA.checkDate}
                onChange={(e) => onUpdateERA({
                  ...editingERA,
                  checkDate: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Amount</label>
              <Input
                type="number"
                step="0.01"
                value={editingERA.totalAmount}
                onChange={(e) => onUpdateERA({
                  ...editingERA,
                  totalAmount: parseFloat(e.target.value) || 0
                })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onSave}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};