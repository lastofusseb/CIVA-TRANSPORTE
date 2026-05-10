import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Save, 
  ShieldCheck, 
  CreditCard, 
  Bell,
  Plus,
  Trash2,
  Lock,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProfileProps {
  profile: UserProfile | null;
}

export default function Profile({ profile }: ProfileProps) {
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
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-civa-purple/5">
        <div>
           <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-display uppercase tracking-tight text-civa-purple mb-3 leading-none"
           >
            Mi <span className="text-civa-pink">Universo</span> CIVA
           </motion.h1>
           <p className="text-slate-500 font-bold italic text-xl">Personaliza tu identidad abordo de la flota más moderna del Perú.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-purple-900/[0.03] flex items-center gap-4">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estado de Pasajero: Activo</span>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[400px_1fr] gap-12">
        {/* Left: Identity Card */}
        <div className="space-y-8">
          <motion.div 
            whileHover={{ translateY: -10 }}
            className="bg-civa-dark rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-civa-purple/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-civa-pink/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center space-y-8">
              <div className="relative inline-block">
                <div className="p-1.5 bg-gradient-to-br from-civa-purple via-civa-pink to-civa-accent rounded-[3.5rem] shadow-2xl">
                  <div className="w-40 h-40 rounded-[3.2rem] bg-[#1a0b2e] flex items-center justify-center overflow-hidden border-4 border-[#120822]">
                    <UserIcon className="w-20 h-20 text-white/20" />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-1 right-1 p-5 bg-white text-civa-purple rounded-3xl shadow-xl border-4 border-civa-dark hover:bg-civa-pink hover:text-white transition-all"
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              </div>

              <div>
                <h3 className="font-display uppercase text-3xl tracking-tight mb-2 leading-none">{profile?.fullName}</h3>
                <p className="inline-block px-4 py-1.5 bg-white/5 rounded-full text-civa-accent font-black uppercase tracking-[0.2em] text-[9px] border border-white/5">Viajero Élite • Plata</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                   <p className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">Viajes</p>
                   <p className="text-3xl font-display text-civa-pink leading-none">12</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                   <p className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">Puntos</p>
                   <p className="text-3xl font-display text-civa-accent leading-none">4.2K</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="civa-gradient-vibrant rounded-[3rem] p-1 shadow-xl shadow-civa-pink/10">
            <div className="bg-civa-dark/95 backdrop-blur-xl rounded-[2.8rem] p-8 text-white relative overflow-hidden group border border-white/5">
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <ShieldCheck className="w-6 h-6 text-civa-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Seguridad Biométrica</p>
                      <p className="text-[9px] text-white/40 font-bold">Reconocimiento facial activo</p>
                    </div>
                  </div>
                  <div className="w-12 h-7 bg-civa-accent/10 rounded-full flex items-center px-1 border border-civa-accent/20">
                    <div className="w-5 h-5 bg-civa-accent rounded-full ml-auto shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Management Sections */}
        <div className="space-y-10">
          {/* Settings Section */}
          <section className="card-vibrant rounded-[4rem] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-civa-purple/[0.02] rounded-full blur-[80px]" />
            <div className="flex items-center gap-4 mb-12">
              <div className="w-2 h-10 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full" />
              <h3 className="font-display text-2xl uppercase tracking-tight text-slate-800 leading-none">Parámetros de <span className="text-civa-pink">Cuenta</span></h3>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Identidad del Pasajero</label>
                <div className="relative group">
                  <UserIcon className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-civa-purple transition-colors" />
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold text-slate-800 focus:outline-none focus:ring-8 focus:ring-civa-purple/[0.03] focus:border-civa-purple/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-2">ID Digital de Acceso</label>
                <div className="relative">
                  <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full pl-16 pr-8 py-6 bg-slate-50/50 border border-slate-50 rounded-[2rem] text-sm font-bold text-slate-400 cursor-not-allowed italic"
                  />
                  <div className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protegido</span>
                    <Lock className="w-4 h-4 text-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-50">
              <p className="text-[11px] text-slate-400 font-bold max-w-sm italic leading-relaxed">
                Tus datos están protegidos por el <span className="text-civa-purple">CIVA Privacy Core</span>. Cumplimos rigurosamente con la Ley 29733 de Protección de Datos en Perú.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                disabled={loading}
                className="w-full md:w-auto px-12 py-5 civa-gradient-purple text-white rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 shadow-2xl shadow-civa-purple/20 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Actualizar Identidad
              </motion.button>
            </div>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-center gap-3"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{message}</p>
              </motion.div>
            )}
          </section>

          {/* Cards Section */}
          <section className="card-vibrant rounded-[4rem] p-12 relative overflow-hidden">
            <div className="absolute top-12 right-12 z-20">
               <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCardModal(true)}
                className="w-16 h-16 bg-civa-dark text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl hover:bg-civa-pink transition-all group"
               >
                 <Plus className="w-7 h-7 group-hover:scale-110 transition-transform" />
               </motion.button>
            </div>

            <div className="flex items-center gap-4 mb-14">
              <div className="w-2 h-10 bg-civa-accent rounded-full" />
              <h3 className="font-display text-2xl uppercase tracking-tight text-slate-800 leading-none">Bóveda de <span className="text-civa-accent">Pagos</span></h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05, rotate: -1, translateY: -5 }}
                  className={`relative p-10 rounded-[3rem] bg-gradient-to-br ${card.color} text-white shadow-2xl shadow-purple-900/10 min-h-[220px] flex flex-col justify-between group overflow-hidden border border-white/10`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_70%)]" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-[40px] group-hover:bg-white/10 transition-all" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                      <CreditCard className="w-8 h-8 text-white/80" />
                    </div>
                    <button 
                      onClick={() => setCards(cards.filter(c => c.id !== card.id))}
                      className="opacity-0 group-hover:opacity-100 p-3 bg-white/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative z-10 pt-8">
                    <p className="text-2xl font-display tracking-[0.2em] leading-none mb-3 text-white drop-shadow-md">{card.number}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{card.brand} Platinum</p>
                      <img src={`https://img.icons8.com/color/48/${card.brand.toLowerCase()}.png`} alt="" className="h-6 opacity-80" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {cards.length === 0 && (
                <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/50">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="w-10 h-10 text-slate-300" />
                   </div>
                   <p className="text-slate-400 font-bold italic">Tu bóveda de pagos está vacía.</p>
                   <button onClick={() => setShowCardModal(true)} className="mt-4 text-civa-purple font-black uppercase text-[10px] tracking-widest hover:underline">Vincular una ahora</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowCardModal(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 max-w-md w-full relative z-10 shadow-2xl"
          >
            <h3 className="text-3xl font-display uppercase text-civa-purple mb-8">Vincular Nueva Tarjeta</h3>
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Número de Tarjeta</label>
                 <input type="text" placeholder="#### #### #### ####" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">Expira</label>
                   <input type="text" placeholder="MM/YY" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400">CVC</label>
                   <input type="password" placeholder="***" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" />
                 </div>
               </div>
               <button 
                onClick={addCard}
                className="w-full py-5 bg-civa-pink text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-civa-pink/20 mt-4"
               >
                 Confirmar Vinculación
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
