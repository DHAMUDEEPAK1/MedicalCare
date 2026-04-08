import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useMedicalFiles } from '../hooks/useMedicalFiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Trash2, FileText, Search, ShieldCheck, ScanLine, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { validateMedicalDocument, type ValidationResult } from '../utils/medicalDocValidator';
import { toast } from 'sonner';
import { DesignBSurface } from '../designB/components/DesignBSurface';
import { PageTitle, BodyText } from '../designB/components/DesignBTypography';
import { DashboardSectionHeader } from '../designB/components/DashboardSectionHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Report() {
  useRequireAuth();
  const navigate = useNavigate();

  const [uploadType, setUploadType] = useState<'report' | 'prescription'>('report');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewDocumentReq, setViewDocumentReq] = useState<{url: string, type: string, name: string} | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ValidationResult | null>(null);
  const [rejectedFile, setRejectedFile] = useState<{name: string, reason: string} | null>(null);

  const { files, isLoading, uploadFile, deleteFile, downloadFile } = useMedicalFiles();

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setScanResult(null);
      setRejectedFile(null);
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async (forceUpload = false) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    // --- STEP 1: AI Medical Document Validation ---
    if (!forceUpload) {
      setIsScanning(true);
      setScanResult(null);
      try {
        const result = await validateMedicalDocument(selectedFile);
        setScanResult(result);
        setIsScanning(false);

        if (!result.is_medical) {
          setRejectedFile({ name: selectedFile.name, reason: result.reason });
          toast.error('Document rejected — does not appear to be a medical file.');
          return; // Block the upload
        }
      } catch {
        setIsScanning(false);
        toast.error('AI scan failed. Please try again.');
        return;
      }
    }

    // --- STEP 2: Proceed with actual upload ---
    try {
      await uploadFile(selectedFile);
      const isPrescription = uploadType === 'prescription';
      toast.success(isPrescription ? 'Prescription saved & encrypted' : 'Report saved & encrypted');

      const fileName = selectedFile.name;
      setSelectedFile(null);
      setPreviewUrl(null);
      setScanResult(null);
      setRejectedFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      sessionStorage.setItem('initialChatPrompt',
        isPrescription
          ? `I just uploaded a prescription named "${fileName}". Please read it and help me understand the dosage.`
          : `I just uploaded a medical report named "${fileName}". Can you analyze it for me?`
      );
      navigate({ to: '/chat' });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    }
  };

  const handlePreviewFile = async (fileId: string, filename: string) => {
    try {
      setIsPreviewing(true);
      const bytes = await downloadFile(fileId, filename, true);
      if (bytes) {
        let type = 'application/octet-stream';
        const lowerName = filename.toLowerCase();
        if (lowerName.endsWith('.pdf')) type = 'application/pdf';
        else if (lowerName.endsWith('.png')) type = 'image/png';
        else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) type = 'image/jpeg';

        const blob = new Blob([bytes as any], { type });
        const url = URL.createObjectURL(blob);
        setViewDocumentReq({url, type, name: filename});
      }
    } catch (error) {
      toast.error('Could not open preview');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      toast.success('Document deleted successfully');
      setFileToDelete(null);
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <PageTitle>Health Vault</PageTitle>
          <BodyText className="text-muted-foreground">
            Your documents are encrypted and stored securely.
          </BodyText>
        </div>
      </div>

      <DesignBSurface variant="elevated" className="p-6 bg-primary/5 border-l-4 border-primary space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">End-to-End Encryption Active</h3>
            <p className="text-xs text-muted-foreground">Only you can view these files.</p>
          </div>
        </div>
      </DesignBSurface>

      <section className="space-y-4">
        <DashboardSectionHeader title="Upload Document" caption="Reports or Prescriptions" />
        <DesignBSurface className="p-6 space-y-6">
          <div className="flex gap-4 p-1 bg-muted/30 rounded-xl">
            <Button
              variant={uploadType === 'report' ? 'default' : 'ghost'}
              className="flex-1 rounded-lg transition-all"
              onClick={() => setUploadType('report')}
            >
              Medical Report
            </Button>
            <Button
              variant={uploadType === 'prescription' ? 'default' : 'ghost'}
              className="flex-1 rounded-lg transition-all"
              onClick={() => setUploadType('prescription')}
            >
              Prescription
            </Button>
          </div>

          <div
            className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer relative group"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              type="file"
              id="file-input"
              className="hidden"
              onChange={handleFileSelect}
              accept="application/pdf,image/*"
            />
            <div className="space-y-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto transition-all ${
                isScanning ? 'bg-amber-500/20 animate-pulse' :
                scanResult?.is_medical ? 'bg-green-500/20' :
                rejectedFile ? 'bg-red-500/20' :
                'bg-primary/10 group-hover:scale-110'
              }`}>
                {isScanning ? (
                  <ScanLine className="h-8 w-8 text-amber-500 animate-pulse" />
                ) : scanResult?.is_medical ? (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                ) : rejectedFile ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <Upload className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg">
                  {isScanning ? 'Scanning document locally (Private AI)...' :
                   rejectedFile ? `Rejected: ${rejectedFile.name}` :
                   selectedFile ? selectedFile.name :
                   'Choose a file or drag & drop'}
                </p>
                {isScanning ? (
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                    Verified offline — No data sent to external AI servers.
                  </p>
                ) : scanResult?.is_medical ? (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ Verified: {scanResult.document_type} ({Math.round(scanResult.confidence_score * 100)}% confidence)
                  </p>
                ) : rejectedFile ? (
                  <p className="text-sm text-red-500 font-medium">
                    {rejectedFile.reason}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">PDF, JPEG, or PNG up to 10MB</p>
                )}
              </div>
              {selectedFile && !isScanning && (
                <div className="flex items-center gap-3 justify-center flex-wrap">
                  {!rejectedFile ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpload();
                      }}
                      disabled={isLoading || isScanning}
                      className="px-12 h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                      Confirm & Upload
                    </Button>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground w-full text-center">Think the AI made a mistake?</p>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRejectedFile(null);
                          setScanResult(null);
                          handleUpload(true); // Force upload
                        }}
                        className="h-10 rounded-xl text-sm border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                      >
                        Upload Anyway
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setScanResult(null);
                          setRejectedFile(null);
                          const fi = document.getElementById('file-input') as HTMLInputElement;
                          if (fi) fi.value = '';
                        }}
                        className="h-10 rounded-xl text-sm text-destructive"
                      >
                        Remove File
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-inner bg-muted/10">
              <div className="px-4 py-2 bg-muted/30 border-b border-border flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:bg-destructive/10" onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}>Remove</Button>
              </div>
              {selectedFile?.type === 'application/pdf' ? (
                <div 
                  className="p-12 text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setViewDocumentReq({ url: previewUrl, type: 'application/pdf', name: selectedFile.name })}
                >
                  <FileText className="h-12 w-12 mx-auto mb-2 text-primary/40" />
                  <p className="text-sm text-foreground/80 font-semibold">Click to Preview PDF</p>
                  <p className="text-xs text-muted-foreground mt-1">Ready for Upload</p>
                </div>
              ) : (
                <div 
                  className="cursor-pointer group relative"
                  onClick={() => setViewDocumentReq({ url: previewUrl, type: selectedFile.type, name: selectedFile.name })}
                >
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto object-contain transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-xl">
                      Click to Enlarge
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DesignBSurface>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <DashboardSectionHeader title="Your Records" caption="Quick access to all documents" />
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search by filename..."
            className="pl-10 h-12 rounded-xl bg-muted/20 border-border group-focus-within:border-primary/50 transition-all text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <DesignBSurface
                key={file.id}
                className="flex items-center justify-between p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">{file.filename}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {formatDate(file.uploadedAt)} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-xs font-bold text-primary hover:bg-primary/10"
                    onClick={() => handlePreviewFile(file.id, file.filename)}
                    disabled={isPreviewing}
                  >
                    {isPreviewing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'View'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10"
                    onClick={() => setFileToDelete(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </DesignBSurface>
            ))
          ) : (
            <DesignBSurface variant="elevated" className="p-12 text-center bg-muted/20">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <BodyText className="text-muted-foreground italic">No documents found matching "{searchQuery}"</BodyText>
            </DesignBSurface>
          )}
        </div>
      </section>

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              This medical record will be permanently removed from your vault. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fileToDelete && handleDelete(fileToDelete)}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog 
        open={!!viewDocumentReq} 
        onOpenChange={(open) => {
          if (!open && viewDocumentReq) {
            URL.revokeObjectURL(viewDocumentReq.url);
            setViewDocumentReq(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-background">
          <DialogHeader className="p-4 border-b shrink-0 bg-muted/30">
            <DialogTitle className="truncate pr-8">{viewDocumentReq?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-black/5 dark:bg-black/40 flex items-center justify-center p-4">
            {viewDocumentReq?.type.includes('pdf') ? (
              <object 
                data={viewDocumentReq.url} 
                type="application/pdf" 
                className="w-full h-full min-h-[60vh] rounded-xl shadow-lg"
              >
                <div className="flex flex-col flex-1 items-center justify-center text-center p-8">
                  <FileText className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-foreground">Cannot preview PDF natively</p>
                  <p className="text-muted-foreground mb-4">Your browser/device may not support embedded PDFs.</p>
                  <Button asChild>
                    <a href={viewDocumentReq.url} target="_blank" rel="noopener noreferrer">
                      Open PDF externally
                    </a>
                  </Button>
                </div>
              </object>
            ) : (
              <img 
                src={viewDocumentReq?.url} 
                alt="Document Preview" 
                className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-border/50" 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
