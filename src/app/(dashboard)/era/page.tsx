"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import { ERAList } from '@/components/ERA/ERAList';
import { ERADetails } from '@/components/ERA/ERADetails';
import { ERAEditDialog } from '@/components/ERA/ERAEditDialog';

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

const ERA = () => {
  const [eraRecords, setEraRecords] = useState<ERARecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedERA, setSelectedERA] = useState<ERARecord | null>(null);
  const [editingERA, setEditingERA] = useState<ERARecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadERARecords();
  }, []);

  const loadERARecords = () => {
    const saved = localStorage.getItem('rcm_era_records');
    if (saved) {
      setEraRecords(JSON.parse(saved));
    } else {
      const demoERARecords: ERARecord[] = [
        {
          id: '1',
          eraNumber: 'ERA001',
          payerName: 'Blue Cross Blue Shield',
          checkNumber: 'CHK123456',
          checkDate: '2024-01-20',
          totalAmount: 1250.00,
          claimsCount: 5,
          status: 'Processed',
          claims: [
            {
              claimNumber: 'CLM001',
              patientName: 'John Doe',
              serviceDate: '2024-01-15',
              chargedAmount: 175.00,
              paidAmount: 140.00,
              adjustmentAmount: 35.00,
              status: 'Paid',
              reasonCodes: ['CO-45']
            },
            {
              claimNumber: 'CLM002',
              patientName: 'Jane Smith',
              serviceDate: '2024-01-16',
              chargedAmount: 200.00,
              paidAmount: 200.00,
              adjustmentAmount: 0.00,
              status: 'Paid',
              reasonCodes: []
            }
          ],
          createdAt: '2024-01-20'
        },
        {
          id: '2',
          eraNumber: 'ERA002',
          payerName: 'Aetna',
          checkNumber: 'CHK789012',
          checkDate: '2024-01-22',
          totalAmount: 850.00,
          claimsCount: 3,
          status: 'Processed',
          claims: [
            {
              claimNumber: 'CLM003',
              patientName: 'Bob Johnson',
              serviceDate: '2024-01-17',
              chargedAmount: 300.00,
              paidAmount: 0.00,
              adjustmentAmount: 300.00,
              status: 'Denied',
              reasonCodes: ['CO-97', 'CO-16']
            }
          ],
          createdAt: '2024-01-22'
        }
      ];
      setEraRecords(demoERARecords);
      localStorage.setItem('rcm_era_records', JSON.stringify(demoERARecords));
    }
  };

  const handleEditERA = (era: ERARecord) => {
    setEditingERA({ ...era });
    setIsEditDialogOpen(true);
  };

  const handleSaveERA = () => {
    if (editingERA) {
      const updatedRecords = eraRecords.map(record => 
        record.id === editingERA.id ? editingERA : record
      );
      setEraRecords(updatedRecords);
      localStorage.setItem('rcm_era_records', JSON.stringify(updatedRecords));
      
      if (selectedERA?.id === editingERA.id) {
        setSelectedERA(editingERA);
      }
      
      setIsEditDialogOpen(false);
      setEditingERA(null);
    }
  };

  const filteredERARecords = eraRecords.filter(era =>
    era.eraNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    era.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    era.checkNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="space-y-4 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ERA records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Import ERA File
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ERAList
            eraRecords={filteredERARecords}
            selectedERA={selectedERA}
            onSelectERA={setSelectedERA}
            onEditERA={handleEditERA}
          />

          <ERADetails selectedERA={selectedERA} />
        </div>

        <ERAEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          editingERA={editingERA}
          onUpdateERA={setEditingERA}
          onSave={handleSaveERA}
        />
      </div>
  );
};

export default ERA;