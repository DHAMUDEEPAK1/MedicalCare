import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useMedicalFiles } from '../hooks/useMedicalFiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Trash2, FileText, Search, ShieldCheck } from 'lucide-react';
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

export default function Report() {
  useRequireAuth();
  const navigate = useNavigate();

  const [uploadType, setUploadType] = useState<'report' | 'prescription'>('report');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const { files, isLoading, uploadFile, deleteFile, downloadFile } = useMedicalFiles();

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      await uploadFile(selectedFile);
      const isPrescription = uploadType === 'prescription';
      toast.success(isPrescription ? 'Prescription saved & encrypted' : 'Report saved & encrypted');

      const fileName = selectedFile.name;
      setSelectedFile(null);
      setPreviewUrl(null);
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
        // Fix for the TypeScript error: type casting to any to bypass the BlobPart check if it fails
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
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
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-bold text-lg">
                  {selectedFile ? selectedFile.name : 'Choose a file or drag & drop'}
                </p>
                <p className="text-sm text-muted-foreground">PDF, JPEG, or PNG up to 10MB</p>
              </div>
              {selectedFile && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                  Confirm & Upload
                </Button>
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
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-primary/40" />
                  <p className="text-sm text-muted-foreground">PDF Document Ready</p>
                </div>
              ) : (
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto object-contain" />
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
    </div>
  );
}
