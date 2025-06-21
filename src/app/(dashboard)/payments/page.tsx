"use client"
import { NewPaymentDialog } from '@/components/payments/new-payment-dialog';
import { PaymentEditDialog } from '@/components/payments/PaymentEditDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { CreditCard, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface Payment {
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

const PaymentPosting = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    const saved = localStorage.getItem('rcm_payments');
    if (saved) {
      setPayments(JSON.parse(saved));
    } else {
      const demoPayments: Payment[] = [
        {
          id: '1',
          patientName: 'John Doe',
          claimNumber: 'CLM001',
          paymentDate: '2024-01-20',
          paymentType: 'Insurance',
          paymentMethod: 'Electronic',
          amount: '140.00',
          referenceNumber: 'REF123456',
          notes: 'Insurance payment via ERA',
          createdAt: '2024-01-20'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          claimNumber: 'CLM002',
          paymentDate: '2024-01-21',
          paymentType: 'Patient',
          paymentMethod: 'Credit Card',
          amount: '25.00',
          referenceNumber: 'CC789012',
          notes: 'Patient copay',
          createdAt: '2024-01-21'
        },
        {
          id: '3',
          patientName: 'Bob Johnson',
          claimNumber: 'CLM003',
          paymentDate: '2024-01-22',
          paymentType: 'Patient',
          paymentMethod: 'Check',
          amount: '50.00',
          checkNumber: '1234',
          notes: 'Patient payment for remaining balance',
          createdAt: '2024-01-22'
        }
      ];
      setPayments(demoPayments);
      localStorage.setItem('rcm_payments', JSON.stringify(demoPayments));
    }
  };

  const savePayment = ( payment : Payment ) => {
    if (!payment.patientName || !payment.amount || !payment.paymentDate) {
      toast.error('Please fill in required fields');
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      patientName: payment.patientName || '',
      claimNumber: payment.claimNumber || '',
      paymentDate: payment.paymentDate || '',
      paymentType: payment.paymentType || 'Patient',
      paymentMethod: payment.paymentMethod || 'Cash',
      amount: payment.amount || '0',
      checkNumber: payment.checkNumber || '',
      referenceNumber: payment.referenceNumber || '',
      notes: payment.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('rcm_payments', JSON.stringify(updatedPayments));
    setShowForm(false);
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this entry?",
    "This action cannot be undone."
  );

  const onDeletePyament = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      const updatedPayments = payments.filter(p => p.id !== id);
      setPayments(updatedPayments);
      localStorage.setItem('rcm_payments', JSON.stringify(updatedPayments));
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedPayment: Payment) => {
    const updatedPayments = payments.map(p => 
      p.id === updatedPayment.id ? updatedPayment : p
    );
    setPayments(updatedPayments);
    localStorage.setItem('rcm_payments', JSON.stringify(updatedPayments));
    setShowEditDialog(false);
    setEditingPayment(null);
  };

  const filteredPayments = payments.filter(payment =>
    payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'Insurance': return 'default';
      case 'Patient': return 'secondary';
      case 'Copay': return 'outline';
      case 'Deductible': return 'outline';
      default: return 'secondary';
    }
  };

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
      <div className="space-y-4 mt-4">
        <ConfirmationDialog />
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className='bg-transparent'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-chart-3 font-semibold">Total Payments</p>
                  <p className="text-2xl font-bold text-emerald-400">${totalPayments.toFixed(2)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card className='bg-transparent'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-chart-3 font-semibold">Insurance Payments</p>
                  <p className="text-2xl font-bold">
                    ${filteredPayments
                      .filter(p => p.paymentType === 'Insurance')
                      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <Badge className='rounded-full' variant="default">Insurance</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-transparent'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-chart-3 font-semibold">Patient Payments</p>
                  <p className="text-2xl font-bold">
                    ${filteredPayments
                      .filter(p => p.paymentType === 'Patient')
                      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <Badge className='rounded-full' variant="secondary">Patient</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post Payment
          </Button>
        </div>

        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>Payment History ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className='bg-transparent'>
                  <CardContent className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="font-semibold">{payment.patientName}</p>
                        <p className="text-xs text-chart-3">{payment.claimNumber}</p>
                        <p className="text-xs text-chart-3">{payment.paymentDate}</p>
                      </div>
                      <div>
                        <Badge className='rounded-full' variant={getPaymentTypeColor(payment.paymentType)}>
                          {payment.paymentType}
                        </Badge>
                        <p className="text-xs text-chart-3 mt-1">{payment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-400">${parseFloat(payment.amount).toFixed(2)}</p>
                        {payment.checkNumber && (
                          <p className="text-xs text-chart-3">Check: {payment.checkNumber}</p>
                        )}
                        {payment.referenceNumber && (
                          <p className="text-xs text-chart-3">Ref: {payment.referenceNumber}</p>
                        )}
                      </div>
                      <div>
                        {payment.notes && (
                          <p className="text-sm text-chart-3 truncate">{payment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPayment(payment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeletePyament(payment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <PaymentEditDialog
          payment={editingPayment}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingPayment(null);
          }}
          onSave={handleSaveEdit}
        />

        <NewPaymentDialog 
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
          }}
          onSave={savePayment}
        />
      </div>
  );
};

export default PaymentPosting;