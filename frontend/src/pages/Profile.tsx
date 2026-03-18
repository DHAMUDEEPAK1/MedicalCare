import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DesignBSurface } from '../designB/components/DesignBSurface';
import { PageTitle, SectionTitle, BodyText } from '../designB/components/DesignBTypography';
import { User, Mail, Phone, Calendar, Droplet, AlertCircle, UserCircle, Settings, LogOut, Loader2, Lock, Camera, Mic, Sparkles } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from '@tanstack/react-router';
import { signOut, updatePassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { loadSession, clearSession } from '../auth/session';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        const session = loadSession();
        if (session && session.type === 'guest') {
          setProfile({ isGuest: true, name: 'Guest User' });
        }
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile({
            name: user.displayName || 'User',
            email: user.email,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setFormData({
      name: profile?.name || auth.currentUser?.displayName || '',
      phone: profile?.phone || '',
      dateOfBirth: profile?.dateOfBirth || '',
      bloodType: profile?.bloodType || '',
      allergies: profile?.allergies ? profile.allergies.join(', ') : '',
      profilePicture: profile?.profilePicture || '',
      newPassword: ''
    });
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We can rely on hardware scaling/compression but we'll safeguard it to <500px so Firestore doesn't exceed 1MB docs
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress heavily as jpeg so it stays tiny for fast loading
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData((prev: any) => ({ ...prev, profilePicture: dataUrl }));
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const allergiesArray = formData.allergies
        ? formData.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const updatedProfile = {
        ...profile,
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bloodType: formData.bloodType,
        allergies: allergiesArray,
        profilePicture: formData.profilePicture || profile?.profilePicture || null,
      };

      if (formData.newPassword) {
        if (formData.newPassword.length < 5) {
          toast.error("Password must be at least 5 characters long.");
          setIsSaving(false);
          return;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
          toast.error("Password must contain at least 1 uppercase letter, 1 special character, and 1 number.");
          setIsSaving(false);
          return;
        }

        try {
          await updatePassword(auth.currentUser, formData.newPassword);
        } catch (error: any) {
          if (error.code === 'auth/requires-recent-login') {
            toast.error("Please sign out and sign in again to change your password for security reasons.");
            setIsSaving(false);
            return;
          } else {
            toast.error("Failed to update password: " + error.message);
            setIsSaving(false);
            return;
          }
        }
      }

      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedProfile, { merge: true });
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      clearSession();
      toast.success("Signed out successfully");
      navigate({ to: '/signin' });
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userData = profile || {};

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageTitle>My Profile</PageTitle>
        {!userData.isGuest && (
          <Button variant="ghost" onClick={() => isEditing ? handleSave() : startEditing()} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEditing ? 'Save Changes' : <><Settings className="h-4 w-4 mr-2" /> Edit</>}
          </Button>
        )}
      </div>

      {/* Profile Identity */}
      <DesignBSurface variant="elevated" className="p-6 flex items-center gap-6">
        <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden group flex-shrink-0">
          {(isEditing ? formData.profilePicture : userData.profilePicture) ? (
            <img
              src={isEditing ? formData.profilePicture : userData.profilePicture}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle className="h-12 w-12 text-primary" />
          )}

          {isEditing && (
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="max-w-[200px]"
              />
            ) : (
              userData.name || userData.email?.split('@')[0] || 'Health Enthusiast'
            )}
          </h2>
          <BodyText className="text-muted-foreground text-sm">
            Patient ID: {userData.isGuest ? 'GUEST-ACCOUNT' : (auth.currentUser?.uid.slice(0, 8).toUpperCase() || 'UNKNOWN')}
          </BodyText>
        </div>
      </DesignBSurface>

      {/* Contact & Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DesignBSurface variant="elevated" className="p-6 space-y-4">
          <SectionTitle>Contact Info</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Email</p>
                <p className="text-sm font-medium">{userData.email || 'Not provided'}</p>
              </div>
            </div>
            <Separator className="opacity-50" />
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Phone</p>
                {isEditing ? (
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-8 mt-1 text-sm"
                    placeholder="E.g. +1 234 567 890"
                  />
                ) : (
                  <p className="text-sm font-medium">{userData.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </DesignBSurface>

        <DesignBSurface variant="elevated" className="p-6 space-y-6">
          <SectionTitle>Medical Stats</SectionTitle>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] cursor-pointer hover:-translate-y-1">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1 w-full">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">Date of Birth</p>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center justify-between w-full h-11 px-4 bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-300 ease-out font-medium text-foreground shadow-sm hover:shadow-[0_8px_20px_rgba(var(--primary),0.15)] hover:-translate-y-0.5 outline-none">
                        <span>{formData.dateOfBirth ? format(new Date(formData.dateOfBirth), 'PPP') : 'Select your birthday'}</span>
                        <Calendar className="h-4 w-4 text-primary/60" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                        onSelect={(date) => setFormData({ ...formData, dateOfBirth: date ? date.toISOString().split('T')[0] : '' })}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                        className="rounded-2xl border-none shadow-none"
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <p className="inline-flex items-center text-sm font-semibold text-foreground bg-primary/5 px-4 py-2 rounded-lg border border-primary/10 shadow-[0_2px_10px_rgba(var(--primary),0.05)] transition-all hover:shadow-[0_4px_15px_rgba(var(--primary),0.1)] hover:-translate-y-0.5">
                    {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}
                  </p>
                )}
              </div>
            </div>

            <Separator className="opacity-30" />

            <div className="flex items-start gap-4">
              <div className="bg-destructive/10 p-3 rounded-xl text-destructive shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--destructive),0.3)] cursor-pointer hover:-translate-y-1">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="flex-1 w-full">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">Blood Type</p>
                {isEditing ? (
                  <Input
                    value={formData.bloodType || ''}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="h-11 px-4 bg-destructive/5 text-foreground font-medium rounded-xl border-2 border-destructive/20 focus:border-destructive/40 focus:ring-destructive/30 hover:bg-destructive/10 transition-all duration-300 ease-out shadow-sm focus:shadow-[0_8px_20px_rgba(var(--destructive),0.15)] focus:-translate-y-0.5 hover:-translate-y-0.5"
                    placeholder="E.g. O+, A-, AB+"
                  />
                ) : (
                  <span className="inline-flex items-center text-sm font-bold text-destructive bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20 shadow-[0_2px_10px_rgba(var(--destructive),0.05)] transition-all hover:shadow-[0_4px_15px_rgba(var(--destructive),0.1)] hover:-translate-y-0.5">
                    {userData.bloodType || 'Unknown'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DesignBSurface>
      </div>

      {/* Account Security (Only visible when editing) */}
      {isEditing && (
        <DesignBSurface variant="elevated" className="p-6 space-y-4">
          <SectionTitle>Account Security</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Change Password</p>
                <Input
                  type="password"
                  value={formData.newPassword || ''}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="h-8 mt-1 text-sm"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Note: Changing your password may require you to have signed in recently.
            </p>
          </div>
        </DesignBSurface>
      )}

      {/* Allergies & Safety */}
      <DesignBSurface variant="elevated" className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <SectionTitle>Health Alerts</SectionTitle>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <Input
              value={formData.allergies || ''}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="E.g. Penicillin, Peanuts (comma separated)"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userData.allergies && userData.allergies.length > 0 ? (
              userData.allergies.map((allergy: string) => (
                <Badge key={allergy} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg px-3 py-1">
                  {allergy}
                </Badge>
              ))
            ) : (
              <BodyText className="text-sm text-muted-foreground italic">No critical allergies reported.</BodyText>
            )}
          </div>
        )}
      </DesignBSurface>

      {/* Voice Cloning / AI Identity (OFFLINE) */}
      <DesignBSurface variant="elevated" className="p-6 space-y-4 bg-primary/5 border-l-4 border-primary">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          <SectionTitle>Goku's Voice Identity</SectionTitle>
        </div>
        <BodyText className="text-sm">
          Teach Goku your <b>own voice</b>. This works completely <b>offline</b>—no data leaves your phone.
        </BodyText>
        <div className="flex flex-col gap-3">
          <input
            type="file"
            id="voice-upload"
            accept="audio/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const { setupLocalVoice } = await import('../components/assistant/localVoiceSetup');
                await setupLocalVoice(file);
              }
            }}
          />
          <Button
            variant="outline"
            className="w-full rounded-xl border-dashed border-2 border-primary/30 hover:bg-primary/10 transition-all h-14"
            onClick={() => document.getElementById('voice-upload')?.click()}
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Upgrade Goku with My Voice
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">
            Recommended: Upload a 5-second voice clip
          </p>
        </div>
      </DesignBSurface>

      {/* Guest Call to Action */}
      {userData.isGuest && (
        <DesignBSurface variant="elevated" className="p-6 bg-primary/5 border border-primary/20 text-center space-y-4">
          <SectionTitle>Create a Permanent Account</SectionTitle>
          <BodyText className="text-muted-foreground">
            You are currently browsing as a guest. All your data will be lost when you sign out.
            Create an account to securely save your health records, use all features, and sync across devices.
          </BodyText>
          <div className="flex justify-center gap-4 pt-2">
            <Button onClick={() => navigate({ to: '/signup' })}>
              Create Account
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/signin' })}>
              Sign In
            </Button>
          </div>
        </DesignBSurface>
      )}

      {/* Account Actions */}
      <div className="pt-4">
        <Button
          variant="destructive"
          className="w-full h-12 rounded-xl text-md font-semibold gap-2 shadow-lg shadow-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {userData.isGuest ? 'End Guest Session' : 'Sign Out of Account'}
        </Button>
      </div>
    </div>
  );
}
