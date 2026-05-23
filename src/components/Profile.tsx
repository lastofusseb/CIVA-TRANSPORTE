import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Save, 
  ShieldCheck, 
  CreditCard, 
  Plus,
  Trash2,
  Lock,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

interface ProfileProps {
  profile: UserProfile | null;
}

export default function Profile({ profile }: ProfileProps) {
  const { theme } = useTheme();
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);
  const [cards, setCards] = useState([
    { id: '1', number: '**** **** **** 4590', brand: 'Visa', color: 'from-blue-600 to-blue-400' }
  ]);

  const handleUpdate = async () => {
    if (!profile) return;
    setLoading(true);
    setMessage('');
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { fullName });
      setMessage('¡Perfil actualizado con éxito! ✨');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Error al actualizar.');
    } finally {
      setLoading(false);
    }
  };

  const addCard = () => {
    const newCard = { 
      id: Math.random().toString(), 
      number: `**** **** **** ${Math.floor(Math.random() * 9000 + 1000)}`, 
      brand: 'Mastercard', 
      color: 'from-civa-purple to-civa-dark' 
    };
    setCards([...cards, newCard]);
    setShowCardModal(false);
  };

  return (
    <div className={`p-10 max-w-7xl mx-auto space-y-16 relative overflow-hidden min-h-full font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-civa-purple/5' : 'bg-gradient-to-br from-civa-purple/20 via-transparent to-civa-pink/10'} to-transparent pointer-events-none`} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-50/5 rounded-full blur-[100px] pointer-events-none" />

      <header className={`relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10`}>
        <div>
           <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-6xl font-display uppercase tracking-tight mb-3 leading-none text-white`}
           >
            Mi <span className="text-civa-pink drop-shadow-[0_0_15px_rgba(216,27,96,0.3)]">Explorador</span>
           </motion.h1>
           <p className={`font-bold italic text-xl text-white/40`}>Tu identidad en el ecosistema digital de transporte más avanzado.</p>
        </div>
        <div className="flex gap-4">
           <div className={`px-8 py-4 backdrop-blur-xl border rounded-[2rem] shadow-2xl flex items-center gap-4 bg-white/5 border-white/10`}>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-white/40`}>Sincronización: Activa</span>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[400px_1fr] gap-12 relative z-10">
        {/* Left: Identity Card */}
        <div className="space-y-8">
          <motion.div 
            whileHover={{ translateY: -10 }}
            className={`backdrop-blur-3xl rounded-[4rem] p-12 relative overflow-hidden shadow-2xl border ring-1 transition-all ${
              theme === 'dark' ? 'bg-[#1a0b2e]/60 text-white border-white/5 ring-white/10' : 'bg-white/5 text-white border-white/10 ring-white/5 shadow-black/40'
            }`}
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-civa-pink/15 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center space-y-8">
              <div className="relative inline-block">
                <div className="p-1.5 bg-gradient-to-br from-civa-purple via-civa-pink to-civa-accent rounded-[3.5rem] shadow-2xl">
                  <div className={`w-40 h-40 rounded-[3.2rem] flex items-center justify-center overflow-hidden border-4 ${
                    theme === 'dark' ? 'bg-[#0f0716] border-white/5' : 'bg-black/20 border-white/10'
                  }`}>
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all" />
                    ) : (
                      <UserIcon className={`w-20 h-20 text-white/10`} />
                    )}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute bottom-1 right-1 p-5 rounded-3xl shadow-xl border-4 transition-all transform hover:scale-110 active:scale-95 bg-white text-civa-purple border-[#1a0b2e] hover:bg-civa-pink hover:text-white`}
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              </div>

              <div>
                <h3 className={`font-display uppercase text-3xl tracking-tight mb-2 leading-none italic text-white`}>{profile?.fullName}</h3>
                <p className={`inline-block px-5 py-2 rounded-full font-black uppercase tracking-[0.3em] text-[10px] border backdrop-blur-md bg-white/5 text-civa-accent border-white/10`}>Pasajero VIP • Platino</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className={`p-6 rounded-[2.5rem] border backdrop-blur-xl shadow-inner bg-white/5 border-white/5`}>
                   <p className={`text-[9px] uppercase font-black tracking-widest mb-1 text-white/20`}>Rutas</p>
                   <p className={`text-4xl font-display italic leading-none text-white`}>24</p>
                </div>
                <div className={`p-6 rounded-[2.5rem] border backdrop-blur-xl shadow-inner bg-white/5 border-white/5`}>
                   <p className={`text-[9px] uppercase font-black tracking-widest mb-1 text-white/20`}>Millas</p>
                   <p className="text-4xl font-display text-civa-pink italic leading-none">8.5K</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className={`backdrop-blur-3xl rounded-[3rem] p-1 shadow-xl border bg-white/5 border-white/10`}>
            <div className={`rounded-[2.8rem] p-10 relative overflow-hidden group bg-[#0f0716]/80 text-white`}>
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl border shadow-inner bg-white/5 border-white/10`}>
                      <ShieldCheck className="w-6 h-6 text-civa-accent drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Identity Shield</p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest text-white/30`}>Protección Criptográfica</p>
                    </div>
                  </div>
                  <div className={`w-12 h-7 rounded-full flex items-center px-1 border bg-white/5 border-white/10`}>
                    <div className="w-5 h-5 bg-emerald-500 rounded-full ml-auto shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Management Sections */}
        <div className="space-y-10">
          {/* Settings Section */}
          <section className={`backdrop-blur-3xl border rounded-[4rem] p-12 relative overflow-hidden shadow-2xl bg-white/5 border-white/10 shadow-black/40`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="flex items-center gap-5 mb-14">
              <div className="w-2.5 h-10 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_15px_rgba(216,27,96,0.2)]" />
              <h3 className={`font-display text-3xl uppercase tracking-tight leading-none text-white`}>Matriz de <span className="text-civa-pink">Usuario</span></h3>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <div className="space-y-4">
                <label className={`text-[9px] font-black uppercase tracking-[0.4em] ml-4 text-white/30`}>Nombre Completo</label>
                <div className="relative group">
                  <UserIcon className={`absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-white/20 group-focus-within:text-civa-pink`} />
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-18 pr-10 py-7 border rounded-[2.5rem] text-sm font-bold focus:outline-none focus:ring-0 focus:border-civa-pink/30 transition-all shadow-inner placeholder:text-white/10 bg-black/40 border-white/5 text-white focus:bg-black/60`}
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className={`text-[9px] font-black uppercase tracking-[0.4em] ml-4 text-white/30`}>Acceso Identificado</label>
                <div className="relative">
                  <Mail className={`absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10`} />
                  <input 
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className={`w-full pl-18 pr-10 py-7 border rounded-[2.5rem] text-sm font-bold cursor-not-allowed italic shadow-inner bg-white/[0.02] border-white/[0.02] text-white/20`}
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] text-white/10`}>Verificado</span>
                    <Lock className={`w-4 h-4 text-white/5`} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-white/10`}>
              <p className={`text-[10px] font-medium max-w-sm italic leading-loose tracking-wide text-white/20`}>
                Tus credenciales están resguardadas bajo <span className={`text-white/40 font-bold uppercase`}>Civa Secure Core</span>. En cumplimiento total con estándares globales de privacidad de datos.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                disabled={loading}
                className={`w-full md:w-auto px-14 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all disabled:opacity-50 active:scale-95 border border-transparent bg-white text-civa-purple hover:bg-civa-pink hover:text-white hover:border-white/20`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Guardar Matriz
              </motion.button>
            </div>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-5 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex items-center justify-center gap-4 backdrop-blur-xl"
              >
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">{message}</p>
              </motion.div>
            )}
          </section>

          {/* Cards Section */}
          <section className={`backdrop-blur-3xl border rounded-[4rem] p-12 relative overflow-hidden shadow-2xl bg-white/5 border-white/10 shadow-black/40`}>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-civa-accent/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-12 right-12 z-20">
               <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCardModal(true)}
                className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all group scale-110 bg-white text-civa-purple hover:bg-civa-pink hover:text-white`}
               >
                 <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
               </motion.button>
            </div>

            <div className="flex items-center gap-5 mb-16">
              <div className="w-2.5 h-10 bg-civa-accent rounded-full shadow-[0_0_15px_rgba(0,229,255,0.2)]" />
              <h3 className={`font-display text-3xl uppercase tracking-tight leading-none text-white`}>Bóveda de <span className="text-civa-accent">Activos</span></h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05, rotate: -1, translateY: -8 }}
                  className={`relative p-10 rounded-[3.5rem] bg-gradient-to-br ${card.color} text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] min-h-[240px] flex flex-col justify-between group overflow-hidden border border-white/10`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-[40px]" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="p-4 bg-white/10 rounded-2.5xl backdrop-blur-md border border-white/10 shadow-inner">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <button 
                      onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                      className="opacity-0 group-hover:opacity-100 p-4 bg-red-500 text-white rounded-2.5xl hover:bg-red-600 transition-all backdrop-blur-md shadow-2xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative z-10 pt-10">
                    <p className="text-2xl font-mono tracking-[0.25em] leading-none mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{card.number}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">{card.brand} Reserve</p>
                      <img src={`https://img.icons8.com/color/48/${card.brand.toLowerCase()}.png`} alt="" className="h-7 drop-shadow-md" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {cards.length === 0 && (
                <div className={`col-span-full py-28 text-center border-2 border-dashed rounded-[4rem] backdrop-blur-md flex flex-col items-center justify-center space-y-6 ${
                  theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-white/10 bg-white/[0.02]'
                }`}>
                   <div className={`w-24 h-24 rounded-[3rem] flex items-center justify-center shadow-inner border bg-white/5 text-white/10 border-white/5`}>
                      <CreditCard className="w-12 h-12" />
                   </div>
                   <div className="space-y-2">
                     <p className={`font-display text-2xl uppercase tracking-widest italic text-white/20`}>Cripto-Bóveda Vacía</p>
                     <p className={`text-[9px] font-black uppercase tracking-[0.3em] text-white/10`}>Sincroniza un activo para pagos fluidos</p>
                   </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl" 
            onClick={() => setShowCardModal(false)} 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`border rounded-[4rem] p-16 max-w-lg w-full relative z-[110] shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-[#1a0b2e] border-white/10`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-civa-pink via-civa-purple to-civa-accent rounded-t-full" />
            
            <h3 className={`text-4xl font-display uppercase tracking-tight mb-4 text-white`}>Nueva Bóveda</h3>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-white/40`}>Encriptación de activos de pago</p>
            
            <div className="space-y-8">
               <div className="space-y-3">
                 <label className={`text-[9px] font-black uppercase tracking-[0.4em] ml-4 text-white/20`}>Identificador de Activo</label>
                 <input 
                  type="text" 
                  placeholder="#### #### #### ####" 
                  className={`w-full p-7 border rounded-[2.2rem] text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-civa-pink/30 transition-all font-mono tracking-widest shadow-inner bg-white/5 border-white/5 text-white`} 
                 />
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <label className={`text-[9px] font-black uppercase tracking-[0.4em] ml-4 text-white/20`}>Expiración</label>
                   <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className={`w-full p-7 border rounded-[2.2rem] text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-civa-pink/30 transition-all font-mono shadow-inner bg-white/5 border-white/5 text-white`} 
                   />
                 </div>
                 <div className="space-y-3">
                   <label className={`text-[9px] font-black uppercase tracking-[0.4em] ml-4 text-white/20`}>CVC Token</label>
                   <input 
                    type="password" 
                    placeholder="***" 
                    className={`w-full p-7 border rounded-[2.2rem] text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-civa-pink/30 transition-all shadow-inner bg-white/5 border-white/5 text-white`} 
                   />
                 </div>
               </div>
               <button 
                onClick={addCard}
                className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 mt-6 border border-transparent bg-white text-civa-purple hover:bg-civa-pink hover:text-white hover:border-white/20`}
               >
                 Confirmar Sincronización
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
