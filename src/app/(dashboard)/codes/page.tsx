"use client";

import { CPTEditDialog } from '@/components/codes/CPTEditDialog';
import { NewCPTEditDialog } from '@/components/codes/new-cpt-diloag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CPTCode {
  id: string;
  code: string;
  description: string;
  category: string;
  unitPrice: string;
  isActive: boolean;
  createdAt: string;
}

const CPTCodes = () => {
  const [cptCodes, setCptCodes] = useState<CPTCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCPTCode, setEditingCPTCode] = useState<CPTCode | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadCPTCodes();
  }, []);

  const loadCPTCodes = () => {
    const saved = localStorage.getItem('rcm_cpt_codes');
    if (saved) {
      setCptCodes(JSON.parse(saved));
    } else {
      const demoCPTCodes: CPTCode[] = [
        {
          id: '1',
          code: '99213',
          description: 'Office/outpatient visit, established patient, level 3',
          category: 'Office Visits',
          unitPrice: '150.00',
          isActive: true,
          createdAt: '2023-01-15'
        },
        {
          id: '2',
          code: '99214',
          description: 'Office/outpatient visit, established patient, level 4',
          category: 'Office Visits',
          unitPrice: '200.00',
          isActive: true,
          createdAt: '2023-01-15'
        },
        {
          id: '3',
          code: '90471',
          description: 'Immunization administration',
          category: 'Immunizations',
          unitPrice: '25.00',
          isActive: true,
          createdAt: '2023-01-15'
        },
        {
          id: '4',
          code: '36415',
          description: 'Collection of venous blood by venipuncture',
          category: 'Laboratory',
          unitPrice: '15.00',
          isActive: true,
          createdAt: '2023-01-15'
        }
      ];
      setCptCodes(demoCPTCodes);
      localStorage.setItem('rcm_cpt_codes', JSON.stringify(demoCPTCodes));
    }
  };

  const saveCPTCode = ( cptCode : CPTCode ) => {
    if (!cptCode.code || !cptCode.description || !cptCode.unitPrice) {
      toast.error('Please fill in required fields');
      return;
    }

    const newCPTCode: CPTCode = {
      id: Date.now().toString(),
      code: cptCode.code || '',
      description: cptCode.description || '',
      category: cptCode.category || '',
      unitPrice: cptCode.unitPrice || '0',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedCPTCodes = [...cptCodes, newCPTCode];
    setCptCodes(updatedCPTCodes);
    localStorage.setItem('rcm_cpt_codes', JSON.stringify(updatedCPTCodes));
    setShowForm(false);
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this entry?",
    "This action cannot be undone."
  );

  const onDeletePatient = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      const updatedCPTCodes = cptCodes.filter((p) => p.id !== id);
      setCptCodes(updatedCPTCodes);
      localStorage.setItem("rcm_cpt_codes", JSON.stringify(updatedCPTCodes));
    }
  };

  const handleEditCPTCode = (cptCode: CPTCode) => {
    setEditingCPTCode(cptCode);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedCPTCode: CPTCode) => {
    const updatedCPTCodes = cptCodes.map(c => 
      c.id === updatedCPTCode.id ? updatedCPTCode : c
    );
    setCptCodes(updatedCPTCodes);
    localStorage.setItem('rcm_cpt_codes', JSON.stringify(updatedCPTCodes));
    setShowEditDialog(false);
    setEditingCPTCode(null);
  };

  const filteredCPTCodes = cptCodes.filter(cptCode =>
    cptCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cptCode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cptCode.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="space-y-4 mt-4">
        <ConfirmationDialog />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search CPT codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add CPT Code
          </Button>
        </div>

        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>CPT Codes ({filteredCPTCodes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCPTCodes.map((cptCode) => (
                <Card key={cptCode.id} className="bg-transparent">
                  <CardContent className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                      <div>
                        <p className="font-semibold ">{cptCode.code}</p>
                        <p className="text-xs text-chart-3">{cptCode.category}</p>
                      </div>
                      <div>
                        <p className="text-sm truncate">{cptCode.description}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-400">${parseFloat(cptCode.unitPrice).toFixed(2)}</p>
                        <Badge className='rounded-full' variant={cptCode.isActive ? 'default' : 'secondary'}>
                          {cptCode.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCPTCode(cptCode)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeletePatient(cptCode.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <CPTEditDialog
          cptCode={editingCPTCode}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingCPTCode(null);
          }}
          onSave={handleSaveEdit}
        />

        <NewCPTEditDialog 
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
          }}
          onSave={saveCPTCode}
        />
      </div>
  );
};

export default CPTCodes;