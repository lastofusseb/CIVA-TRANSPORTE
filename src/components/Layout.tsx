import React from 'react';
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
  BarChart3
} from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: UserProfile | null;
}

export default function Layout({ children, currentTab, setCurrentTab, profile }: LayoutProps) {
  const menuItems = [
    { id: 'copilot', label: 'Copiloto IA', icon: MessageSquare },
    { id: 'destinations', label: 'Explora Perú', icon: MapPin },
    { id: 'reservations', label: 'Mis Reservas', icon: History },
    { id: 'profile', label: 'Mi Perfil', icon: UserIcon },
    { id: 'metrics', label: 'Metodología', icon: BarChart3 },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-[#f5f3ff] text-slate-900 font-sans overflow-hidden selection:bg-civa-pink selection:text-white">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 sidebar-gradient flex flex-col shrink-0 relative z-20 shadow-[10px_0_50px_rgba(0,0,0,0.1)]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-civa-pink/10 to-transparent pointer-events-none opacity-50" />
        
        <div className="p-10 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <motion.img 
              whileHover={{ scale: 1.05, rotate: -2 }}
              src="https://www.civa.com.pe/assets/img/logo_civa.png" 
              alt="CIVA" 
              className="h-10 mb-4 brightness-0 invert drop-shadow-lg" 
            />
            <div className="w-20 h-1 bg-gradient-to-r from-civa-accent to-civa-pink rounded-full" />
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all relative group ${
                  currentTab === item.id 
                    ? 'text-white font-bold' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                {currentTab === item.id && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-gradient-to-r from-civa-pink/90 to-civa-purple rounded-3xl shadow-[0_10px_30px_rgba(216,27,96,0.3)] border border-white/10" 
                  />
                )}
                <item.icon className={`relative z-10 w-5 h-5 transition-transform group-hover:scale-110 ${currentTab === item.id ? 'text-white' : 'text-white/40'}`} />
                <span className="relative z-10 tracking-wide text-sm">{item.label}</span>
                {currentTab === item.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" 
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 relative z-10">
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/5 mb-6">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civa-pink to-civa-purple flex items-center justify-center font-bold text-white shadow-lg text-sm shrink-0">
                {profile?.fullName?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate text-white leading-tight text-sm">{profile?.fullName}</p>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest truncate">Pasajero VIP</p>
              </div>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 font-black text-[9px] uppercase tracking-[0.2em] hover:bg-civa-pink hover:text-white hover:border-civa-pink transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Desconectar
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f5f3ff] relative">
        <header className="h-24 border-b border-white flex items-center justify-between px-12 shrink-0 relative z-30">
          <div className="flex items-center gap-2">
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-civa-purple/5 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-civa-pink" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">CIVA Smart Suite</p>
                    <h1 className="text-2xl font-display uppercase tracking-tight text-civa-purple leading-none">
                      {menuItems.find(i => i.id === currentTab)?.label || 'CIVA'}
                    </h1>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               Sistemas Online
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-civa-purple hover:shadow-xl transition-all">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-auto relative z-10 scroll-smooth">
          <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-civa-purple/[0.03] to-transparent pointer-events-none" />
          <div className="h-full">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
