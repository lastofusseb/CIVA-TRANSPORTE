import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Bus, MapPin, Calendar, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reservation } from '../types';
import { useTheme } from '../context/ThemeContext';

interface QRModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function QRModal({ reservation, onClose }: QRModalProps) {
  const { theme } = useTheme();
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
          className={`absolute inset-0 backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-slate-900/40'}`}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh] transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0f0716]' : 'bg-[#fdfaff]'}`}
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

          <div className={`p-8 space-y-8 ${theme === 'dark' ? 'bg-[#0f0716]' : 'bg-[#fdfaff]'}`}>
            {/* QR Code Section */}
            <div className="flex flex-col items-center">
              <div className={`p-6 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-civa-purple/5 border-civa-purple/10'}`}>
                <div className={theme === 'dark' ? 'bg-white p-2 rounded-xl' : ''}>
                  <QRCodeSVG value={qrData} size={180} level="H" includeMargin={false} />
                </div>
              </div>
              <p className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-civa-purple/30'}`}>Escanee para abordar</p>
            </div>

            {/* Ticket Info */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <InfoBlock icon={MapPin} label="Ruta" value={`${reservation.origin} - ${reservation.destinationName}`} full theme={theme} />
              <InfoBlock icon={Calendar} label="Fecha" value={new Date(reservation.departureDate).toLocaleDateString()} theme={theme} />
              <InfoBlock icon={Clock} label="Hora" value="10:30 AM" theme={theme} />
              <InfoBlock icon={User} label="Pasajero" value="SebAs / Aldo" full theme={theme} />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-civa-purple/5 text-civa-purple/60 hover:bg-civa-purple/10'}`}>
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
          <div className={`relative border-t-2 border-dashed pb-8 pt-8 px-8 text-center transition-colors ${theme === 'dark' ? 'border-white/5 text-white/20' : 'border-civa-purple/10 text-civa-purple/20'}`}>
             <div className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-[#0b0612]' : 'bg-[#08040d]'}`} />
             <div className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-[#0b0612]' : 'bg-[#08040d]'}`} />
             <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Sujeto a términos y condiciones CIVA</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function InfoBlock({ icon: Icon, label, value, full, theme }: { icon: any, label: string, value: string, full?: boolean, theme: string }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className={`flex items-center gap-2 mb-1 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>
        <Icon className="w-3 h-3" />
        <span className="text-[10px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <p className={`font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}
