import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { UserProfile, Reservation } from '../types';
import { Bus, MapPin, Calendar, QrCode, Ticket, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Reservations({ profile, onViewQR }: { profile: UserProfile | null, onViewQR: (res: Reservation) => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reservations');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!window.confirm('¿Deseas eliminar este registro de viaje definitivamente?')) return;
    try {
      console.log('Deleting reservation:', id);
      const resRef = doc(db, 'reservations', id);
      await deleteDoc(resRef);
      console.log('Deleted reservation successfully');
    } catch (error) {
      console.error('Delete error details:', error);
      handleFirestoreError(error, OperationType.DELETE, `reservations/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-civa-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8 max-w-4xl pb-20">
      <div>
        <h2 className="text-4xl font-display uppercase tracking-tight text-civa-purple">Mis <span className="text-civa-pink">Aventuras</span></h2>
        <p className="text-slate-500 font-medium italic">Historial de pasajes y rutas gestionadas por IA.</p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <Ticket className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-300 italic">No tienes reservas aún</h3>
            <p className="text-slate-400 mt-2">¡Conversa con el Copiloto IA para planificar tu primer viaje!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {reservations.map((res, i) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-wrap md:flex-nowrap gap-8 items-center hover:shadow-2xl hover:border-civa-purple/10 transition-all shadow-sm"
              >
                <div className="w-20 h-20 bg-civa-purple/5 rounded-[1.5rem] flex items-center justify-center text-civa-purple shrink-0">
                  <Bus className="w-10 h-10" />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                     <MapPin className="w-3.5 h-3.5" />
                     <span className="text-[10px] uppercase font-black tracking-widest">Ruta Directa</span>
                  </div>
                  <p className="font-display text-2xl text-slate-800 uppercase leading-none">{(res.origin || 'Lima')} <span className="text-civa-pink">→</span> {(res.destinationName || 'Destino')}</p>
                </div>

                <div className="min-w-[150px]">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                     <Calendar className="w-3.5 h-3.5" />
                     <span className="text-[10px] uppercase font-black tracking-widest">Fecha Viaje</span>
                  </div>
                  <p className="font-bold text-slate-700">{res.departureDate ? new Date(res.departureDate).toLocaleDateString() : 'Pendiente'}</p>
                </div>

                <div className="flex items-center gap-4">
                   <div className={`px-4 py-2 rounded-2xl text-[10px] uppercase font-black tracking-widest ${
                     res.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' : 
                     res.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                   }`}>
                     {res.status === 'confirmed' ? 'Confirmado' : res.status === 'pending' ? 'Pendiente' : res.status}
                   </div>
                   
                   <button 
                    onClick={() => onViewQR(res)}
                    className="p-4 bg-civa-purple text-white rounded-2xl shadow-lg shadow-civa-purple/20 hover:bg-civa-dark transition-all"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={() => handleDelete(res.id!)}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl transition-all hover:bg-red-600 hover:text-white border border-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
