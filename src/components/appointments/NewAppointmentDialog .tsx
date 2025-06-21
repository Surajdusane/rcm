"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  createdAt: string;
}

interface AppointmentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

export const NewAppoinmentDialog = ({ isOpen, onClose, onSave }: AppointmentEditDialogProps) => {
  const [formData, setFormData] = useState<Appointment>({
    id: '',
    patientName: '',
    providerName: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: '',
    status: 'Scheduled',
    notes: '',
    createdAt: '',
  });

  const handleSave = () => {
    if (!formData?.providerName || !formData?.appointmentDate ||!formData?.appointmentTime) {
      toast.error('Please fill in required fields');
      return;
    }

    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="providerName">Provider Name</Label>
            <Input
              id="providerName"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="appointmentDate">Date *</Label>
            <Input
              id="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="appointmentTime">Time *</Label>
            <Input
              id="appointmentTime"
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="appointmentType">Type</Label>
            <Input
              id="appointmentType"
              value={formData.appointmentType}
              onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-y-2 '>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Appointment['status'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-y-2 '>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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