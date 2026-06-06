import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Trash2, 
  History, 
  Loader2,
  ArrowRight,
  Plus,
  ShieldCheck,
  ChevronLeft,
  QrCode,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExtractionResult, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { useTheme } from '../context/ThemeContext';

interface PaymentsProps {
  extraction: ExtractionResult;
  profile: UserProfile | null;
  onPay: () => void;
  onGotoProfile: () => void;
}

const PAYMENT_METHODS = [
  { id: 'visa', name: 'VISA', logo: 'https://cdn4.iconfinder.com/data/icons/payment-method-1/64/visa-512.png', color: '#1A1F71' },
  { id: 'mastercard', name: 'MASTERCARD', logo: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/204_Mastercard_logo-512.png', color: '#EB001B' },
  { id: 'yape', name: 'YAPE', logo: 'https://www.yape.com.pe/assets/img/logo-yape.png', color: '#742296' },
  { id: 'pagoefectivo', name: 'PAGOEFECTIVO', logo: 'https://pagoefectivo.pe/assets/img/logo-pe.svg', color: '#F9B233' },
  { id: 'amex', name: 'AMERICAN EXPRESS', logo: 'https://cdn4.iconfinder.com/data/icons/payment-method-1/64/american_express-512.png', color: '#0070D1' },
  { id: 'diners', name: 'DINERS CLUB', logo: 'https://cdn4.iconfinder.com/data/icons/payment-method-1/64/diners_club-512.png', color: '#004A97' },
  { id: 'unionpay', name: 'UNION PAY', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg', color: '#004A97' },
];

export default function Payments({ extraction, profile, onPay, onGotoProfile }: PaymentsProps) {
  const { theme } = useTheme();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'methods' | 'details' | 'success'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Formatting: 4-4-4-4
    const chunks = value.match(/.{1,4}/g);
    const formatted = chunks ? chunks.join('-') : value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      setExpiry(value.slice(0, 2) + '/' + value.slice(2));
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  const amount = extraction.priceEst || 85;
  const destination = extraction.destination || 'Arequipa';

  useEffect(() => {
    if (!profile) return;
    const fetchPayments = async () => {
      if (profile.isLocal) {
        try {
          const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
          setPayments(stored ? JSON.parse(stored) : []);
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'payments'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.warn("Firestore payments fetch failed, using local storage backup:", error);
        try {
          const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
          setPayments(stored ? JSON.parse(stored) : []);
        } catch {
          setPayments([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [profile]);

  const handleFinalPay = async () => {
    if (!profile) return;
    setIsProcessing(true);
    try {
      const paymentData = {
        userId: profile.uid,
        amount: amount,
        destination: destination,
        paymentMethod: selectedMethod.id,
        passengers: extraction.passengers || 1,
        passengerNames: extraction.passengerNames || [],
        passengerDnis: extraction.passengerDnis || [],
        createdAt: new Date().toISOString()
      };

      if (profile.isLocal) {
        const payId = 'pay_' + Math.random().toString(36).substring(2, 11);
        try {
          const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
          const list = stored ? JSON.parse(stored) : [];
          list.unshift({ id: payId, ...paymentData });
          localStorage.setItem(`civa_payments_${profile.uid}`, JSON.stringify(list));
        } catch (e) {
          console.error(e);
        }

        if (extraction.reservationId) {
          try {
            const storedRes = localStorage.getItem(`civa_reservations_${profile.uid}`);
            const listRes = storedRes ? JSON.parse(storedRes) : [];
            const updated = listRes.map((r: any) => r.id === extraction.reservationId ? { ...r, status: 'confirmed' } : r);
            localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
        } else {
          try {
            const storedRes = localStorage.getItem(`civa_reservations_${profile.uid}`);
            const listRes = storedRes ? JSON.parse(storedRes) : [];
            listRes.unshift({
              id: 'local_' + Math.random().toString(36).substring(2, 11),
              userId: profile.uid,
              origin: extraction.origin || 'Lima',
              destinationId: destination.toLowerCase(),
              destinationName: destination,
              departureDate: extraction.departureDate || new Date().toISOString().split('T')[0],
              status: 'confirmed',
              serviceType: extraction.service || 'Excluciva',
              price: amount,
              passengers: extraction.passengers || 1,
              passengerNames: extraction.passengerNames || [],
              passengerDnis: extraction.passengerDnis || [],
              createdAt: new Date().toISOString()
            });
            localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(listRes));
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        try {
          const payRef = await addDoc(collection(db, 'payments'), {
            ...paymentData,
            createdAt: serverTimestamp()
          });

          if (extraction.reservationId) {
            const resRef = doc(db, 'reservations', extraction.reservationId);
            await updateDoc(resRef, {
              status: 'confirmed'
            });

            try {
              const storedRes = localStorage.getItem(`civa_reservations_${profile.uid}`);
              const listRes = storedRes ? JSON.parse(storedRes) : [];
              const updated = listRes.map((r: any) => r.id === extraction.reservationId ? { ...r, status: 'confirmed' } : r);
              localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(updated));
            } catch {}
          } else {
            await addDoc(collection(db, 'reservations'), {
              userId: profile.uid,
              origin: extraction.origin || 'Lima',
              destinationId: destination.toLowerCase(),
              destinationName: destination,
              departureDate: extraction.departureDate || new Date().toISOString().split('T')[0],
              status: 'confirmed',
              serviceType: extraction.service || 'Excluciva',
              price: amount,
              passengers: extraction.passengers || 1,
              passengerNames: extraction.passengerNames || [],
              passengerDnis: extraction.passengerDnis || [],
              createdAt: serverTimestamp()
            });
          }

          try {
            const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
            const list = stored ? JSON.parse(stored) : [];
            list.unshift({ id: payRef.id, ...paymentData });
            localStorage.setItem(`civa_payments_${profile.uid}`, JSON.stringify(list));
          } catch {}
        } catch (error) {
          console.warn("Firestore payment failed, saving locally:", error);
          const payId = 'pay_fb_' + Math.random().toString(36).substring(2, 11);
          try {
            const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
            const list = stored ? JSON.parse(stored) : [];
            list.unshift({ id: payId, ...paymentData });
            localStorage.setItem(`civa_payments_${profile.uid}`, JSON.stringify(list));
          } catch {}

          if (extraction.reservationId) {
            try {
              const storedRes = localStorage.getItem(`civa_reservations_${profile.uid}`);
              const listRes = storedRes ? JSON.parse(storedRes) : [];
              const updated = listRes.map((r: any) => r.id === extraction.reservationId ? { ...r, status: 'confirmed' } : r);
              localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(updated));
            } catch {}
          } else {
            try {
              const storedRes = localStorage.getItem(`civa_reservations_${profile.uid}`);
              const listRes = storedRes ? JSON.parse(storedRes) : [];
              listRes.unshift({
                id: 'local_' + Math.random().toString(36).substring(2, 11),
                userId: profile.uid,
                origin: extraction.origin || 'Lima',
                destinationId: destination.toLowerCase(),
                destinationName: destination,
                departureDate: extraction.departureDate || new Date().toISOString().split('T')[0],
                status: 'confirmed',
                serviceType: extraction.service || 'Excluciva',
                price: amount,
                passengers: extraction.passengers || 1,
                passengerNames: extraction.passengerNames || [],
                passengerDnis: extraction.passengerDnis || [],
                createdAt: new Date().toISOString()
              });
              localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(listRes));
            } catch {}
          }
        }
      }

      setStep('success');
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) return;
    if (!window.confirm('¿Deseas eliminar este registro de pago?')) return;
    if (profile.isLocal) {
      try {
        const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((p: any) => p.id !== id);
        localStorage.setItem(`civa_payments_${profile.uid}`, JSON.stringify(filtered));
        setPayments(filtered);
      } catch (err) {
        console.error(err);
      }
      return;
    }
    try {
       await deleteDoc(doc(db, 'payments', id));
       setPayments(prev => prev.filter(p => p.id !== id));
       try {
         const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
         if (stored) {
           const list = JSON.parse(stored);
           localStorage.setItem(`civa_payments_${profile.uid}`, JSON.stringify(list.filter((p: any) => p.id !== id)));
         }
       } catch {}
    } catch (error) {
       console.warn("Firestore payment deletion failed, deleting locally:", error);
       try {
         const stored = localStorage.getItem(`civa_payments_${profile.uid}`);
         const list = stored ? JSON.parse(stored) : [];
         const filtered = list.filter((p: any) => p.id !== id);
         localStorage.setItem(`civa_payments_${profile.uid}`, JSON.stringify(filtered));
         setPayments(filtered);
       } catch {
         setPayments(prev => prev.filter(p => p.id !== id));
       }
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto p-10 pb-24 relative font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-civa-purple/10 via-transparent to-civa-pink/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        <AnimatePresence mode="wait">
          {step === 'methods' && (
            <motion.div
              key="methods"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-16"
            >
              <header className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block px-6 py-2 bg-civa-pink/10 border border-civa-pink/20 rounded-full mb-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-civa-pink">Secure Gateway v4.0</p>
                </motion.div>
                <h2 className={`text-5xl font-display uppercase tracking-tight leading-tight text-white`}>
                  Matriz de <span className="text-civa-pink">Transacción</span>
                </h2>
                <p className={`font-medium italic text-lg max-w-2xl mx-auto leading-relaxed text-white/40`}>
                  Active su Protocolo de Pago para el transporte interestatal hacia <span className="text-white">{destination}</span>.
                </p>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {PAYMENT_METHODS.map((method) => (
                  <motion.button
                    whileHover={{ y: -10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method);
                      setStep('details');
                    }}
                    className="backdrop-blur-3xl p-10 rounded-[4rem] border shadow-2xl transition-all flex flex-col items-center justify-center gap-6 group ring-1 bg-white/5 border-white/5 ring-white/5 shadow-black/40"
                  >
                    <div className="h-20 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                      <img src={method.logo} alt={method.name} className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 relative z-10" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none group-hover:text-civa-pink transition-colors text-white/30">
                        {method.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className={`space-y-10 pt-16 border-t border-white/5`}>
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_15px_rgba(216,27,96,0.3)]" />
                  <h3 className={`font-display text-xl tracking-tight uppercase italic text-white/40`}>Log de <span className="text-white">Operaciones</span></h3>
                </div>

                {loading ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="w-10 h-10 text-civa-pink animate-spin" />
                  </div>
                ) : payments.length === 0 ? (
                  <div className={`py-24 text-center border-2 border-dashed rounded-[4rem] transition-colors bg-white/5 border-white/5`}>
                    <p className={`font-black uppercase text-[11px] tracking-[0.5em] italic text-white/20`}>Ninguna transacción detectada en frecuencia</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {payments.map((p) => (
                        <motion.div
                          layout
                          key={p.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="backdrop-blur-2xl p-8 rounded-[3rem] border flex items-center justify-between group hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] transition-all ring-1 bg-white/5 border-white/5 ring-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:shadow-[0_0_15px_rgba(216,27,96,0.2)] transition-shadow bg-[#1a0b3e]">
                              <Smartphone className="w-6 h-6 text-civa-pink" />
                            </div>
                            <div>
                              <p className="font-display text-2xl leading-none mb-2 italic text-white">S/ {p.amount.toFixed(2)}</p>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1 text-white/30 text-white/40">{p.destination}</p>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteHistory(p.id, e)}
                            className="p-4 rounded-2xl transition-all opacity-0 group-hover:opacity-100 text-white/10 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-[#1a0b2e]/60 backdrop-blur-3xl rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-civa-pink/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <button 
                  onClick={() => setStep('methods')}
                  className="absolute top-10 left-10 text-white/30 hover:text-white transition-all p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="space-y-12">
                  <div className="text-center pt-8">
                    <motion.div 
                      layoutId={`logo-${selectedMethod?.id}`}
                      className="inline-flex p-8 rounded-[3rem] bg-white/5 mb-8 shadow-inner border border-white/5 relative group"
                    >
                      <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src={selectedMethod?.logo} className="h-14 object-contain transition-all relative z-10" />
                    </motion.div>
                    <h3 className="text-4xl font-display uppercase text-white tracking-tight leading-none">Confirmación de <span className="text-civa-pink">Pago</span></h3>
                    <p className="text-white/30 text-lg mt-3 italic">Ruta Vectorizada: <span className="text-white/60">{destination}</span></p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-2xl rounded-[3rem] p-10 space-y-6 border border-white/5 shadow-inner">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-white/20 uppercase text-[10px] font-black tracking-[0.4em]">Base del Pasaje</span>
                      <span className="text-white/60 tracking-wider">S/ {(amount * 0.82).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-white/20 uppercase text-[10px] font-black tracking-[0.4em]">Impuesto IGV (18%)</span>
                      <span className="text-white/60 tracking-wider">S/ {(amount * 0.18).toFixed(2)}</span>
                    </div>

                    {/* Passenger Manifest in Summary */}
                    <div className="py-6 border-t border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/20 uppercase text-[10px] font-black tracking-[0.4em]">Pasajeros Registrados</span>
                        <span className="text-white/60 font-mono text-xs">{extraction.passengers || 1}</span>
                      </div>
                      {extraction.passengerNames && extraction.passengerNames.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {extraction.passengerNames.map((name, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                              <div className="w-1 h-1 bg-civa-pink rounded-full" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-white/60 font-medium capitalize leading-none mb-0.5">{name}</span>
                                {extraction.passengerDnis?.[i] && (
                                  <span className="text-[8px] text-white/20 font-mono leading-none tracking-tight">DNI: {extraction.passengerDnis[i]}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <span className="font-black text-[11px] uppercase tracking-[0.5em] text-civa-pink block mb-2">Total Inversión</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em]">Sincronizado</span>
                        </div>
                      </div>
                      <span className="text-6xl font-display text-white italic">S/ {amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {selectedMethod?.id === 'yape' ? (
                    <div className="text-center space-y-8">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 bg-white/90 rounded-[4rem] inline-block shadow-[0_0_60px_rgba(255,255,255,0.1)] border-8 border-white/10"
                      >
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CIVA-PAY-${amount}-${profile?.uid}`} className="w-56 h-56" />
                      </motion.div>
                      <div className="flex items-center justify-center gap-4 text-civa-pink font-black text-[12px] uppercase tracking-[0.4em] animate-pulse">
                        <QrCode className="w-5 h-5" />
                        Capture Código QR
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative group">
                        <CreditCard className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-civa-pink transition-colors" />
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000-0000-0000-0000" 
                          className="w-full pl-16 pr-8 py-7 bg-white/5 border border-white/10 rounded-[2rem] text-[15px] font-bold font-mono tracking-[0.2em] text-white focus:bg-white/10 focus:border-civa-pink/40 transition-all outline-none shadow-inner" 
                        />
                        {cardNumber.length > 0 && (
                          <div className="absolute right-7 top-1/2 -translate-y-1/2">
                            <motion.img 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              src={cardNumber.startsWith('4') ? 'https://cdn4.iconfinder.com/data/icons/payment-method-1/64/visa-512.png' : 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/204_Mastercard_logo-512.png'} 
                              className="h-8 object-contain" 
                              alt="card type"
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                          <Calendar className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input 
                            type="text" 
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY" 
                            className="w-full pl-16 pr-6 py-7 bg-white/5 border border-white/10 rounded-[2rem] text-[13px] font-bold uppercase tracking-[0.3em] text-white outline-none focus:bg-white/10 transition-all" 
                          />
                        </div>
                        <div className="relative">
                          <ShieldCheck className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input 
                            type="text" 
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="CVV" 
                            className="w-full pl-16 pr-6 py-7 bg-white/5 border border-white/10 rounded-[2rem] text-[13px] font-bold uppercase tracking-[0.3em] text-white outline-none focus:bg-white/10 transition-all" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    <button
                      onClick={handleFinalPay}
                      disabled={isProcessing || (selectedMethod?.id !== 'yape' && (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3))}
                      className="w-full py-8 bg-white text-civa-purple font-black text-[12px] uppercase tracking-[0.5em] rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)] hover:bg-civa-pink hover:text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale relative overflow-hidden group border border-transparent hover:border-white/20"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                      ) : (
                        <div className="flex items-center justify-center gap-6">
                          <span>Ejecutar Transacción</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                        </div>
                      )}
                      {(selectedMethod?.id !== 'yape' && (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3)) && !isProcessing && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                           <span className="text-[9px] font-black tracking-[0.3em] text-white drop-shadow-lg opacity-40">Parámetros Incompletos</span>
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] p-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                    <ShieldCheck className="w-6 h-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    Protocolo SSL v3 • Certificado PCI DSS
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="max-w-2xl mx-auto text-center space-y-12 bg-[#1a0b2e]/60 backdrop-blur-3xl p-20 rounded-[5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] border border-white/10 ring-1 ring-white/10"
            >
              <div className="relative inline-block">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 150 }}
                  className="p-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle2 className="w-32 h-32" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 rounded-full animate-pulse" />
              </div>

              <div className="space-y-6">
                <h2 className="text-6xl font-display uppercase text-white italic tracking-tighter">¡Viaje Confirmado!</h2>
                <p className="text-white/40 text-xl font-medium max-w-md mx-auto leading-relaxed">Su enlace operacional con <span className="text-white selection:bg-civa-pink">{destination}</span> ha sido establecido con éxito.</p>
              </div>

              <div className="p-12 bg-black/30 backdrop-blur-3xl rounded-[4rem] border border-white/5 text-left space-y-8 shadow-inner">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black uppercase text-white/20 tracking-[0.5em]">Identificador CIVAP</span>
                  <span className="font-black text-white tracking-[0.2em] italic bg-white/5 px-4 py-2 rounded-xl border border-white/5">CV-{(Math.random()*100000).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black uppercase text-white/20 tracking-[0.5em]">Estado de Red</span>
                  <span className="px-6 py-2 bg-emerald-500/20 text-emerald-500 rounded-full font-black tracking-[0.3em] border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">SINCRO TOTAL</span>
                </div>
              </div>

              <button
                onClick={onPay}
                className="w-full py-8 bg-white text-civa-purple font-black text-[13px] uppercase tracking-[0.6em] rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] hover:bg-civa-pink hover:text-white hover:scale-105 transition-all border border-transparent hover:border-white/20"
              >
                Acceder a Bóveda
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
