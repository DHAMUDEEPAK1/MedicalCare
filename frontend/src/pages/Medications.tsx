import { useState, useEffect } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { PageTitle, BodyText, SectionTitle } from '../designB/components/DesignBTypography';
import { DesignBSurface } from '../designB/components/DesignBSurface';
import { DashboardSectionHeader } from '../designB/components/DashboardSectionHeader';
import { Pill, Bell, CheckCircle2, AlertCircle, Plus, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  taken: boolean;
  category: string;
}

const DEFAULT_MEDS: Medication[] = [
  {
    id: 1,
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'Once daily',
    time: '09:00',
    taken: true,
    category: 'Heart Health',
  },
  {
    id: 2,
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    time: '08:00',
    taken: true,
    category: 'Diabetes',
  },
  {
    id: 3,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    time: '09:00',
    taken: false,
    category: 'Blood Pressure',
  },
];

export default function Medications() {
  useRequireAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '1',
    time: '',
    category: 'General'
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('userMedications');
    return saved ? JSON.parse(saved) : DEFAULT_MEDS;
  });

  useEffect(() => {
    localStorage.setItem('userMedications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    // Listen for storage changes from other tabs/pages
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'userMedications' && e.newValue) {
        setMedications(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.time) return;

    const medToAdd: Medication = {
      id: Date.now(),
      name: newMed.name,
      dosage: `${newMed.dosage} unit(s)`,
      frequency: 'Custom',
      time: newMed.time,
      taken: false,
      category: newMed.category,
    };

    setMedications([medToAdd, ...medications]);
    setNewMed({ name: '', dosage: '1', time: '', category: 'General' });
    setIsAddOpen(false);
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((med: Medication) => med.id !== id));
  };

  const toggleTaken = (id: number) => {
    setMedications(medications.map((med: Medication) =>
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const filteredMedications = medications.filter((med: Medication) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <PageTitle>Medications</PageTitle>
          <BodyText className="text-muted-foreground text-sm">
            Manage your prescriptions and adherence.
          </BodyText>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your new medication here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Vitamin D3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Select
                  value={newMed.dosage}
                  onValueChange={(val) => setNewMed({ ...newMed, dosage: val })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select dosage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1/2">1/2 Unit</SelectItem>
                    <SelectItem value="1">1 Unit</SelectItem>
                    <SelectItem value="2">2 Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newMed.time}
                  onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newMed.category}
                  onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Supplements"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddMedication}>Save Medication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search your medications..."
          className="pl-10 h-12 rounded-xl bg-muted/20 border-border group-focus-within:border-primary/50 transition-all text-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Adherence Overview */}
      <section className="grid grid-cols-2 gap-4">
        <DesignBSurface variant="elevated" className="p-5 text-center bg-primary/5 border-b-2 border-primary">
          <p className="text-3xl font-black text-primary">
            {Math.round((medications.filter((m: Medication) => m.taken).length / (medications.length || 1)) * 100)}%
          </p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-1">Daily Progress</p>
        </DesignBSurface>
        <DesignBSurface variant="elevated" className="p-5 text-center bg-accent/5 border-b-2 border-accent">
          <p className="text-3xl font-black text-accent">{medications.length}</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-1">Active Meds</p>
        </DesignBSurface>
      </section>

      {/* Today's Schedule */}
      <section className="space-y-4">
        <DashboardSectionHeader title="Today's Schedule" caption="Follow your prescribed timing" />
        <div className="space-y-3">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((med) => (
              <DesignBSurface
                key={med.id}
                className={`flex items-center justify-between p-4 transition-all ${med.taken ? 'opacity-70 grayscale-[0.5]' : 'border-l-4 border-primary'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${med.taken ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Pill className={`h-6 w-6 ${med.taken ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{med.name}</p>
                      {med.taken && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      {med.dosage} • {med.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={med.taken ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => toggleTaken(med.id)}
                    className={`rounded-lg ${med.taken ? 'text-primary font-bold' : 'border-primary text-primary hover:bg-primary/10'}`}
                  >
                    {med.taken ? "Completed" : "Mark Taken"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMedication(med.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </DesignBSurface>
            ))
          ) : (
            <DesignBSurface variant="elevated" className="p-12 text-center bg-muted/20">
              <Pill className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <BodyText className="text-muted-foreground italic">No medications found matching "{searchQuery}"</BodyText>
            </DesignBSurface>
          )}
        </div>
      </section>

      {/* AI Assistant Tip */}
      <DesignBSurface variant="elevated" className="p-5 bg-muted/30 border-dashed border-2">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-accent animate-bounce mt-1" />
          <div className="space-y-1">
            <SectionTitle className="text-sm">Refill Reminder</SectionTitle>
            <BodyText className="text-xs text-muted-foreground">
              Your supply tracking is active. The <b>AI Assistant</b> will notify you when it's time for a refill.
            </BodyText>
          </div>
        </div>
      </DesignBSurface>

      {/* Educational Section */}
      <section className="space-y-4">
        <DashboardSectionHeader title="Health Knowledge" caption="Powered by Medical AI" />
        <DesignBSurface variant="elevated" className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-accent" />
          </div>
          <BodyText className="text-xs leading-relaxed">
            Avoid taking <b>caffeine</b> within 2 hours of your blood pressure medication to ensure maximum effectiveness.
          </BodyText>
        </DesignBSurface>
      </section>
    </div>
  );
}

