import { useState, useEffect } from 'react';
import { Mail, Lock, EyeOff, Eye, MapPin, ChevronDown, ArrowLeft } from 'lucide-react';
import { auth, googleProvider, facebookProvider } from './lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  const loginWithFacebook = async () => {
    try {
      setError('');
      await signInWithPopup(auth, facebookProvider);
    } catch (err: any) {
      setError(err.message || 'Facebook login failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Sign out error", err);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }
    setError('');
    setResetMessage('');
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 font-sans">
        <div className="w-full max-w-md p-8 bg-white rounded-[24px] shadow-sm border border-gray-100 text-center space-y-6">
           <h2 className="text-2xl font-black uppercase tracking-widest text-black">Dashboard</h2>
           <div className="py-6 flex flex-col items-center">
             {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mb-4 object-cover shadow-sm bg-gray-100" referrerPolicy="no-referrer" />
             ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 border border-gray-200">
                  <span className="text-3xl font-bold text-gray-400">{(user.displayName || user.email || '?').charAt(0).toUpperCase()}</span>
                </div>
             )}
             <p className="text-xl font-bold text-gray-900">{user.displayName || 'Welcome!'}</p>
             <p className="text-sm font-medium text-gray-500 mt-1">{user.email}</p>
             <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mt-3">Logged In</span>
           </div>
           
           <div className="pt-2">
             <button 
               onClick={handleSignOut}
               className="w-full py-3.5 px-4 rounded-xl text-[15px] font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all active:scale-[0.98]"
             >
               Sign Out
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full bg-white font-sans text-gray-900 relative overflow-hidden lg:static lg:h-auto lg:min-h-screen">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 w-full h-[100dvh] lg:relative lg:flex lg:w-1/2 bg-gray-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
          alt="Fashion Model"
          className="absolute inset-0 w-full h-full object-cover lg:object-center object-top"
          referrerPolicy="no-referrer"
        />
        {/* Adjusted padding on mobile so SHEIN isn't completely hidden by the 50% bottom sheet */}
        <div className="absolute inset-x-0 bottom-[45vh] lg:bottom-0 p-8 lg:p-12 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:from-gray-50/20 pointer-events-none transition-all duration-500 flex justify-center lg:justify-start">
          <h1 className="text-white lg:text-black text-[11vw] sm:text-[8vw] lg:text-7xl font-black uppercase tracking-[0.2em] lg:tracking-[0.25em] drop-shadow-md pb-4 mix-blend-overlay opacity-90 text-center lg:text-left whitespace-nowrap">
            S H E I N
          </h1>
        </div>
      </div>

      {/* Right Column (Form) / Mobile Slide-up Modal */}
      <div 
        className={`absolute lg:relative z-10 bottom-0 w-full lg:w-1/2 bg-white rounded-t-[2.5rem] lg:rounded-none flex flex-col items-center justify-start lg:justify-center p-6 pt-2 sm:p-12 lg:p-24 overflow-y-auto shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.3)] lg:shadow-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex-1 ${
          isExpanded ? 'h-[100dvh] rounded-t-none pb-24' : 'h-[55dvh]'
        } lg:h-auto lg:min-h-screen`}
      >
        {/* Mobile handle */}
        <div className="w-full flex justify-center py-4 lg:hidden cursor-pointer shrink-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-14 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col h-full lg:h-auto mt-2 lg:mt-0" onFocus={() => setIsExpanded(true)}>
          {/* Logo - Hidden on mobile because it's prominent on the background image */}
          <div className="hidden lg:flex justify-center mb-10">
            <h2 className="text-4xl font-black uppercase tracking-[0.25em]">
              S H E I N
            </h2>
          </div>

          <div className="w-full">
            {showForgotPassword ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex flex-col space-y-2">
                  <button 
                    type="button" 
                    onClick={() => { setShowForgotPassword(false); setResetMessage(''); setError(''); }}
                    className="flex items-center text-sm font-semibold text-gray-500 hover:text-black hover:underline underline-offset-2 transition-colors w-fit mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Sign In
                  </button>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">Reset Password</h3>
                  <p className="text-sm text-gray-500">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}
                  {resetMessage && (
                    <div className="p-3 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-medium">
                      {resetMessage}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-3 py-3 border border-transparent rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-400 hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-[15px] font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  >
                    {resetLoading ? (
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                       'Send Reset Link'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Auth Form */}
                <form onSubmit={handleEmailAuth} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-800">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-transparent rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-400 hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-800">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3 border border-transparent rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-400 hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 outline-none"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isSignIn && (
                <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
                  <label className="text-sm font-semibold text-gray-800">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 border border-transparent rounded-xl bg-gray-100 text-gray-900 placeholder:text-gray-400 hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors sm:text-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 outline-none"
                    >
                      {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {isSignIn && (
                <div className="flex items-center justify-between pt-1 pb-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="origin-center h-4 w-4 rounded-sm border-gray-300 text-black focus:ring-black focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-700 font-medium cursor-pointer select-none">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button type="button" onClick={() => { setShowForgotPassword(true); setError(''); setResetMessage(''); }} className="font-bold text-black hover:underline underline-offset-2 focus:outline-none">
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-[15px] font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   isSignIn ? 'Sign In' : 'Register'
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 shadow-sm rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                
                {/* Facebook Sign In Button */}
                <button
                  type="button"
                  disabled
                  title="Currently disabled"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 shadow-sm rounded-xl bg-gray-50 opacity-50 cursor-not-allowed transition-colors focus:outline-none"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="h-[24px] w-[24px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Apple Sign In Button */}
                <button
                  type="button"
                  disabled
                  title="Currently disabled"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 shadow-sm rounded-xl bg-gray-50 opacity-50 cursor-not-allowed transition-colors focus:outline-none"
                >
                  <span className="sr-only">Sign in with Apple</span>
                  <svg className="h-[22px] w-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#000000" d="M16.365 7.03c-.023-2.003 1.579-3.513 3.197-3.535-1-1.517-2.67-1.92-3.32-1.972-1.391-.144-2.88.854-3.56.854-.693 0-1.89-1.026-3.23-1.002-1.764.02-3.364 1.027-4.248 2.584-1.848 3.236-.47 8.086 1.348 10.73 .87 1.295 1.93 2.766 3.298 2.71 1.31-.059 1.83-1.124 3.32-1.124 1.488 0 1.956 1.137 3.333 1.101 1.408-.035 2.302-1.31 3.16-2.582 1.008-1.487 1.428-2.923 1.442-3.003-.027-.015-2.695-.91-2.73-3.76zM15.42 2.528c.783-.956 1.282-2.28 1.146-3.528-1.096.046-2.38.74-3.18 1.696-.697.838-1.28 2.18-.113 2.18-.112 3.418.995.044 2.146.044" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-[15px] font-medium text-gray-600">
               {isSignIn ? (
                <p>
                  Don't have an account yet?{' '}
                  <button type="button" onClick={() => { setIsSignIn(false); setError(''); }} className="font-bold text-black hover:underline focus:outline-none underline-offset-2">
                    Register
                  </button>
                </p>
               ) : (
                <p>
                  Already have an account?{' '}
                   <button type="button" onClick={() => { setIsSignIn(true); setError(''); }} className="font-bold text-black hover:underline focus:outline-none underline-offset-2">
                    Sign In
                  </button>
                </p>
               )}
            </div>
            </>
            )}

            <div className="mt-12 flex justify-center">
              <button type="button" className="flex items-center text-[13px] font-medium text-gray-700 bg-gray-100/80 hover:bg-gray-200 py-1.5 px-3.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
                 <MapPin className="h-3.5 w-3.5 mr-1" />
                 <span>Philippines</span>
                 <ChevronDown className="h-3.5 w-3.5 ml-1 text-gray-500" />
              </button>
            </div>

            <div className="mt-5 text-center text-[13px] text-gray-500 px-4 leading-relaxed tracking-wide">
              By continuing, you agree to our{' '}
              <a href="#" className="font-medium text-gray-700 hover:text-black hover:underline cursor-pointer">Privacy & Cookie Policy</a>
              <br />
              and{' '}
              <a href="#" className="font-medium text-gray-700 hover:text-black hover:underline cursor-pointer">Terms & Conditions</a>.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
