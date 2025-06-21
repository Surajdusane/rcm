"use client";

import { NewPatientDialog } from "@/components/patients/new-patientsdialog";
import { PatientEditDialog } from "@/components/patients/PatientEditDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  createdAt: string;
}

const PatientRegistration = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const saved = localStorage.getItem("rcm_patients");
    if (saved) {
      setPatients(JSON.parse(saved));
    } else {
      // Demo data
      const demoPatients: Patient[] = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1985-03-15",
          ssn: "***-**-1234",
          phone: "(555) 123-4567",
          email: "john.doe@email.com",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          insuranceProvider: "Blue Cross Blue Shield",
          policyNumber: "BC123456789",
          groupNumber: "GRP001",
          createdAt: "2023-01-15",
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          dateOfBirth: "1990-07-22",
          ssn: "***-**-5678",
          phone: "(555) 987-6543",
          email: "jane.smith@email.com",
          address: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          insuranceProvider: "Aetna",
          policyNumber: "AET987654321",
          groupNumber: "GRP002",
          createdAt: "2023-02-20",
        },
      ];
      setPatients(demoPatients);
      localStorage.setItem("rcm_patients", JSON.stringify(demoPatients));
    }
  };

  const savePatient = (patient: Patient) => {
    if (!patient.firstName || !patient.lastName || !patient.dateOfBirth) {
      toast.error("Please fill in required fields");
      return;
    }
  
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
  
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem("rcm_patients", JSON.stringify(updatedPatients));
    setShowForm(false);
  };
  

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete this entry?",
    "This action cannot be undone."
  );

  const onDeletePatient = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      const updatedPatients = patients.filter((p) => p.id !== id);
      setPatients(updatedPatients);
      localStorage.setItem("rcm_patients", JSON.stringify(updatedPatients));
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedPatient: Patient) => {
    const updatedPatients = patients.map((p) =>
      p.id === updatedPatient.id ? updatedPatient : p
    );
    setPatients(updatedPatients);
    localStorage.setItem("rcm_patients", JSON.stringify(updatedPatients));
    setShowEditDialog(false);
    setEditingPatient(null);
  };

  return (
    <div>
      <ConfirmationDialog />

      {/* Add New Patient Button + Search */}
      <div className="flex justify-between items-center mt-4">
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm placeholder:text-chart-3"
        />
        <Button onClick={() => setShowForm(true)} className="ml-4">
          + Add New Patient
        </Button>
      </div>

      {/* New Patient Form */}
      <NewPatientDialog 
       isOpen={showForm}
       onClose={() => {
         setShowForm(false);
       }}
       onSave={savePatient}
      />

      {/* Patients List */}
      <Card className="mt-4 bg-background">
        <CardHeader>
          <CardTitle>Registered Patients ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="bg-background/20">
                <CardContent className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                    <div className="flex flex-col">
                      <CardTitle className="font-semibold text-lg mb-1">
                        {patient.firstName} {patient.lastName}
                      </CardTitle>
                      <p className="text-xs text-chart-3">DOB: {patient.dateOfBirth}</p>
                      <p className="text-xs text-chart-3">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">{patient.email}</p>
                      <p className="text-xs text-chart-3 truncate">
                        {patient.address}, {patient.city}, {patient.state}{" "}
                        {patient.zipCode}
                      </p>
                    </div>
                    <div>
                      <Badge variant="default" className="mb-2 rounded-full bg-muted text-muted-foreground">
                        {patient.insuranceProvider || "No Insurance"}
                      </Badge>
                      <p className="text-xs text-chart-3">
                        Policy: {patient.policyNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPatient(patient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePatient(patient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <PatientEditDialog
        patient={editingPatient}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingPatient(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default PatientRegistration;
