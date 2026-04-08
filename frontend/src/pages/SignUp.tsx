import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageTitle } from '../designB/components/DesignBTypography';
import { Loader2, UserPlus, AlertCircle, Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function SignUp() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [completeProfileMode, setCompleteProfileMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setCompleteProfileMode(true);
        if (user.email) setIdentifier(user.email);
        else if (user.phoneNumber) setIdentifier(user.phoneNumber);
      } else {
        setCompleteProfileMode(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your email or phone number.');
      return;
    }

    // If they enter a phone number in the Sign Up page, we should encourage them to use Sign In (OTP)
    // as Firebase Phone Auth creates the account automatically.
    if (!cleanId.includes('@') && !completeProfileMode) {
      toast.info('Phone registration is handled via Secure OTP. Redirecting...');
      navigate({ to: '/signin' });
      return;
    }

    if (!completeProfileMode) {
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      if (completeProfileMode && currentUser) {
        // Complete profile for existing user (OTP or Google)
        await updateProfile(currentUser, { displayName: fullName });
        await setDoc(doc(db, 'users', currentUser.uid), {
          name: fullName,
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || '',
          timestamp: serverTimestamp(),
          role: 'user'
        }, { merge: true });
        
        toast.success('Profile completed successfully!');
        navigate({ to: '/home' });
      } else {
        // New Email/Password registration
        const userCredential = await createUserWithEmailAndPassword(auth, cleanId, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: fullName,
          email: cleanId,
          timestamp: serverTimestamp(),
          role: 'user'
        });
        
        toast.success('Account created successfully!');
        navigate({ to: '/home' });
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Save initial profile
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email,
        timestamp: serverTimestamp(),
        role: 'user'
      }, { merge: true });

      toast.success('Successfully connected with Google');
      navigate({ to: '/home' });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12 animate-fade-in-up">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <img
            src="/assets/generated/healthcare-logo.dim_512x512.png"
            alt="HealthCare Logo"
            className="h-20 w-20 mx-auto mb-4 animate-float"
            onClick={() => navigate({ to: '/' })}
          />
          <PageTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {completeProfileMode ? 'Final Step' : 'Get Started'}
          </PageTitle>
          <p className="text-muted-foreground text-lg">
            {completeProfileMode ? 'Tell us a bit about yourself' : 'Create your secure health account'}
          </p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden rounded-3xl backdrop-blur-sm bg-card/80">
          <div className="h-2 bg-gradient-to-r from-primary via-blue-500 to-primary" />
          <CardHeader>
            <CardTitle className="text-2xl">{completeProfileMode ? 'Complete Profile' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {completeProfileMode ? 'Finish setting up your account details' : 'Join thousands managing their health with AI'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 group">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold mb-1 grayscale group-focus-within:grayscale-0 transition-all">
                  <User className="h-4 w-4" /> Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-muted/30"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="identifier" className="flex items-center gap-2 text-sm font-semibold mb-1 grayscale group-focus-within:grayscale-0 transition-all">
                  <Mail className="h-4 w-4" /> Email address
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="name@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={completeProfileMode}
                  className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-muted/30 disabled:opacity-70"
                />
              </div>

              {!completeProfileMode && (
                <div className="space-y-2 group">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold mb-1 grayscale group-focus-within:grayscale-0 transition-all">
                    <Lock className="h-4 w-4" /> Create Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-muted/30 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 animate-in shake-1 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isProcessing || isGoogleLoading}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {completeProfileMode ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    {completeProfileMode ? 'Finish Registration' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>

            {!completeProfileMode && (
              <>
                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground font-medium tracking-wider">Faster with Google</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 h-12 rounded-xl border-muted-foreground/20 hover:bg-muted/50 transition-all group overflow-hidden relative"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isProcessing}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="mr-3 h-5 w-5 transition-transform group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="font-semibold">{isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}</span>
                </Button>
              </>
            )}

            <div className="text-center text-sm mt-8">
              <span className="text-muted-foreground font-medium">Already have an account? </span>
              <button
                type="button"
                className="text-primary hover:underline font-bold transition-all"
                onClick={() => navigate({ to: '/signin' })}
              >
                Sign In
              </button>
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground mt-6 px-6 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy. Securely managed by MedicalCare Health Systems.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
