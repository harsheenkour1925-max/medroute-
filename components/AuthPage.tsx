import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types.ts';
import { AuthContext } from '../App.tsx';
import { useLanguage } from '../LanguageContext.tsx';
import { auth as firebaseAuth, db, OperationType, handleFirestoreError, doc, setDoc, getDoc, serverTimestamp } from '../firebase.ts';
import { sendForgotPasswordEmail } from '../services/mailService.ts';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Heart, 
  Building2, 
  Truck,
  UserRound,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';

interface Props {
  initialRole?: UserRole;
  initialIsLogin?: boolean;
  onBack: () => void;
}

const AuthPage: React.FC<Props> = ({ initialRole = UserRole.DONOR, initialIsLogin = true, onBack }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authMode, setAuthMode] = useState<'USER' | 'ADMIN'>('USER');
  
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLogin(initialIsLogin);
    setRole(initialRole);
  }, [initialIsLogin, initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Hardcoded Admin login check
    if (authMode === 'ADMIN') {
      const isAdminEmail = 
        (email === 'harsheenkour19@gmail.com' && password === '1973') ||
        (email === 'harsheenkour@hotmail.com' && password === '1973') ||
        (email === '2023a1r070@mietjammu.in' && password === '1973');

      if (isAdminEmail) {
        try {
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (err: any) {
          console.error("Admin Firebase auth check:", err);
          
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            try {
              const adminCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
              await setDoc(doc(db, 'users', adminCred.user.uid), {
                email,
                role: UserRole.ADMIN,
                name: 'System Admin',
                createdAt: serverTimestamp()
              });
            } catch (regErr) {
              console.error("Admin auto-registration failed:", regErr);
            }
          }
        }
        auth?.login(email, UserRole.ADMIN);
        setIsLoading(false);
        return;
      } else {
        setError('Invalid administrator credentials.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // Firebase Login
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userData = userDoc.data();
        
        if (userData) {
          auth?.login(email, userData.role as UserRole);
        } else {
          auth?.login(email, UserRole.DONOR);
        }
      } else {
        if (role === UserRole.ADMIN) {
          setError('Cannot register as Administrator.');
          setIsLoading(false);
          return;
        }

        // Firebase Registration
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const { user } = userCredential;

        // Save to Firestore
        const userProfile = {
          email,
          role,
          name: email.split('@')[0],
          createdAt: serverTimestamp()
        };

        try {
          await setDoc(doc(db, 'users', user.uid), userProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }

        setSuccess(t('auth.accountCreated') || 'Account created successfully!');
        setTimeout(() => {
          auth?.login(email, role);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = t('auth.invalidCredentials') || 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await sendForgotPasswordEmail(email);
      setSuccess('A temporary password has been sent to your email.');
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoBypass = (selectedRole: UserRole) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    let fallbackEmail = 'visitor@example.com';
    let fallbackName = 'Demo User';
    
    if (selectedRole === UserRole.DONOR) {
      fallbackEmail = 'demo.donor@medroute.org';
      fallbackName = 'Elegance Donor';
    } else if (selectedRole === UserRole.RECEIVER) {
      fallbackEmail = 'demo.receiver@medroute.org';
      fallbackName = 'Kashmir Health Center';
    } else if (selectedRole === UserRole.NGO) {
      fallbackEmail = 'demo.ngo@medroute.org';
      fallbackName = 'NGO MedAid Partners';
    } else if (selectedRole === UserRole.DELIVERY) {
      fallbackEmail = 'demo.delivery@medroute.org';
      fallbackName = 'Express Courier India';
    } else if (selectedRole === UserRole.ADMIN) {
      fallbackEmail = 'harsheenkour19@gmail.com';
      fallbackName = 'System Admin';
    }

    setSuccess(`Bypass Active: Authenticated as ${fallbackName} (${selectedRole})`);
    setTimeout(() => {
      auth?.login(fallbackEmail, selectedRole);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      const { user } = userCredential;

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let finalRole = role;
      if (userDoc.exists()) {
        finalRole = userDoc.data().role as UserRole;
      } else {
        // Create user document if registering via Google
        const userProfile = {
          email: user.email,
          role: finalRole, // default selected role
          name: user.displayName || user.email?.split('@')[0] || 'Google User',
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, userProfile);
      }

      setSuccess('Authenticated with Google!');
      setTimeout(() => {
        auth?.login(user.email || '', finalRole);
      }, 1000);
    } catch (err: any) {
      console.warn("Google Auth error detected. Activating elegant offline/demo fallback sign-in:", err);
      // Automatically fall back to demo mode so user isn't blocked by popup close or auth-popup-closed-by-user
      handleDemoBypass(role);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: UserRole.DONOR, label: 'DONOR', icon: <Heart className="w-5 h-5 text-current" /> },
    { id: UserRole.RECEIVER, label: 'RECEIVER', icon: <UserRound className="w-5 h-5 text-current" /> },
    { id: UserRole.NGO, label: 'NGO PARTNER', icon: <Building2 className="w-5 h-5 text-current" /> },
    { id: UserRole.DELIVERY, label: 'DELIVERY PARTNER', icon: <Truck className="w-5 h-5 text-current" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 bg-[#f8f9f5] font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-[#2c3e2e]/5 flex flex-col md:flex-row min-h-[750px]"
      >
        {/* Left Hand: Premium Sidebar */}
        <div className="w-full md:w-[40%] bg-[#2c3e2e] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle nature aesthetic blobs in sidebar */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-white">
              <path d="M25,50 C35,25 75,35 65,65 C55,85 15,75 25,50 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-8">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium text-xs tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </button>

            <div className="pt-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold tracking-widest uppercase mb-4 text-[#e6e9e1]">
                COMMUNITY PORTAL
              </span>
              
              <h2 className="text-5xl font-semibold font-serif tracking-tight leading-[1.05] mt-2 select-none">
                {authMode === 'ADMIN' ? 'Secure Node' : (isLogin ? 'Welcome Back' : 'Join the Grid')}
              </h2>
              
              {/* Elegant organic divider leaf */}
              <div className="flex items-center gap-2 py-4 select-none">
                <div className="h-px bg-white/20 w-10"></div>
                <svg className="w-4 h-4 text-[#a3b18a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3C12 3 8.5 7.5 8.5 12C8.5 16.5 12 21 12 21C12 21 15.5 16.5 15.5 12C15.5 7.5 12 3 12 3Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="h-px bg-white/20 w-10"></div>
              </div>

              <p className="text-white/85 font-normal text-sm leading-relaxed max-w-sm font-sans mt-1 select-none">
                {authMode === 'ADMIN' 
                  ? 'Authorized dashboard access for system operators. Please provide validation key credentials.'
                  : (isLogin ? 'To keep connected with us please login with your personal info.' : 'Enter your personal details and start your journey with us.')}
              </p>
            </div>
          </div>

          {/* Core Hand-Crafted Premium Vector Medical Logo & Composition */}
          <div className="my-6 md:my-4 flex justify-center items-center relative select-none">
            <svg viewBox="0 0 450 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-h-[240px] drop-shadow-md">
              {/* Soft Elegant Organic foliage background shapes */}
              <path d="M50 200C50 140 100 120 160 135C220 150 240 210 200 260C160 310 90 270 50 200Z" fill="#a3b18a" fillOpacity="0.14" />
              <path d="M300 240C300 180 350 160 410 175C470 190 490 250 450 300C410 350 340 310 300 240Z" fill="#a3b18a" fillOpacity="0.1" />
              
              {/* Background Stars / Sparkles */}
              <g fill="#a3b18a" fillOpacity="0.6">
                {/* Sparkle 1 */}
                <path d="M150 100 Q150 110 140 110 Q150 110 150 120 Q150 110 160 110 Q150 110 150 100" />
                {/* Sparkle 2 */}
                <path d="M380 180 Q380 188 372 188 Q380 188 380 196 Q380 188 388 188 Q380 188 380 180" />
                {/* Sparkle 3 */}
                <path d="M110 210 Q110 215 105 215 Q110 215 110 220 Q110 215 115 215 Q110 215 110 210" />
              </g>

              {/* Foliage Branches on Left & Right background */}
              {/* Left Foliage */}
              <g stroke="#a3b18a" strokeWidth="2.5" strokeLinecap="round" opacity="0.65">
                <path d="M90 280 Q70 230 65 170" />
                {/* Leaves */}
                <path d="M65 170 C55 175 48 185 48 185 C48 185 58 180 65 170" fill="#a3b18a" />
                <path d="M72 195 C62 202 55 212 55 212 C55 212 65 207 72 195" fill="#a3b18a" />
                <path d="M79 225 C69 232 64 245 64 245 C64 245 74 238 79 225" fill="#a3b18a" />
                <path d="M85 255 C77 262 74 275 74 275 C74 275 82 268 85 255" fill="#a3b18a" />
              </g>
              
              {/* Right Foliage */}
              <g stroke="#5b7b62" strokeWidth="2.5" strokeLinecap="round" opacity="0.5">
                <path d="M320 280 Q345 220 375 185" />
                {/* Leaves */}
                <path d="M375 185 C385 190 392 200 392 200 C392 200 382 195 375 185" fill="#5b7b62" />
                <path d="M360 210 C370 217 378 227 378 227 C378 227 368 222 360 210" fill="#5b7b62" />
                <path d="M345 235 C355 242 362 255 362 255 C362 255 352 248 345 235" fill="#5b7b62" />
              </g>

              {/* FIRST AID BOX / KIT (Center element) */}
              {/* Shadows */}
              <rect x="135" y="195" width="140" height="110" rx="20" fill="#1b281f" fillOpacity="0.2" />
              {/* First Aid Box Body */}
              <rect x="130" y="190" width="140" height="110" rx="20" fill="#8ca593" />
              {/* Handle */}
              <path d="M175 190 V172 C175 168 180 162 188 162 H212 C220 162 225 168 225 172 V190" stroke="#6b8672" strokeWidth="8" strokeLinecap="round" />
              {/* Locks & Buckles */}
              <rect x="155" y="190" width="16" height="8" rx="2" fill="#5b7161" />
              <rect x="229" y="190" width="16" height="8" rx="2" fill="#5b7161" />
              {/* Clean Highlight */}
              <path d="M150 198 H250" stroke="#a2b7a9" strokeWidth="2.5" strokeLinecap="round" />
              {/* Central Premium Emblem Cross */}
              <circle cx="200" cy="245" r="26" fill="white" />
              <path d="M200 234 V256 M189 245 H211" stroke="#5b7b62" strokeWidth="6" strokeLinecap="round" />

              {/* MEDICINE GLASS BOTTLE (Left foreground) */}
              <g>
                {/* Bottle Cap */}
                <rect x="106" y="240" width="28" height="10" rx="3" fill="#eaeee7" />
                <rect x="110" y="236" width="20" height="4" rx="1" fill="#eaeee7" />
                {/* Bottle Neck */}
                <rect x="112" y="250" width="16" height="6" fill="#2c3e2e" />
                {/* Bottle Body */}
                <rect x="98" y="256" width="44" height="54" rx="8" fill="#2c3e2e" />
                {/* Gloss / shine reflection line */}
                <path d="M104 262 V298" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
                {/* Bottle White Label */}
                <rect x="105" y="268" width="30" height="32" rx="4" fill="white" />
                {/* Cross on label */}
                <path d="M120 278 V290 M114 284 H126" stroke="#5b7b62" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* SOLID PILLS (Lying on floor) */}
              {/* Pill 1 */}
              <rect x="157" y="303" width="18" height="7" rx="3.5" fill="#fcfdfa" stroke="#2c3e2e" strokeWidth="1" />
              {/* Pill 2 */}
              <circle cx="184" cy="305" r="6" fill="#fcfdfa" stroke="#2c3e2e" strokeWidth="1" />
              
              {/* BLISTER PACK (Right foreground) */}
              <g transform="translate(230, 240) rotate(-15)">
                {/* Blister Card Background */}
                <rect x="0" y="0" width="50" height="76" rx="10" fill="#fbfcf9" stroke="#cbd5e0" strokeWidth="1" />
                <rect x="4" y="4" width="42" height="68" rx="8" fill="white" />
                {/* 6 Bubble Pill Chambers */}
                <circle cx="14" cy="16" r="6" fill="#e6e9e1" fillOpacity="0.5" stroke="#a3b18a" />
                <circle cx="36" cy="16" r="6" fill="#e6e9e1" fillOpacity="0.5" stroke="#a3b18a" />
                
                <circle cx="14" cy="38" r="6" fill="#e6e9e1" fillOpacity="0.5" stroke="#a3b18a" />
                <circle cx="36" cy="38" r="6" fill="#e6e9e1" fillOpacity="0.5" stroke="#a3b18a" />
                
                <circle cx="14" cy="60" r="6" fill="#e6e9e1" fillOpacity="0.5" stroke="#a3b18a" />
                <circle cx="36" cy="60" r="6" fill="#e6e9e1" fillOpacity="0.5" stroke="#a3b18a" />
              </g>
              
              {/* Flying paper plane showing journey */}
              <g transform="translate(285, 150) rotate(-8)">
                <path d="M0 15 L40 0 L25 25 Z" fill="#e6e9e1" opacity="0.9" />
                <path d="M25 25 L35 15 L20 32 Z" fill="#ccd5be" />
                {/* Dotted path trail */}
                <path d="M-60 40 Q-30 25 -5 18" stroke="#a3b18a" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setError('');
                setSuccess('');
                setIsLogin(!isLogin);
              }}
              className="px-12 py-4.5 border border-white/25 hover:border-white rounded-full font-bold text-xs uppercase tracking-widest text-center transition-all bg-white/5 active:scale-95"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </motion.button>
            
            <button 
              onClick={() => {
                setError('');
                setSuccess('');
                setAuthMode(authMode === 'ADMIN' ? 'USER' : 'ADMIN');
                setIsLogin(true);
              }}
              className="text-[#a3b18a] hover:text-white text-[11px] font-bold transition-all flex items-center gap-1.5 justify-center py-2"
            >
              {authMode === 'ADMIN' ? 'Back to Community Login' : 'Admin Sign In'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Hand: Action Form */}
        <div className="w-full md:w-[60%] bg-[#fafaf7] p-10 md:p-16 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-semibold font-serif text-[#2c3e2e] tracking-tight text-center md:text-left">
                {authMode === 'ADMIN' ? 'Administrator Login' : (isLogin ? 'Sign In / Select Demo Role' : 'Create Account')}
              </h1>
              <p className="text-xs text-[#5b7b62] mt-2 font-medium">
                Click any role card below to instantly access that demo account with 0 setup required!
              </p>
              
              <div className="h-px bg-[#2c3e2e]/10 w-full relative my-6">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fafaf7] px-4 text-[10px] font-bold text-[#5b7b62] tracking-widest uppercase">
                  INSTANT DEMO ACCOUNTS
                </span>
              </div>
            </motion.div>

            {/* Quick One-Click Demo Role Cards */}
            <div className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.DONOR)}
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-emerald-900 group shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Donor</span>
                <span className="text-[9px] text-emerald-700 font-medium opacity-80">Demo Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.RECEIVER)}
                className="p-3.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200/60 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-sky-900 group shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <UserRound className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Receiver</span>
                <span className="text-[9px] text-sky-700 font-medium opacity-80">Demo Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.NGO)}
                className="p-3.5 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/60 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-indigo-900 group shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">NGO Partner</span>
                <span className="text-[9px] text-indigo-700 font-medium opacity-80">Demo Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.ADMIN)}
                className="p-3.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/60 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-purple-900 group shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Government</span>
                <span className="text-[9px] text-purple-700 font-medium opacity-80">Oversight Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.DELIVERY)}
                className="p-3.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-amber-900 group shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Courier</span>
                <span className="text-[9px] text-amber-700 font-medium opacity-80">Rider Partner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('ADMIN');
                  setEmail('harsheenkour19@gmail.com');
                  setPassword('1973');
                  handleDemoBypass(UserRole.ADMIN);
                }}
                className="p-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-slate-900 group shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Sys Admin</span>
                <span className="text-[9px] text-slate-600 font-medium">Full Master</span>
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-5 bg-[#fff0f2] border border-[#ff3b57]/10 text-rose-700 rounded-2xl text-[13px] font-semibold flex items-start gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-[#ff3b57]/10 flex items-center justify-center shrink-0 border border-[#ff3b57]/20 text-rose-600 font-bold text-xs">!</div>
                <p className="pt-0.5 leading-relaxed">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-5 bg-[#f4f6ef] border border-[#5b7b62]/10 text-emerald-800 rounded-2xl text-[13px] font-semibold flex items-start gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-[#5b7b62]/10 flex items-center justify-center shrink-0 border border-[#5b7b62]/20 text-[#5b7b62] font-bold text-xs">✓</div>
                <p className="pt-0.5 leading-relaxed">{success}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SELECT IDENTITY Role Grid - Register State only */}
              {authMode === 'USER' && !isLogin && (
                <div className="space-y-3 mb-8">
                  <label className="text-[10px] font-bold text-[#5b7b62] uppercase tracking-widest block mb-2 select-none">
                    SELECT IDENTITY
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map(r => {
                      const isActive = role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`p-4.5 rounded-2xl border flex items-center gap-3.5 transition-all text-left ${isActive ? 'border-[#5b7b62] bg-[#fdfefc] shadow-sm text-[#2c3e2e]' : 'border-[#2c3e2e]/5 bg-transparent text-[#5b7b62] hover:border-[#2c3e2e]/10'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#5b7b62] text-white' : 'bg-[#e6e9e1]/65 text-[#2c3e2e]'}`}>
                            {r.icon}
                          </div>
                          <div className="text-[11px] font-bold uppercase tracking-wider">{r.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Email & Password Input fields matching mockup style */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5b7b62] group-focus-within:text-[#2c3e2e] transition-colors">
                    {authMode === 'ADMIN' ? <LockKeyhole size={18} /> : <Mail size={18} />}
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={authMode === 'ADMIN' ? 'harsheenkour19@gmail.com' : 'Your Email Address'}
                    className="w-full pl-12 pr-5 py-4.5 bg-[#f4f5f1] border border-transparent rounded-2xl focus:bg-white focus:border-[#5b7b62]/40 outline-none font-medium text-[#2c3e2e] transition-all text-sm placeholder:text-[#5b7b62]/40"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5b7b62] group-focus-within:text-[#2c3e2e] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-4.5 bg-[#f4f5f1] border border-transparent rounded-2xl focus:bg-white focus:border-[#5b7b62]/40 outline-none font-medium text-[#2c3e2e] transition-all text-sm placeholder:text-[#5b7b62]/40"
                    required
                  />
                </div>
              </div>

              {authMode === 'USER' && isLogin && (
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className="relative w-4 h-4">
                      <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                      <div className="w-4 h-4 border border-[#2c3e2e]/20 rounded-md group-hover:border-[#5b7b62] peer-checked:bg-[#5b7b62] peer-checked:border-[#5b7b62] transition-all flex items-center justify-center">
                        <div className="w-1 h-2 border-r border-b border-white rotate-45 mb-0.5" />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#5b7b62] group-hover:text-[#2c3e2e] transition-colors">Remember me</span>
                  </label>
                  
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-[#5b7b62] hover:text-[#2c3e2e] transition-colors uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-4">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className={`w-full py-4.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 ${
                    isLoading ? 'bg-[#e6e9e1] text-[#5b7b62]/50 cursor-not-allowed' : 'bg-[#2c3e2e] text-white hover:opacity-95'
                  }`}
                >
                  {isLoading ? 'Processing...' : (authMode === 'ADMIN' ? 'Secure Login' : (isLogin ? 'SIGN IN' : 'SIGN UP'))}
                </motion.button>
              </div>

              {authMode === 'USER' && (
                <>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#2c3e2e]/10"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-[#5b7b62] tracking-widest uppercase">OR</span>
                    <div className="flex-grow border-t border-[#2c3e2e]/10"></div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-4 bg-white border border-[#2c3e2e]/15 hover:border-[#2c3e2e]/35 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2.5 text-[#2c3e2e]"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.88-2.6-2.12-4.53-.19-6.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => handleDemoBypass(role)}
                    disabled={isLoading}
                    className="w-full py-4 mt-3 bg-[#fcfdfa] border border-[#a3b18a]/35 hover:bg-[#f4f6f0] hover:border-[#a3b18a]/60 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 text-[#2c3e2e]"
                  >
                    <User className="w-4 h-4 text-[#5b7b62] shrink-0" />
                    Explore with Demo Mode
                  </motion.button>
                </>
              )}
            </form>

            <p className="mt-8 text-[11px] text-[#5b7b62] text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <button className="underline font-semibold hover:text-[#2c3e2e]">Terms of Service</button>
              {' '}and{' '}
              <button className="underline font-semibold hover:text-[#2c3e2e]">Privacy Policy</button>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
