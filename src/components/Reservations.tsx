import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { UserProfile, Reservation } from '../types';
import { Bus, MapPin, Calendar, QrCode, Ticket, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function Reservations({ profile, onViewQR }: { profile: UserProfile | null, onViewQR: (res: Reservation) => void }) {
  const { theme } = useTheme();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    if (profile.isLocal) {
      try {
        const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
        setReservations(stored ? JSON.parse(stored) : []);
      } catch (err) {
        console.error("Local reservation fetch error:", err);
      }
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setReservations(docsList);
      setLoading(false);
    }, (error) => {
      console.warn("Firestore reservations listen failed, falling back to local storage:", error);
      try {
        const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
        setReservations(stored ? JSON.parse(stored) : []);
      } catch {
        setReservations([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!profile) return;
    if (!window.confirm('¿Deseas eliminar este registro de viaje definitivamente?')) return;

    if (profile.isLocal) {
      try {
        const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((r: any) => r.id !== id);
        localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(filtered));
        setReservations(filtered);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      console.log('Deleting reservation:', id);
      const resRef = doc(db, 'reservations', id);
      await deleteDoc(resRef);
      console.log('Deleted reservation successfully');

      // Sync backup
      try {
        const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
        if (stored) {
          const list = JSON.parse(stored);
          localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(list.filter((r: any) => r.id !== id)));
        }
      } catch {}
    } catch (error) {
      console.warn('Delete reservation from Firestore failed, deleting locally:', error);
      try {
        const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((r: any) => r.id !== id);
        localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(filtered));
        setReservations(filtered);
      } catch {
        setReservations(prev => prev.filter(r => r.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className={`h-full flex items-center justify-center transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-civa-pink drop-shadow-[0_0_15px_rgba(216,27,96,0.5)]" />
          </motion.div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Sincronizando Archivos Históricos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-12 space-y-16 max-w-6xl pb-32 relative min-h-full font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-civa-purple/5' : 'bg-gradient-to-br from-civa-purple/20 via-transparent to-civa-pink/10'} to-transparent pointer-events-none`} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-1.5 h-12 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_20px_rgba(216,27,96,0.4)]" />
          <h2 className="text-6xl font-display uppercase tracking-tight leading-none text-white">Mis <span className="text-civa-pink italic drop-shadow-[0_0_20px_rgba(216,27,96,0.3)]">Crónicas de Viaje</span></h2>
        </motion.div>
        <p className="text-lg font-medium italic mt-2 max-w-2xl leading-relaxed text-white/40">Registro inmutable de trayectorias, itinerarios y conﬁrmaciones gestionadas por el <span className="text-white/60">Sistema Neural CIVA</span>.</p>
      </div>

      {reservations.length === 0 ? (
        <div className={`border-2 border-dashed rounded-[5rem] p-32 text-center backdrop-blur-3xl relative overflow-hidden group shadow-2xl ring-1 ${
          theme === 'dark' ? 'bg-white/5 border-white/5 ring-white/5' : 'bg-white/5 border-white/10 ring-white/5 shadow-black/40'
        }`}>
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Ticket className={`w-24 h-24 mx-auto mb-10 group-hover:text-civa-pink/30 group-hover:scale-110 transition-all duration-700 text-white/10`} />
            <h3 className="text-3xl font-display uppercase tracking-[0.2em] italic mb-6 text-white/20">Archivo Histórico Vacío</h3>
            <p className="text-base font-medium max-w-md mx-auto italic text-white/30">Proyecte su próxima trayectoria sincronizando sus intenciones con nuestro Copiloto Inteligente.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {reservations.map((res, i) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`group backdrop-blur-3xl border rounded-[4rem] p-12 flex flex-wrap lg:flex-nowrap gap-12 items-center transition-all duration-700 shadow-2xl relative overflow-hidden ring-1 ${
                  theme === 'dark' ? 'bg-[#1a0b2e]/40 border-white/5 ring-white/5 hover:bg-[#1a0b2e]/60 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] hover:border-civa-pink/40' : 'bg-white/5 border-white/10 ring-white/5 shadow-black/40 hover:bg-white/10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-civa-pink/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center group-hover:text-civa-pink group-hover:scale-110 transition-all border shadow-inner ring-1 ${
                  theme === 'dark' ? 'bg-[#0b0612] text-white/10 border-white/10 ring-white/5' : 'bg-black/20 text-white/10 border-white/10 shadow-inner'
                }`}>
                  <Bus className="w-14 h-14 drop-shadow-[0_0_15px_rgba(216,27,96,0.3)]" />
                </div>

                <div className="flex-1 min-w-[280px] relative z-10 space-y-4">
                  <div className="flex items-center gap-4 text-white/20">
                     <MapPin className="w-5 h-5 text-civa-pink animate-pulse shadow-[0_0_10px_rgba(216,27,96,0.5)]" />
                     <span className="text-[10px] uppercase font-black tracking-[0.5em] italic">Vector de Operación</span>
                  </div>
                  <p className="font-display text-5xl uppercase leading-none group-hover:text-civa-pink transition-colors tracking-tighter italic text-white">{(res.origin || 'Lima')} <span className="text-civa-pink/30 not-italic">→</span> {(res.destinationName || 'Destino')}</p>
                </div>

                <div className="min-w-[200px] relative z-10 space-y-4">
                  <div className="flex items-center gap-4 text-white/20">
                     <Calendar className="w-5 h-5 text-white/20" />
                     <span className="text-[10px] uppercase font-black tracking-[0.5em] italic">Cronograma Temporal</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight italic font-display leading-none text-white/60">{res.departureDate ? new Date(res.departureDate).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Próximo Ciclo'}</p>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                   <div className={`px-10 py-4 rounded-[1.8rem] text-[10px] uppercase font-black tracking-[0.4em] italic shadow-inner border transition-all duration-700 ${
                     res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 
                     res.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/5 text-white/30 border-white/5'
                   }`}>
                     {res.status === 'confirmed' ? 'VERIFICADO' : res.status === 'pending' ? 'EN PROCESO' : res.status}
                   </div>
                   
                    <div className="flex gap-4">
                       <motion.button 
                         whileHover={{ scale: 1.1, y: -5 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => onViewQR(res)}
                         className={`p-6 rounded-3xl shadow-xl transition-all border border-transparent ${
                           theme === 'dark' ? 'bg-white text-civa-purple hover:bg-civa-pink hover:text-white hover:border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : 'bg-white text-civa-purple hover:bg-civa-pink hover:text-white shadow-lg shadow-black/40'
                         }`}
                       >
                         <QrCode className="w-7 h-7" />
                       </motion.button>
  
                       <motion.button 
                         whileHover={{ scale: 1.1, y: -5 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => handleDelete(res.id!)}
                         className={`p-6 rounded-3xl transition-all border shadow-inner ${
                           theme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white hover:border-transparent'
                         }`}
                         title="Eliminar Registro de Reserva"
                       >
                         <Trash2 className="w-7 h-7" />
                       </motion.button>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
