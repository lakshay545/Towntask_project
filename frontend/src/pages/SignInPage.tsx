import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, Phone, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';

interface SignInPageProps {
  onSuccess: (data: { userId: string; token: string; profile: any }) => void;
  onGoToSignUp: () => void;
}

export default function SignInPage({ onSuccess, onGoToSignUp }: SignInPageProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!phone.trim() || phone.length < 10) {
      return setError('Please enter a valid 10-digit phone number');
    }
    if (!password.trim()) {
      return setError('Please enter your password');
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.signinWithPassword({ phone, password });
      if (res.success) {
        toast.success('Signed in successfully');
        onSuccess({ userId: res.userId, token: res.token, profile: res.profile });
      }
    } catch (err: any) {
      const message = err.message || 'Failed to sign in';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient px-4 py-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl relative animate-fade-in-up grid lg:grid-cols-5 overflow-hidden rounded-2xl shadow-xl border bg-card">
        <div className="hidden lg:flex lg:col-span-2 relative bg-gradient-to-br from-accent/80 to-primary flex-col items-center justify-center p-8 text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=900&fit=crop&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">Sign in with your phone number and password to access jobs and chats.</p>
            </div>
            <div className="space-y-3 text-left">
              {[
                { icon: '🔐', text: 'Password protected login' },
                { icon: '⚡', text: 'Fast sign in without OTP wait' },
                { icon: '📍', text: 'See jobs in your area' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-0">
          <Card className="border-0 shadow-none">
            <CardHeader className="space-y-3 pb-4">
              <div>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription className="mt-1">Enter your registered phone number and password</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex h-10 items-center rounded-md border px-3 bg-muted text-sm font-medium text-muted-foreground">+91</div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button onClick={handleSignIn} className="w-full h-11 shadow-md hover:shadow-lg transition-shadow" disabled={loading || phone.length < 10 || !password.trim()}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button onClick={onGoToSignUp} className="text-primary font-semibold hover:underline">Sign Up</button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
