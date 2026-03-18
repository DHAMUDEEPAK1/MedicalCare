import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '../designB/components/DesignBTypography';
import { useAuthSession } from '../hooks/useAuthSession';
import { Loader2, AlertCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignIn() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuthSession();
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [detectedCountryCode, setDetectedCountryCode] = useState<string>('+1');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.country_calling_code) {
          setDetectedCountryCode(data.country_calling_code);
        }
      })
      .catch(err => console.error("Error detecting country code:", err));
  }, []);

  const checkUserProfileAndRedirect = async (user: any) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate({ to: '/home' });
      } else {
        navigate({ to: '/signup' }); // Go to complete profile
      }
    } catch (e) {
      console.error(e);
      navigate({ to: '/home' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let authEmail = loginIdentifier.trim();
    if (!authEmail) {
      setError('Please enter your phone or email.');
      return;
    }

    // Determine if it's phone or email
    if (!authEmail.includes('@')) {
      if (!authEmail.startsWith('+')) {
        authEmail = `${detectedCountryCode}${authEmail.replace(/\D/g, '')}`;
      } else {
        authEmail = `+${authEmail.replace(/\D/g, '')}`;
      }

      const digits = authEmail.replace(/\D/g, '');

      // Attempt to map a phone number back to an email address saved in the profile
      try {
        const usersRef = collection(db, 'users');
        // Match exact input or digits-only input
        const qExact = query(usersRef, where('phone', '==', authEmail));
        const snapExact = await getDocs(qExact);

        let foundEmail = null;

        if (!snapExact.empty) {
          foundEmail = snapExact.docs[0].data().email;
        } else {
          // Manual sweep of the user directory to bypass differences in spacing / dashes
          const snapAll = await getDocs(usersRef);
          for (const docSnap of snapAll.docs) {
            const userData = docSnap.data();
            if (userData.phone) {
              const dbDigits = userData.phone.replace(/\D/g, '');
              if (dbDigits.length >= 10 && digits.length >= 10) {
                if (dbDigits.endsWith(digits) || digits.endsWith(dbDigits)) {
                  foundEmail = userData.email;
                  break;
                }
              } else if (dbDigits === digits && digits.length > 0) {
                foundEmail = userData.email;
                break;
              }
            }
          }
        }

        if (foundEmail) {
          authEmail = foundEmail;
        } else {
          // Unmatched phone - fallback for users who never saved an email
          if (digits.length >= 10) {
            authEmail = `${digits}@medicalcare.local`;
          } else {
            setError('Please enter a valid email or 10-digit phone number.');
            return;
          }
        }
      } catch (err) {
        // Fallback for missing permissions/offline
        if (digits.length >= 10) {
          authEmail = `${digits}@medicalcare.local`;
        } else {
          setError('Please enter a valid email or 10-digit phone number with country code.');
          return;
        }
      }
    } else {
      // Must be an email - verify it exists in the database first
      try {
        const usersRef = collection(db, 'users');
        const qEmail = query(usersRef, where('email', '==', authEmail));
        const snapEmail = await getDocs(qEmail);

        if (snapEmail.empty) {
          setError('This email is not registered. Please sign up first.');
          return;
        }
      } catch (err) {
        // Fallback gracefully if permissions prevent reading yet
        console.error('Email verification error:', err);
      }
    }

    setIsProcessing(true);

    try {
      const result = await signInWithEmailAndPassword(auth, authEmail, password);
      await checkUserProfileAndRedirect(result.user);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email, phone number, or password.');
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
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
      const result = await signInWithPopup(auth, provider);
      await checkUserProfileAndRedirect(result.user);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const identifier = loginIdentifier.trim();
    if (!identifier) {
      setError('Please enter your phone number.');
      return;
    }

    let formattedPhone = identifier;
    if (!identifier.startsWith('+')) {
      formattedPhone = `${detectedCountryCode}${identifier.replace(/\D/g, '')}`;
    } else {
      formattedPhone = `+${identifier.replace(/\D/g, '')}`;
    }

    setIsProcessing(true);
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setError('OTP sent! Please enter the code.');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Phone sign-in is not enabled in Firebase project settings.');
      } else if (err.code === 'auth/billing-not-enabled') {
        setError('Phone authentication requires a Blaze (pay-as-you-go) billing plan in your Firebase Console.');
      } else {
        setError(err.message || 'Failed to send OTP.');
      }
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    setIsProcessing(true);
    try {
      const result = await confirmationResult.confirm(otp);
      await checkUserProfileAndRedirect(result.user);
    } catch (err: any) {
      setError('Invalid OTP code.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12 animate-fade-in-up">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <img
            src="/assets/generated/healthcare-logo.dim_512x512.png"
            alt="HealthCare Logo"
            className="h-16 w-16 mx-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity animate-float drop-shadow-md"
            onClick={() => navigate({ to: '/' })}
          />
          <PageTitle>Sign In</PageTitle>
          <p className="text-muted-foreground">
            Access your health dashboard
          </p>
        </div>

        <Card className="border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500 overflow-hidden">
          <CardHeader>
            <div className="flex gap-4 border-b border-border pb-2 mb-4">
              <button
                className={`pb-2 text-sm font-semibold transition-colors ${loginMethod === 'password' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setLoginMethod('password')}
              >
                Password Login
              </button>
              <button
                className={`pb-2 text-sm font-semibold transition-colors ${loginMethod === 'otp' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setLoginMethod('otp')}
              >
                OTP Login
              </button>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your health records and wellness data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div id="recaptcha-container"></div>

            {loginMethod === 'password' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginIdentifier">Phone or Email</Label>
                  <Input
                    id="loginIdentifier"
                    type="text"
                    placeholder="your.email@example.com or 1234567890"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full relative group overflow-hidden" disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProcessing ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                {!showOtpInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="phoneOtp">Phone Number</Label>
                    <Input
                      id="phoneOtp"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otpCode">6-Digit Code</Label>
                    <Input
                      id="otpCode"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                )}

                {error && (
                  <Alert variant={error.includes('sent!') ? 'default' : 'destructive'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : showOtpInput ? (
                    'Verify Code'
                  ) : (
                    'Send OTP Code'
                  )}
                </Button>
              </form>
            )}

            <div className="relative">
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
              className="w-full relative overflow-hidden group hover:border-primary/50"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isProcessing}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
              <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  continueAsGuest();
                  navigate({ to: '/home' });
                }}
              >
                Continue as Guest
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
