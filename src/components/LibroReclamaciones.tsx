import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Send, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';

interface LibroReclamacionesProps {
  profile?: UserProfile;
}

export default function LibroReclamaciones({ profile }: LibroReclamacionesProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hojaNumber, setHojaNumber] = useState('');
  const [consumer, setConsumer] = useState({ fullName: '', address: '', docType: 'DNI', docNumber: '', phone: '', email: '', relationship: '' });
  const [item, setItem] = useState({ type: 'Servicio', amount: 0 });
  const [detail, setDetail] = useState({ type: 'Reclamo', summary: '', request: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  useEffect(() => {
    if (!profile) return;
    
    if (activeTab === 'history') {
      if (profile.isLocal) {
        try {
          const stored = localStorage.getItem(`civa_complaints_${profile.uid}`);
          setHistory(stored ? JSON.parse(stored) : []);
        } catch (err) {
          console.error("Local complaints fetch error:", err);
        }
        return;
      }

      const q = query(
        collection(db, 'complaints'),
        where('userId', '==', profile.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      }, (error) => {
        console.warn("Firestore complaints listen failed, falling back to local storage:", error);
        try {
          const stored = localStorage.getItem(`civa_complaints_${profile.uid}`);
          setHistory(stored ? JSON.parse(stored) : []);
        } catch {
          setHistory([]);
        }
      });
      
      return () => unsubscribe();
    }
  }, [activeTab, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const generatedHoja = `HR-${randomNum}`;
      const uidValue = profile?.uid || 'guest';
      
      const complaintData = {
        userId: uidValue,
        hojaNumber: generatedHoja,
        date: new Date().toISOString(),
        consumer,
        item,
        detail,
        createdAt: new Date().toISOString()
      };

      if (profile?.isLocal) {
        const stored = localStorage.getItem(`civa_complaints_${uidValue}`);
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({ id: 'local_' + Math.random().toString(36).substring(2, 11), ...complaintData });
        localStorage.setItem(`civa_complaints_${uidValue}`, JSON.stringify(list));
        setHistory(list);
      } else {
        try {
          const docRef = await addDoc(collection(db, 'complaints'), {
            ...complaintData,
            createdAt: serverTimestamp()
          });

          // Also save in local storage as a backup
          try {
            const stored = localStorage.getItem(`civa_complaints_${uidValue}`);
            const list = stored ? JSON.parse(stored) : [];
            list.unshift({ id: docRef.id, ...complaintData });
            localStorage.setItem(`civa_complaints_${uidValue}`, JSON.stringify(list));
          } catch {}
        } catch (error) {
          console.warn("Firestore save complaint failed, using local storage backup:", error);
          const stored = localStorage.getItem(`civa_complaints_${uidValue}`);
          const list = stored ? JSON.parse(stored) : [];
          list.unshift({ id: 'local_fb_' + Math.random().toString(36).substring(2, 11), ...complaintData });
          localStorage.setItem(`civa_complaints_${uidValue}`, JSON.stringify(list));
          setHistory(list);
        }
      }

      setHojaNumber(generatedHoja);
      setSubmitted(true);
    } catch (error) {
      console.error('Error saving complaint:', error);
      handleFirestoreError(error, OperationType.CREATE, 'complaints');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className={`p-4 md:p-12 space-y-8 md:space-y-16 max-w-7xl mx-auto pb-32 relative min-h-full font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b3e]'}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-civa-purple/20 via-transparent to-civa-pink/10 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-1.5 h-12 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_20px_rgba(216,27,96,0.4)]" />
          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight leading-none text-white">
            Libro de <span className="text-civa-pink italic drop-shadow-[0_0_20px_rgba(216,27,96,0.3)]">Reclamaciones</span>
          </h2>
        </motion.div>
        <p className="text-base md:text-lg font-medium italic mt-2 max-w-2xl leading-relaxed text-white/40">
          En cumplimiento con las normas de protección al consumidor, ponemos a su disposición este canal digital para el registro de quejas o reclamos.
        </p>
      </div>

      <div className="flex flex-col gap-10 relative z-10">
        {/* Tab Controls */}
        <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl w-fit mx-auto border border-white/5">
          <button 
            onClick={() => setActiveTab('form')}
            className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'form' ? 'bg-civa-pink text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Nuevo Registro
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'history' ? 'bg-civa-pink text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Mis Reclamaciones
          </button>
        </div>

        <div className="flex justify-center items-center py-10 md:py-20 relative z-10">
          {activeTab === 'form' ? (
            !isOpen ? (
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer group relative"
          >
            <div className="absolute inset-0 bg-civa-pink/20 blur-[60px] rounded-full group-hover:bg-civa-pink/40 transition-colors" />
            <div className="relative bg-gradient-to-br from-civa-purple to-[#1a0b2e] p-10 md:p-16 rounded-[3rem] border-2 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col items-center gap-8">
              <Book className="w-24 h-24 md:w-32 md:h-32 text-white group-hover:text-civa-pink transition-colors drop-shadow-[0_0_15px_rgba(216,27,96,0.5)]" />
              <span className="text-white font-black uppercase tracking-[0.4em] text-xs md:text-sm">Abrir Libro Digital</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-5xl backdrop-blur-3xl p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden bg-white/5`}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 hover:bg-white/5 rounded-full transition-colors z-20"
            >
              <X className="text-white/40 group-hover:text-white" />
            </button>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-display uppercase italic text-white">Registro Exitoso</h3>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 inline-block">
                  <p className="text-civa-pink font-black text-2xl tracking-widest">{hojaNumber}</p>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mt-2">Número de Hoja de Reclamación</p>
                </div>
                <p className="text-white/40 max-w-sm mx-auto">Su solicitud ha sido grabada. Podrá descargar el cargo PDF en su correo electrónico.</p>
                <button 
                  onClick={() => { setIsOpen(false); setSubmitted(false); }}
                  className="mt-8 px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
                >
                  Finalizar
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-display uppercase italic text-white">Hoja de Reclamación</h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">El número de hoja se generará automáticamente al enviar.</p>
                  </div>
                  <div className="bg-black/40 px-6 py-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Fecha:</span>
                    <span className="text-white font-bold">{today}</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Section 1 */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-civa-pink flex items-center justify-center text-white font-black text-xs">1</div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/60 text-white/80">Identificación del Consumidor</h4>
                    </div>
                    <div className="grid gap-6">
                      <InputField 
                        label="Nombres y Apellidos *" 
                        placeholder="Consumidor" 
                        required 
                        value={consumer.fullName}
                        onChange={(val) => setConsumer(prev => ({ ...prev, fullName: val }))}
                      />
                      <InputField 
                        label="Dirección *" 
                        placeholder="Domicilio real" 
                        required 
                        value={consumer.address}
                        onChange={(val) => setConsumer(prev => ({ ...prev, address: val }))}
                      />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Tipo de Documento *</label>
                          <select 
                            value={consumer.docType}
                            onChange={(e) => setConsumer(prev => ({ ...prev, docType: e.target.value }))}
                            className="w-full px-6 py-4 rounded-xl bg-black/40 border border-white/5 text-white/80 focus:outline-none focus:border-civa-pink/30 transition-all font-bold appearance-none"
                          >
                            <option>DNI</option>
                            <option>CE</option>
                            <option>Pasaporte</option>
                          </select>
                        </div>
                        <InputField 
                          label="# Documento *" 
                          placeholder="Número" 
                          required 
                          value={consumer.docNumber}
                          onChange={(val) => setConsumer(prev => ({ ...prev, docNumber: val }))}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField 
                          label="Teléfono *" 
                          placeholder="+51" 
                          required 
                          value={consumer.phone}
                          onChange={(val) => setConsumer(prev => ({ ...prev, phone: val }))}
                        />
                        <InputField 
                          label="Email *" 
                          placeholder="correo@ejemplo.pe" 
                          required 
                          value={consumer.email}
                          onChange={(val) => setConsumer(prev => ({ ...prev, email: val }))}
                        />
                      </div>
                      <InputField 
                        label="Parentesco (En caso de menor)" 
                        placeholder="Padre/Madre/Tutor" 
                        value={consumer.relationship}
                        onChange={(val) => setConsumer(prev => ({ ...prev, relationship: val }))}
                      />
                    </div>
                  </div>

                  {/* Section 2 & 3 */}
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-civa-purple flex items-center justify-center text-white font-black text-xs">2</div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Identificación del Bien</h4>
                      </div>
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Tipo de Bien *</label>
                          <div className="flex gap-4">
                            {['Servicio', 'Producto'].map(opt => (
                              <label key={opt} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                                <input 
                                  type="radio" 
                                  name="bien" 
                                  className="accent-civa-pink" 
                                  checked={item.type === opt}
                                  onChange={() => setItem(prev => ({ ...prev, type: opt }))}
                                />
                                <span className="text-[10px] font-black text-white/60 uppercase">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <InputField 
                          label="Monto Reclamado (S/) *" 
                          placeholder="0.00" 
                          type="number" 
                          required 
                          value={item.amount.toString()}
                          onChange={(val) => setItem(prev => ({ ...prev, amount: parseFloat(val) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-civa-accent flex items-center justify-center text-white font-black text-xs">3</div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Detalle de la Reclamación</h4>
                      </div>
                      <div className="grid gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Tipo *</label>
                          <div className="flex gap-4">
                            {['Reclamo', 'Queja'].map(opt => (
                              <label key={opt} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                                <input 
                                  type="radio" 
                                  name="tipo" 
                                  className="accent-civa-pink" 
                                  checked={detail.type === opt}
                                  onChange={() => setDetail(prev => ({ ...prev, type: opt }))}
                                />
                                <span className="text-[10px] font-black text-white/60 uppercase">{opt}</span>
                              </label>
                            ))}
                          </div>
                          <p className="text-[8px] text-white/20 italic mt-2">Reclamo: Disconformidad con producto/servicio. Queja: Disconformidad con atención.</p>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Resumen de lo acontecido *</label>
                          <textarea 
                            value={detail.summary}
                            onChange={(e) => setDetail(prev => ({ ...prev, summary: e.target.value }))}
                            className="w-full p-6 rounded-xl bg-black/40 border border-white/5 text-white/80 focus:outline-none focus:border-civa-pink/30 h-32" 
                            placeholder="Detalle su caso..." 
                            required 
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Detalle del Pedido *</label>
                          <textarea 
                            value={detail.request}
                            onChange={(e) => setDetail(prev => ({ ...prev, request: e.target.value }))}
                            className="w-full p-6 rounded-xl bg-black/40 border border-white/5 text-white/80 focus:outline-none focus:border-civa-pink/30 h-24" 
                            placeholder="¿Qué solicita?" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-md">
                    <p className="text-[8px] text-white/20 uppercase tracking-widest leading-loose">
                      Ley N° 29571, Código de Protección y Defensa del Consumidor. Los proveedores están obligados a atender los reclamos en un plazo no mayor de quince (15) días hábiles.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-16 py-6 bg-gradient-to-r from-civa-pink to-civa-purple text-white font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 border border-white/10 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSubmitting ? 'Enviando...' : 'Enviar Reclamación'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
            )
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-5xl space-y-8"
            >
              {history.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                  <p className="text-white/20 font-black uppercase text-[10px] tracking-widest italic">Aún no has registrado ninguna reclamación</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-civa-pink/10 flex items-center justify-center text-civa-pink group-hover:scale-110 transition-transform">
                          <Book className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-black uppercase text-[10px] tracking-widest mb-1">{item.hojaNumber}</p>
                          <p className="text-white/40 text-xs font-medium italic">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex-1 md:px-12">
                        <p className="text-white/60 text-xs line-clamp-1 italic">"{item.detail.summary}"</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${item.detail.type === 'Reclamo' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {item.detail.type}
                        </span>
                        <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest border border-white/5">
                          Recibido
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", required = false, value, onChange }: { label: string, placeholder: string, type?: string, required?: boolean, value?: string, onChange?: (val: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-6 py-4 rounded-xl bg-black/40 border border-white/5 text-white/80 focus:outline-none focus:border-civa-pink/30 transition-all font-bold placeholder:text-white/10 text-sm"
      />
    </div>
  );
}
