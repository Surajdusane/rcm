"use client";

import { AppointmentEditDialog } from '@/components/appointments/AppointmentEditDialog';
import { NewAppoinmentDialog } from '@/components/appointments/NewAppointmentDialog ';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const saved = localStorage.getItem('rcm_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      const demoAppointments: Appointment[] = [
        {
          id: '1',
          patientName: 'John Doe',
          providerName: 'Dr. Smith',
          appointmentDate: '2024-01-15',
          appointmentTime: '10:00',
          appointmentType: 'Annual Checkup',
          status: 'Scheduled',
          notes: 'Regular checkup appointment',
          createdAt: '2023-12-20'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          providerName: 'Dr. Johnson',
          appointmentDate: '2024-01-16',
          appointmentTime: '14:30',
          appointmentType: 'Follow-up',
          status: 'Completed',
          notes: 'Follow-up for previous treatment',
          createdAt: '2023-12-21'
        }
      ];
      setAppointments(demoAppointments);
      localStorage.setItem('rcm_appointments', JSON.stringify(demoAppointments));
    }
  };

  const saveAppointment = (appointment: Appointment) => {
    if (!appointment.patientName || !appointment.appointmentDate || !appointment.appointmentTime) {
    toast.error('Please fill in required fields');
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: appointment.patientName || '',
      providerName: appointment.providerName || '',
      appointmentDate: appointment.appointmentDate || '',
      appointmentTime: appointment.appointmentTime || '',
      appointmentType: appointment.appointmentType || '',
      status: 'Scheduled',
      notes: appointment.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('rcm_appointments', JSON.stringify(updatedAppointments));
    setShowForm(false);
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this entry?",
    "This action cannot be undone."
  );

  const onDeletePatient = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      const updatedAppointments = appointments.filter((p) => p.id !== id);
      setAppointments(updatedAppointments);
      localStorage.setItem("rcm_appointments", JSON.stringify(updatedAppointments));
    }
  };


  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.providerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'default';
      case 'Completed': return 'default';
      case 'Cancelled': return 'destructive';
      case 'No Show': return 'secondary';
      default: return 'default';
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map(a => 
      a.id === updatedAppointment.id ? updatedAppointment : a
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('rcm_appointments', JSON.stringify(updatedAppointments));
    setShowEditDialog(false);
    setEditingAppointment(null);
  };

  return (
      <div className="space-y-6 mt-4">
        <ConfirmationDialog />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>

        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-transparent">
                  <CardContent className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                      <div>
                        <p className="font-semibold">{appointment.patientName}</p>
                        <p className="text-xs text-chart-3">{appointment.providerName}</p>
                        <p className="text-xs text-chart-3">{appointment.appointmentType}</p>
                      </div>
                      <div>
                        <p className="text-sm">{appointment.appointmentDate}</p>
                        <p className="text-xs text-chart-3">{appointment.appointmentTime}</p>
                      </div>
                      <div>
                        <Badge className='rounded-full' variant={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.notes && (
                          <p className="text-xs text-chart-3 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeletePatient(appointment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <AppointmentEditDialog
          appointment={editingAppointment}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingAppointment(null);
          }}
          onSave={handleSaveEdit}
        />

        <NewAppoinmentDialog 
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
          }}
          onSave={saveAppointment}
        />
      </div>
  );
};

export default Appointments;