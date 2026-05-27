import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { 
  LogIn, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Twitter,
  UserPlus,
  ArrowLeft,
  Mail,
  Lock,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

const LOGO_URL = "https://www.civa.com.pe/assets/img/logo_civa.png";
const FLEET_IMAGE = "https://www.civa.com.pe/assets/img/slider/home/slide-web-1.jpg";

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });

  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("No se pudo iniciar sesión con Google. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Guest login failed:", err);
      setError("Error en el acceso técnico. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      // Create profile document immediately to ensure it's saved correctly
      const newProfile = {
        uid: userCredential.user.uid,
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
      
    } catch (err: any) {
      console.error("Registration failed:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado. Intente iniciar sesión.");
      } else if (err.code === 'auth/weak-password') {
        setError("La contraseña es muy débil (mínimo 6 caracteres).");
      } else {
        setError("Error al crear la cuenta. Verifique sus datos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email y contraseña son requeridos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/51986658043?text=Hola%20CIVA,%20vengo%20desde%20la%20App%20Inteligente%20y%20necesito%20ayuda', '_blank');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-civa-dark selection:bg-civa-pink selection:text-white' : 'bg-white selection:bg-civa-pink selection:text-white'}`}>
      {/* Background Image with animated parallax effect */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: theme === 'dark' 
            ? `linear-gradient(rgba(18, 8, 34, 0.45) 0%, rgba(18, 8, 34, 0.3) 50%, rgba(18, 8, 34, 0.95) 100%), url('${FLEET_IMAGE}')`
            : `linear-gradient(rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.95) 100%), url('${FLEET_IMAGE}')`,
        }}
      />

      {/* Theme Toggle in Login */}
      <div className="absolute top-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`p-5 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-yellow-400 hover:shadow-yellow-500/20' 
              : 'bg-white border-slate-100 text-slate-600 shadow-slate-200 hover:shadow-slate-300/50'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Animated Light Trails Overlay */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-civa-pink to-transparent animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-civa-purple to-transparent animate-pulse [animation-delay:1s]" />
      </div>

      <AnimatePresence mode="wait">
        {!isRegistering ? (
            <motion.div 
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`w-full max-w-[500px] backdrop-blur-3xl rounded-[4rem] p-12 text-center relative z-10 mx-6 border shadow-2xl transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-200'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-civa-purple via-civa-pink to-civa-purple rounded-t-[4rem]" />
            
            <motion.img 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src={LOGO_URL} 
              alt="CIVA" 
              className={`h-16 mx-auto mb-8 drop-shadow-2xl ${theme === 'dark' ? '' : 'brightness-90 contrast-125'}`}
              onError={(e) => {
                e.currentTarget.src = "https://img.icons8.com/color/96/bus.png";
              }}
            />

            <h1 className={`text-4xl font-display uppercase tracking-tight mb-4 leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Bienvenido a <span className="text-civa-pink">Civa</span>
            </h1>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}

            <p className={`mb-8 font-medium leading-relaxed px-4 ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
              Gestiona tus rutas favoritas con nuestra IA de transporte inteligente.
            </p>

            <div className="space-y-4 mb-4">
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all border ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/5 text-white focus:border-civa-pink/30' 
                      : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-civa-purple/20'
                  }`}
                />
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all border ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/5 text-white focus:border-civa-pink/30' 
                      : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-civa-purple/20'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-5 bg-civa-pink text-white font-black uppercase tracking-widest text-sm rounded-3xl shadow-xl shadow-civa-pink/20"
                >
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </motion.button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-slate-200/20" />
                <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.4em]">O conéctate con</span>
                <div className="flex-1 h-[1px] bg-slate-200/20" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full py-5 font-bold rounded-3xl flex items-center justify-center gap-3 transition-all border shadow-sm ${
                  theme === 'dark' ? 'bg-white text-slate-700 hover:bg-slate-50 border-white/5' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-100'
                }`}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Entrar con Google
              </motion.button>

              <div className="flex gap-4">
                <SocialButton icon={Facebook} color="#1877F2" platform="Facebook" />
                <SocialButton icon={Twitter} color="#000000" platform="X" />
                <SocialButton icon={Instagram} color="#E4405F" platform="Instagram" />
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.4em]">DEMOSTRACIÓN</span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full py-5 bg-civa-purple text-white font-bold rounded-3xl flex items-center justify-center gap-3 hover:bg-civa-dark shadow-2xl shadow-civa-purple/30 transition-all font-display uppercase tracking-widest"
              >
                <LogIn className="w-5 h-5" />
                Prueba Técnica
              </motion.button>
            </div>

            <div className={`space-y-6 pt-8 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                ¿Eres nuevo? <button onClick={() => setIsRegistering(true)} className="text-civa-pink font-extrabold hover:underline">¡Únete a CIVA!</button>
              </p>
              
              <button 
                onClick={openWhatsApp}
                className={`group flex items-center justify-center gap-3 text-xs font-black transition-all mx-auto uppercase tracking-widest ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
              >
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                ¿Necesitas Ayuda?
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="register"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`w-full max-w-[500px] backdrop-blur-3xl rounded-[4rem] p-12 relative z-10 mx-6 border shadow-2xl transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/50 text-white' : 'bg-white border-slate-100 shadow-slate-200 text-slate-800'
            }`}
          >
            <button 
              onClick={() => setIsRegistering(false)}
              className={`flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mb-8 transition-colors ${theme === 'dark' ? 'text-white/20 hover:text-civa-pink' : 'text-slate-400 hover:text-civa-purple'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </button>

            <h2 className="text-4xl font-display uppercase tracking-tight mb-2">CREAR <span className="text-civa-pink">CUENTA</span></h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <p className={`mb-10 font-bold italic ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Únete a la nueva era del transporte en Perú.</p>
            
            <form onSubmit={handleRegistration} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Nombre Completo</label>
                <div className="relative">
                  <UserPlus className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-white/10' : 'text-slate-300'}`} />
                  <input 
                    type="text" 
                    placeholder="Tu nombre aquí"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={`w-full pl-16 pr-8 py-5 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 transition-all border ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/5 text-white focus:ring-civa-pink/10 focus:border-civa-pink/30' 
                        : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-civa-purple/5 focus:border-civa-purple/20'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Correo Electrónico</label>
                <div className="relative">
                  <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-white/10' : 'text-slate-300'}`} />
                  <input 
                    type="email" 
                    placeholder="email@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full pl-16 pr-8 py-5 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 transition-all border ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/5 text-white focus:ring-civa-pink/10 focus:border-civa-pink/30' 
                        : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-civa-purple/5 focus:border-civa-purple/20'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Contraseña</label>
                <div className="relative">
                  <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-white/10' : 'text-slate-300'}`} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full pl-16 pr-8 py-5 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 transition-all border ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/5 text-white focus:ring-civa-pink/10 focus:border-civa-pink/30' 
                        : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-civa-purple/5 focus:border-civa-purple/20'
                    }`}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-civa-pink text-white font-black uppercase tracking-widest text-sm rounded-3xl shadow-xl shadow-civa-pink/20 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
              >
                {loading ? "Creando Cuenta..." : "Comenzar Aventura"}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 inset-x-0 hidden lg:flex justify-center flex-col items-center gap-2">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[1em] mb-4">
          LíDERES EN INNOVACIÓN DESDE 1971
        </p>
        <div className="flex gap-8 opacity-20">
           <img src="https://www.civa.com.pe/assets/img/logo_excluciva.png" alt="Excluciva" className="h-4 brightness-0 invert" />
           <img src="https://www.civa.com.pe/assets/img/logo_superciva.png" alt="Superciva" className="h-4 brightness-0 invert" />
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon: Icon, color, platform }: { icon: any, color: string, platform: string }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1, translateY: -5 }}
      whileTap={{ scale: 0.9 }}
      className="flex-1 py-4 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shadow-sm hover:shadow-xl transition-all group"
      title={platform}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color }} />
    </motion.button>
  );
}
