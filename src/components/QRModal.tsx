import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Bus, MapPin, Calendar, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reservation } from '../types';

interface QRModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function QRModal({ reservation, onClose }: QRModalProps) {
  if (!reservation) return null;

  const qrData = JSON.stringify({
    ticketId: reservation.id,
    user: reservation.userId,
    route: `${reservation.origin} - ${reservation.destinationName}`,
    date: reservation.departureDate
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Ticket Header */}
          <div className="bg-civa-purple p-8 text-white text-center relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-civa-purple">
              <Bus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display uppercase tracking-tight">Boleto Electrónico</h2>
            <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Civa Intelligent Suite 2025</p>
          </div>

          <div className="p-8 space-y-8 bg-white">
            {/* QR Code Section */}
            <div className="flex flex-col items-center">
              <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <QRCodeSVG value={qrData} size={180} level="H" includeMargin={false} />
              </div>
              <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Escanee para abordar</p>
            </div>

            {/* Ticket Info */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <InfoBlock icon={MapPin} label="Ruta" value={`${reservation.origin} - ${reservation.destinationName}`} full />
              <InfoBlock icon={Calendar} label="Fecha" value={new Date(reservation.departureDate).toLocaleDateString()} />
              <InfoBlock icon={Clock} label="Hora" value="10:30 AM" />
              <InfoBlock icon={User} label="Pasajero" value="SebAs / Aldo" full />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4" />
                Guardar
              </button>
              <button className="flex-1 py-4 bg-civa-pink text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </div>

          {/* Ticket Footer (Cut line) */}
          <div className="relative border-t-2 border-dashed border-slate-100 pb-8 pt-8 px-8 text-center text-slate-400">
             <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/60 backdrop-blur rounded-full" />
             <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/60 backdrop-blur rounded-full" />
             <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Sujeto a términos y condiciones CIVA</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function InfoBlock({ icon: Icon, label, value, full }: { icon: any, label: string, value: string, full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <p className="font-bold text-slate-800 leading-tight">{value}</p>
    </div>
  );
}
