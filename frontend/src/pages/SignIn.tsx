import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { PageTitle } from '../designB/components/DesignBTypography';
import { useAuthSession } from '../hooks/useAuthSession';
import { Loader2, AlertCircle, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function SignIn() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuthSession();
  
  // State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // OTP / Passwordless specific state
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [linkSent, setLinkSent] = useState(false);

  // Check for Email Link callback on mount
  useEffect(() => {
    const handleLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
          setIsProcessing(true);
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            await checkUserProfileAndRedirect(result.user);
          } catch (err: any) {
            setError(err.message || 'Failed to sign in with link.');
          } finally {
            setIsProcessing(false);
          }
        }
      }
    };
    handleLinkSignIn();
  }, []);

  const checkUserProfileAndRedirect = async (user: any) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        toast.success('Welcome back!');
        navigate({ to: '/home' });
      } else {
        toast.info('Please complete your profile');
        navigate({ to: '/signup' }); 
      }
    } catch (e) {
      console.error(e);
      navigate({ to: '/home' });
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier || !password) {
      setError('Please enter both identifier and password.');
      return;
    }

    setIsProcessing(true);
    try {
      // Direct sign in with email/password. 
      // Note: Firebase email/password requires a real email. 
      // If user enters a phone, they should use OTP mode for production.
      const result = await signInWithEmailAndPassword(auth, cleanIdentifier, password);
      await checkUserProfileAndRedirect(result.user);
    } catch (err: any) {
      console.error("Login error:", err.code);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendOtpOrLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanId = identifier.trim();
    
    if (!cleanId) {
      setError('Please enter your email or phone number.');
      return;
    }

    setIsProcessing(true);
    try {
      if (cleanId.includes('@')) {
        // Email Link Auth
        const actionCodeSettings = {
          url: window.location.origin + '/signin',
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, cleanId, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', cleanId);
        setLinkSent(true);
        toast.success('Sign-in link sent to your email!');
      } else {
        // Phone OTP Auth
        setupRecaptcha();
        let phone = cleanId;
        if (!phone.startsWith('+')) {
          phone = `+${phone.replace(/\D/g, '')}`;
        }
        
        const confirmation = await signInWithPhoneNumber(auth, phone, (window as any).recaptchaVerifier);
        setConfirmationResult(confirmation);
        setShowOtpInput(true);
        toast.success('Verification code sent to your phone!');
      }
    } catch (err: any) {
      console.error("OTP Error:", err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Use +[countryCode][number].');
      } else {
        setError(err.message || 'Failed to send verification.');
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
    if (!otpCode || !confirmationResult) return;
    
    setIsProcessing(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      await checkUserProfileAndRedirect(result.user);
    } catch (err: any) {
      setError('Invalid verification code.');
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

  return (
    <div className="container max-w-md mx-auto px-4 py-12 animate-fade-in-up">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <img
            src="/assets/generated/healthcare-logo.dim_512x512.png"
            alt="HealthCare Logo"
            className="h-20 w-20 mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform animate-float drop-shadow-xl"
            onClick={() => navigate({ to: '/' })}
          />
          <PageTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </PageTitle>
          <p className="text-muted-foreground text-lg">
            Sign in to your production health portal
          </p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden rounded-3xl backdrop-blur-sm bg-card/80">
          <div className="h-2 bg-gradient-to-r from-primary via-blue-500 to-primary" />
          <CardHeader className="pb-4">
            <div className="flex p-1 bg-muted rounded-xl mb-6">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${loginMethod === 'password' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setLoginMethod('password'); setShowOtpInput(false); setLinkSent(false); }}
              >
                <Lock className="h-4 w-4" />
                Password
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${loginMethod === 'otp' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setLoginMethod('otp')}
              >
                <Phone className="h-4 w-4" />
                OTP / Link
              </button>
            </div>
            <CardDescription className="text-center text-balance">
              {loginMethod === 'password' 
                ? "Enter your credentials to access your account" 
                : "Secure, passwordless access via email link or phone code"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div id="recaptcha-container"></div>

            {linkSent ? (
              <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl">Check your email</h3>
                  <p className="text-muted-foreground">
                    We've sent a magic link to <span className="font-medium text-foreground">{identifier}</span>. Click the link to sign in instantly.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl"
                  onClick={() => setLinkSent(false)}
                >
                  Try a different method
                </Button>
              </div>
            ) : loginMethod === 'password' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 group">
                  <Label htmlFor="identifier" className="flex items-center gap-2 text-sm font-semibold mb-1 grayscale group-focus-within:grayscale-0 transition-all">
                    <Mail className="h-4 w-4" /> Email Address
                  </Label>
                  <Input
                    id="identifier"
                    type="email"
                    placeholder="name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-muted/30"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold mb-1 grayscale group-focus-within:grayscale-0 transition-all">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-muted/30"
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 animate-in shake-1 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                  {isProcessing ? 'Verifying...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtpOrLink} className="space-y-4">
                {!showOtpInput ? (
                  <div className="space-y-2 group">
                    <Label htmlFor="otpIdentifier" className="flex items-center gap-2 text-sm font-semibold mb-1 grayscale group-focus-within:grayscale-0 transition-all">
                      <Mail className="h-4 w-4 text-primary" /> Email or <Phone className="h-4 w-4 text-blue-500" /> Phone
                    </Label>
                    <Input
                      id="otpIdentifier"
                      type="text"
                      placeholder="email@example.com or +1234567890"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-muted/30"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 px-1">
                      International format required for phone numbers (e.g., +15551234567)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="otpCode" className="flex items-center gap-2 text-sm font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Enter 6-digit Code
                      </Label>
                      <Input
                        id="otpCode"
                        type="text"
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        maxLength={6}
                        className="h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-xl bg-muted/30"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="rounded-xl animate-in shake-1 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : showOtpInput ? (
                    'Verify Identity'
                  ) : (
                    'Send Secure Link / Code'
                  )}
                </Button>
                
                {showOtpInput && (
                  <button 
                    type="button" 
                    className="w-full text-sm text-primary hover:underline"
                    onClick={() => { setShowOtpInput(false); setOtpCode(''); }}
                  >
                    Back to identifier
                  </button>
                )}
              </form>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium tracking-wider">Social Access</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-muted-foreground/20 hover:bg-muted/50 transition-all group overflow-hidden relative"
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
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span className="font-semibold">{isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </Button>

            <div className="flex flex-col gap-3 text-center pt-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <button
                  type="button"
                  className="text-primary hover:underline font-bold"
                  onClick={() => navigate({ to: '/signup' })}
                >
                  Sign Up
                </button>
              </div>
              
              <button
                type="button"
                className="text-muted-foreground hover:text-primary hover:underline text-sm font-medium transition-colors"
                onClick={() => {
                  continueAsGuest();
                  navigate({ to: '/home' });
                }}
              >
                Continue as Guest
              </button>
              
              <p className="text-[10px] text-muted-foreground px-4 leading-normal mt-2">
                By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
