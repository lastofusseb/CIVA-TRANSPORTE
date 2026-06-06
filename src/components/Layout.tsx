import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  MapPin, 
  History, 
  CreditCard, 
  LogOut, 
  User as UserIcon,
  Settings,
  Sparkles,
  BarChart3,
  Sun,
  Moon,
  Book,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: UserProfile | null;
}

export default function Layout({ children, currentTab, setCurrentTab, profile }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const menuItems = [
    { id: 'copilot', label: 'Copiloto IA', icon: MessageSquare },
    { id: 'destinations', label: 'Explora Perú', icon: MapPin },
    { id: 'terminals', label: 'Ubicaciones', icon: MapPin },
    { id: 'reservations', label: 'Mis Reservas', icon: History },
    { id: 'profile', label: 'Mi Perfil', icon: UserIcon },
    { id: 'reclamaciones', label: 'Reclamaciones', icon: Book },
    ...(isAdmin ? [{ id: 'metrics', label: 'Metodología', icon: BarChart3 }] : []),
    { id: 'payments', label: 'Pagos', icon: CreditCard },
  ];

  const SidebarContent = () => (
    <div className="p-8 md:p-12 relative z-10 flex flex-col h-full">
      <div className="flex flex-col items-center mb-16 px-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="cursor-pointer"
          onClick={() => { setCurrentTab('copilot'); setIsSidebarOpen(false); }}
        >
          <img 
            src="https://www.civa.com.pe/assets/img/logo_civa.png" 
            alt="CIVA" 
            className={`h-10 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${theme === 'dark' ? 'brightness-0 invert' : ''}`} 
          />
        </motion.div>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
      </div>

      <nav className="space-y-3 flex-1 overflow-y-auto custom-scrollbar px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setCurrentTab(item.id); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
              currentTab === item.id 
                ? 'bg-white shadow-xl ring-1 ring-white/20' 
                : 'hover:bg-white/5 opacity-40 hover:opacity-100'
            }`}
          >
            {currentTab === item.id && (
              <motion.div 
                layoutId="active-bg"
                className="absolute inset-0 bg-white" 
              />
            )}
            <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${currentTab === item.id ? 'bg-civa-pink/10' : 'bg-transparent'}`}>
              <item.icon className={`w-5 h-5 ${currentTab === item.id ? 'text-civa-pink' : 'text-white'}`} />
            </div>
            <span className={`relative z-10 tracking-[0.15em] text-[9px] uppercase font-black ${currentTab === item.id ? 'text-slate-900' : 'text-white'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 px-2">
        <div className={`backdrop-blur-3xl p-5 rounded-3xl border shadow-xl ring-1 group/profile ${
          theme === 'dark' ? 'bg-[#1a0b2e]/40 border-white/[0.03] ring-white/5' : 'bg-white/10 border-white/10 ring-white/5'
        }`}>
          <div className="flex items-center gap-4 mb-5 px-1 relative z-10">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl text-sm shrink-0 border italic ${
              theme === 'dark' ? 'bg-gradient-to-br from-[#4e1e8b] to-[#0b0612] border-white/5' : 'bg-gradient-to-br from-civa-purple to-civa-pink border-transparent'
            }`}>
              {profile?.fullName?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-black truncate leading-tight text-[11px] tracking-tight text-white">{profile?.fullName}</p>
              <p className="text-[7px] font-black text-civa-pink uppercase tracking-[0.2em] truncate mt-1">Platino VIP</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              localStorage.removeItem('civa_local_profile');
              try {
                await signOut(auth);
              } catch (e) {
                console.warn(e);
              }
              window.location.reload();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/5 bg-white/5 rounded-xl font-black text-[8px] uppercase tracking-widest text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Desconectar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-[#06030a] text-slate-100' : 'bg-white text-slate-900'} font-sans overflow-hidden selection:bg-civa-pink selection:text-white transition-colors duration-700`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden xl:flex w-80 ${theme === 'dark' ? 'bg-[#0b0612]/80 border-white-[0.03]' : 'bg-[#1a0b2e] border-white/5'} backdrop-blur-3xl flex-col shrink-0 relative z-40 border-r shadow-2xl`}>
        <SidebarContent />
      </aside>

      {/* Mobile/Tablet Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] xl:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#1a0b2e] z-[70] xl:hidden shadow-2xl border-r border-white/10"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-w-0 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-white'} relative transition-colors duration-700 overflow-hidden`}>
        <header className={`h-20 md:h-28 border-b ${theme === 'dark' ? 'border-white/[0.03] bg-[#0b0612]/60' : 'border-slate-100 bg-white shadow-sm'} backdrop-blur-[40px] flex items-center justify-between px-6 md:px-16 shrink-0 relative z-50`}>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-3 xl:hidden hover:bg-white/5 rounded-xl transition-colors"
             >
               <Menu className={theme === 'dark' ? 'text-white/40' : 'text-slate-400'} />
             </button>
             
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-3xl border flex items-center justify-center shadow-inner relative group ${
                  theme === 'dark' ? 'bg-[#1a0b2e]/60 border-white/[0.05]' : 'bg-slate-50 border-slate-100 shadow-slate-100'
                }`}>
                  <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-civa-pink relative z-10 drop-shadow-[0_0_12px_rgba(216,27,96,0.8)]" />
                </div>
                <div className="hidden sm:block">
                  <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] leading-none mb-1.5 md:mb-2.5 italic ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`}>Protocolo Neural</p>
                  <h1 className={`text-xl md:text-5xl font-display uppercase tracking-tight leading-none italic font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {menuItems.find(i => i.id === currentTab)?.label || 'CIVA'}
                  </h1>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            {profile?.isLocal && (
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em] leading-none mb-1">⚠️ Sincronización Local</span>
                <span className="text-[7px] text-white/40 leading-none">Activa Firebase Auth (Email/Anónimo)</span>
              </div>
            )}
            
            <div className={`hidden md:flex items-center gap-4 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] border ring-1 shadow-sm ${
              theme === 'dark' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10 ring-emerald-500/10' : 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-50'
            }`}>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_15px_rgba(16,185,129,1)]" />
               Activo
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-3 md:p-4 border rounded-2xl md:rounded-2.5xl transition-all shadow-inner group ${
                  theme === 'dark' ? 'bg-white/[0.03] border-white/[0.05] text-white/20 hover:text-white/60' : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-civa-purple'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
              </motion.button>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-x-hidden overflow-y-auto relative z-10 scroll-smooth custom-scrollbar">
          <div className="h-full flex flex-col">
            <div className="flex-1 relative z-20">
              {children}
            </div>
            <Footer onOpenLibro={() => setCurrentTab('reclamaciones')} />
          </div>
        </section>
      </main>
    </div>
  );
}
