"use client";

import { ClaimEditDialog } from '@/components/claims/ClaimEditDialog';
import { NewClaimDialog } from '@/components/claims/new-claim-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface Claim {
  id: string;
  patientName: string;
  claimNumber: string;
  serviceDate: string;
  cptCodes: string[];
  totalAmount: string;
  status: 'Draft' | 'Submitted' | 'Paid' | 'Rejected' | 'Pending';
  insuranceProvider: string;
  createdAt: string;
  submittedAt?: string;
  paidAt?: string;
}

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = () => {
    const saved = localStorage.getItem('rcm_claims');
    if (saved) {
      setClaims(JSON.parse(saved));
    } else {
      const demoClaims: Claim[] = [
        {
          id: '1',
          patientName: 'John Doe',
          claimNumber: 'CLM001',
          serviceDate: '2024-01-15',
          cptCodes: ['99213', '90471'],
          totalAmount: '175.00',
          status: 'Paid',
          insuranceProvider: 'Blue Cross Blue Shield',
          createdAt: '2024-01-15',
          submittedAt: '2024-01-16',
          paidAt: '2024-01-20'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          claimNumber: 'CLM002',
          serviceDate: '2024-01-16',
          cptCodes: ['99214'],
          totalAmount: '200.00',
          status: 'Submitted',
          insuranceProvider: 'Aetna',
          createdAt: '2024-01-16',
          submittedAt: '2024-01-17'
        },
        {
          id: '3',
          patientName: 'Bob Johnson',
          claimNumber: 'CLM003',
          serviceDate: '2024-01-17',
          cptCodes: ['36415'],
          totalAmount: '15.00',
          status: 'Draft',
          insuranceProvider: 'Medicare',
          createdAt: '2024-01-17'
        }
      ];
      setClaims(demoClaims);
      localStorage.setItem('rcm_claims', JSON.stringify(demoClaims));
    }
  };

  const saveClaim = ( claim : Claim ) => {
    if (!claim.patientName || !claim.serviceDate || !claim.totalAmount) {
      toast.error('Please fill in required fields');
      return;
    }

    const newClaim: Claim = {
      id: Date.now().toString(),
      patientName: claim.patientName || '',
      claimNumber: `CLM${String(claims.length + 1).padStart(3, '0')}`,
      serviceDate: claim.serviceDate || '',
      cptCodes: claim.cptCodes || [],
      totalAmount: claim.totalAmount || '',
      status: 'Draft',
      insuranceProvider: claim.insuranceProvider || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedClaims = [...claims, newClaim];
    setClaims(updatedClaims);
    localStorage.setItem('rcm_claims', JSON.stringify(updatedClaims));
    setShowForm(false);
  };

  const updateClaimStatus = (id: string, newStatus: Claim['status']) => {
    const updatedClaims = claims.map(claim => {
      if (claim.id === id) {
        const updates: Partial<Claim> = { status: newStatus };
        if (newStatus === 'Submitted') {
          updates.submittedAt = new Date().toISOString().split('T')[0];
        } else if (newStatus === 'Paid') {
          updates.paidAt = new Date().toISOString().split('T')[0];
        }
        return { ...claim, ...updates };
      }
      return claim;
    });
    setClaims(updatedClaims);
    localStorage.setItem('rcm_claims', JSON.stringify(updatedClaims));
  };

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this entry?",
    "This action cannot be undone."
  );

  const onDeletePatient = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      const updatedClaims = claims.filter((p) => p.id !== id);
      setClaims(updatedClaims);
      localStorage.setItem("rcm_claims", JSON.stringify(updatedClaims));
    }
  };

  const filteredClaims = claims.filter(claim =>
    claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'secondary';
      case 'Submitted': return 'default';
      case 'Paid': return 'default';
      case 'Rejected': return 'destructive';
      case 'Pending': return 'outline';
      default: return 'secondary';
    }
  };

  const handleEditClaim = (claim: Claim) => {
    setEditingClaim(claim);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedClaim: Claim) => {
    const updatedClaims = claims.map(c => 
      c.id === updatedClaim.id ? updatedClaim : c
    );
    setClaims(updatedClaims);
    localStorage.setItem('rcm_claims', JSON.stringify(updatedClaims));
    setShowEditDialog(false);
    setEditingClaim(null);
  };

  return (
      <div className="space-y-4 mt-4">
        <ConfirmationDialog />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Claim
          </Button>
        </div>

        <Card className='bg-transparent'>
          <CardHeader>
            <CardTitle>Claims ({filteredClaims.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.id} className="p-4 border bg-transparent">
                  <CardContent className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="font-semibold ">{claim.claimNumber}</p>
                        <p className="text-xs text-chart-3">{claim.patientName}</p>
                        <p className="text-xs text-chart-3">{claim.serviceDate}</p>
                      </div>
                      <div>
                        <p className="text-sm ">{claim.insuranceProvider}</p>
                        <p className="text-xs text-chart-3">CPT: {claim.cptCodes.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-400">${parseFloat(claim.totalAmount).toFixed(2)}</p>
                        <Badge className='rounded-full' variant={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <div className="flex gap-x-2">
                        {claim.status === 'Draft' && (
                          <Button
                            size="smm"
                            variant={"secondary"}
                            onClick={() => updateClaimStatus(claim.id, 'Submitted')}
                          >
                            Submit
                          </Button>
                        )}
                        {claim.status === 'Submitted' && (
                          <>
                            <Button
                              size="smm"
                              variant={"secondary"}
                              onClick={() => updateClaimStatus(claim.id, 'Paid')}
                            >
                              Mark Paid
                            </Button>
                            <Button
                              size="smm"
                              variant="destructive"
                              onClick={() => updateClaimStatus(claim.id, 'Rejected')}
                            >
                              Mark Rejected
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClaim(claim)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeletePatient(claim.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <ClaimEditDialog
          claim={editingClaim}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingClaim(null);
          }}
          onSave={handleSaveEdit}
        />

        <NewClaimDialog 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={saveClaim}
        />
      </div>
  );
};

export default Claims;