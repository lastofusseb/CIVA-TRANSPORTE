import { useState, useEffect } from 'react';
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
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExtractionResult, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';

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
      try {
        const q = query(
          collection(db, 'payments'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
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
      // Save payment to history
      const payRef = await addDoc(collection(db, 'payments'), {
        userId: profile.uid,
        amount: amount,
        destination: destination,
        paymentMethod: selectedMethod.id,
        createdAt: serverTimestamp()
      });

      // Update reservations (simulated)
      // Actually the user might have multiple reservations, we could just create a new one confirmed
      await addDoc(collection(db, 'reservations'), {
        userId: profile.uid,
        origin: extraction.origin || 'Lima',
        destinationId: destination.toLowerCase(),
        destinationName: destination,
        departureDate: extraction.departureDate || new Date().toISOString().split('T')[0],
        status: 'confirmed',
        serviceType: extraction.service || 'Excluciva',
        price: amount,
        createdAt: serverTimestamp()
      });

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
    try {
       await deleteDoc(doc(db, 'payments', id));
       setPayments(prev => prev.filter(p => p.id !== id));
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `payments/${id}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8f7ff] pb-24">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <AnimatePresence mode="wait">
          {step === 'methods' && (
            <motion.div
              key="methods"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <header className="text-center">
                <h2 className="text-4xl font-display uppercase tracking-tight text-civa-purple">
                  Pasarela de <span className="text-civa-pink">Pagos Segura</span>
                </h2>
                <p className="text-slate-500 font-medium italic mt-2">
                  Selecciona tu método de pago preferido para completar tu viaje a {destination}.
                </p>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {PAYMENT_METHODS.map((method) => (
                  <motion.button
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method);
                      setStep('details');
                    }}
                    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-civa-purple/20 transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="h-16 flex items-center justify-center">
                      <img src={method.logo} alt={method.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none group-hover:text-civa-purple">
                        {method.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-civa-pink" />
                  <h3 className="font-display text-sm tracking-widest uppercase text-slate-400">Historial de Transacciones</h3>
                </div>

                {loading ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="w-8 h-8 text-civa-purple animate-spin" />
                  </div>
                ) : payments.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No hay pagos registrados aún</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                      {payments.map((p) => (
                        <motion.div
                          layout
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-civa-purple" />
                            </div>
                            <div>
                              <p className="font-display text-lg text-slate-800 leading-none mb-1">S/ {p.amount.toFixed(2)}</p>
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter line-clamp-1">{p.destination}</p>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteHistory(p.id, e)}
                            className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-slate-50 relative overflow-hidden">
                <button 
                  onClick={() => setStep('methods')}
                  className="absolute top-8 left-8 text-slate-400 hover:text-civa-purple transition-colors p-2 bg-slate-50 rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="space-y-10">
                  <div className="text-center">
                    <div className="inline-flex p-5 rounded-[2rem] bg-slate-50 mb-6 shadow-inner">
                      <img src={selectedMethod?.logo} className="h-10 object-contain" />
                    </div>
                    <h3 className="text-2xl font-display uppercase text-slate-800 tracking-tight">Finalizar Compra</h3>
                    <p className="text-slate-400 text-sm mt-1 italic">Ruta a {destination}</p>
                  </div>

                  <div className="bg-[#f8f7ff] rounded-[2.5rem] p-8 space-y-4 border border-slate-100">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Base pasaje</span>
                      <span className="text-slate-800">S/ {(amount * 0.82).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest">IGV (18%)</span>
                      <span className="text-slate-800">S/ {(amount * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-black text-[12px] uppercase tracking-[0.2em] text-civa-purple">Total Neto</span>
                      <span className="text-4xl font-display text-civa-pink">S/ {amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {selectedMethod?.id === 'yape' ? (
                    <div className="text-center space-y-6">
                      <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] inline-block shadow-sm">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CIVA-PAY-${amount}-${profile?.uid}`} className="w-48 h-48" />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-civa-purple font-black text-[10px] uppercase tracking-widest">
                        <QrCode className="w-4 h-4" />
                        Escanea y Yapea
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative group">
                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-civa-purple transition-colors" />
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000-0000-0000-0000" 
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold font-mono tracking-widest focus:ring-2 focus:ring-civa-purple/20 transition-all outline-none" 
                        />
                        {cardNumber.length > 0 && (
                          <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <img 
                              src={cardNumber.startsWith('4') ? 'https://cdn4.iconfinder.com/data/icons/payment-method-1/64/visa-512.png' : 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/204_Mastercard_logo-512.png'} 
                              className="h-6 object-contain" 
                              alt="card type"
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" 
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY" 
                            className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none" 
                          />
                        </div>
                        <div className="relative">
                          <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" 
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="CVV" 
                            className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleFinalPay}
                    disabled={isProcessing || (selectedMethod?.id !== 'yape' && (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3))}
                    className="w-full py-6 bg-civa-purple text-white font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl hover:shadow-civa-purple/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale relative overflow-hidden group"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Procesar Pago</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                    {(selectedMethod?.id !== 'yape' && (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3)) && !isProcessing && (
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px]">
                         <span className="text-[8px] font-black tracking-widest text-white drop-shadow-md">Completa los datos</span>
                      </div>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest p-4 bg-emerald-50 rounded-2xl">
                    <ShieldCheck className="w-5 h-5" />
                    CERTIFICADO PCI DSS
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center space-y-8 bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-50"
            >
              <div className="relative inline-block">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                  className="p-10 rounded-full bg-emerald-50 text-emerald-500"
                >
                  <CheckCircle2 className="w-24 h-24" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20" />
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-display uppercase text-slate-800">¡Pago Exitoso!</h2>
                <p className="text-slate-500 italic">Tu viaje a {destination} ha sido confirmado con éxito.</p>
              </div>

              <div className="p-8 bg-[#f8f7ff] rounded-[3rem] border border-slate-100 text-left space-y-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black uppercase text-slate-400 tracking-widest">Código Civap</span>
                  <span className="font-black text-slate-800">CV-{(Math.random()*100000).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black uppercase text-slate-400 tracking-widest">Estado Pasaje</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full font-black text-[9px]">CONFIRMADO</span>
                </div>
              </div>

              <button
                onClick={onPay}
                className="w-full py-6 bg-civa-purple text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl hover:scale-105 transition-all"
              >
                Ver Mis Reservas
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
