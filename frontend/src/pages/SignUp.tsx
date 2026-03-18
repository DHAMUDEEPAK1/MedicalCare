import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageTitle } from '../designB/components/DesignBTypography';
import { Loader2, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { auth, saveToFirebase, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';

export default function SignUp() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const ObjectEmailPhone = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
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
        if (user.email) setLoginIdentifier(user.email);
        else if (user.phoneNumber) setLoginIdentifier(user.phoneNumber);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    let authEmail = loginIdentifier.trim();
    if (!authEmail) {
      setError('Please enter your phone or email.');
      return;
    }

    if (!authEmail.includes('@')) {
      const digits = authEmail.replace(/\D/g, '');
      if (digits.length >= 10) {
        authEmail = `${digits}@medicalcare.local`;
      } else {
        setError('Please enter a valid email or 10-digit phone number.');
        return;
      }
    }

    if (!completeProfileMode) {
      if (!password || password.length < 5) {
        setError('Password must be at least 5 characters long.');
        return;
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must contain at least 1 uppercase letter, 1 special character, and 1 number.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      if (completeProfileMode && currentUser) {
        await updateProfile(currentUser, { displayName: fullName });
        await setDoc(doc(db, 'users', currentUser.uid), {
          name: fullName,
          email: currentUser.email || authEmail || '',
          phone: currentUser.phoneNumber || '',
          timestamp: serverTimestamp(),
        });
        navigate({ to: '/home' });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: fullName,
          email: authEmail,
          timestamp: serverTimestamp(),
        });
        navigate({ to: '/home' });
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email or phone number is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
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

      // Attempt to save profile, may overwrite if exists (safe for demo)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email,
        timestamp: serverTimestamp(),
      });

      navigate({ to: '/home' });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <img
            src="/assets/generated/healthcare-logo.dim_512x512.png"
            alt="HealthCare Logo"
            className="h-16 w-16 mx-auto mb-4"
          />
          <PageTitle>Create Account</PageTitle>
          <p className="text-muted-foreground">
            Join us to access your health dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{completeProfileMode ? 'Complete Profile' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {completeProfileMode ? 'Finish setting up your account details' : 'Enter your details to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginIdentifier">Phone or Email</Label>
                <Input
                  id="loginIdentifier"
                  type="text"
                  placeholder="your.email@example.com or 1234567890"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  disabled={completeProfileMode}
                />
              </div>

              {!completeProfileMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isProcessing || isGoogleLoading}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {completeProfileMode ? 'Saving...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {completeProfileMode ? 'Finish Registration' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 relative bg-white text-zinc-800 hover:bg-zinc-50 border-zinc-200"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isProcessing}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Sign up with Google</span>
                </>
              )}
            </Button>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => navigate({ to: '/signin' })}
              >
                Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
