"use client";

import { InsuranceEditDialog } from '@/components/insurance/InsuranceEditDialog';
import { NewInsuranceDialog } from '@/components/insurance/new-insuracedialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

const InsuranceManagement = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadInsurances();
  }, []);

  const loadInsurances = () => {
    const saved = localStorage.getItem('rcm_insurances');
    if (saved) {
      setInsurances(JSON.parse(saved));
    } else {
      const demoInsurances: Insurance[] = [
        {
          id: '1',
          providerName: 'Blue Cross Blue Shield',
          planType: 'HMO',
          contactNumber: '1-800-555-0123',
          address: '123 Insurance Way',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coverageTypes: ['Medical', 'Dental', 'Vision'],
          status: 'Active',
          createdAt: '2023-01-15'
        },
        {
          id: '2',
          providerName: 'Aetna',
          planType: 'PPO',
          contactNumber: '1-800-555-0456',
          address: '456 Health Ave',
          city: 'Hartford',
          state: 'CT',
          zipCode: '06103',
          coverageTypes: ['Medical', 'Prescription'],
          status: 'Active',
          createdAt: '2023-02-20'
        }
      ];
      setInsurances(demoInsurances);
      localStorage.setItem('rcm_insurances', JSON.stringify(demoInsurances));
    }
  };

  const saveInsurance = (insurance : Insurance) => {
    if (!insurance.providerName || !insurance.planType) {
      toast.error('Please fill in required fields');
      return;
    }

    const newInsurance: Insurance = {
      id: Date.now().toString(),
      providerName: insurance.providerName || '',
      planType: insurance.planType || '',
      contactNumber: insurance.contactNumber || '',
      address: insurance.address || '',
      city: insurance.city || '',
      state: insurance.state || '',
      zipCode: insurance.zipCode || '',
      coverageTypes: insurance.coverageTypes || [],
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedInsurances = [...insurances, newInsurance];
    setInsurances(updatedInsurances);
    localStorage.setItem('rcm_insurances', JSON.stringify(updatedInsurances));
    setShowForm(false);
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this entry?",
    "This action cannot be undone."
  );

  const onDeletePatient = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      const updatedInsurances = insurances.filter((p) => p.id !== id);
      setInsurances(updatedInsurances);
      localStorage.setItem("rcm_insurances", JSON.stringify(updatedInsurances));
    }
  };

  const handleEditInsurance = (insurance: Insurance) => {
    setEditingInsurance(insurance);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedInsurance: Insurance) => {
    const updatedInsurances = insurances.map(i => 
      i.id === updatedInsurance.id ? updatedInsurance : i
    );
    setInsurances(updatedInsurances);
    localStorage.setItem('rcm_insurances', JSON.stringify(updatedInsurances));
    setShowEditDialog(false);
    setEditingInsurance(null);
  };

  const filteredInsurances = insurances.filter(insurance =>
    insurance.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insurance.planType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="space-y-6 mt-4">
        <ConfirmationDialog />
        <div className="flex  justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search insurance providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Insurance Provider
          </Button>
        </div>

        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>Insurance Providers ({filteredInsurances.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInsurances.map((insurance) => (
                <Card key={insurance.id} className="bg-transparent">
                  <CardContent className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                      <div>
                        <p className="font-semibold">{insurance.providerName}</p>
                        <p className="text-xs text-chart-3">{insurance.planType}</p>
                        <p className="text-xs text-chart-3">{insurance.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm">
                          {insurance.address}, {insurance.city}, {insurance.state} {insurance.zipCode}
                        </p>
                      </div>
                      <div>
                        <Badge className='rounded-full' variant={insurance.status === 'Active' ? 'default' : 'secondary'}>
                          {insurance.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEditInsurance(insurance)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeletePatient(insurance.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <InsuranceEditDialog
          insurance={editingInsurance}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingInsurance(null);
          }}
          onSave={handleSaveEdit}
        />

        <NewInsuranceDialog
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
          }}
          onSave={saveInsurance}
        />
      </div>
  );
};

export default InsuranceManagement;