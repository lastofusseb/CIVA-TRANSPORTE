import { ExtractionResult } from '../types';
import { Sparkles, MapPin, Bus, Tag, Calendar, QrCode, ArrowRight, Loader2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface IntelligentPanelProps {
  data: ExtractionResult;
  onFinalize: () => void;
  isConfirming?: boolean;
}

export default function IntelligentPanel({ data, onFinalize, isConfirming }: IntelligentPanelProps) {
  const { theme } = useTheme();
  return (
    <div className={`w-full xl:w-[440px] border-t xl:border-l flex flex-col h-auto xl:h-full shrink-0 overflow-y-auto relative font-sans transition-colors duration-700 ${theme === 'dark' ? 'border-white/5 bg-[#0f0716]' : 'border-white/10 bg-[#1a0b2e]'}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-civa-purple/5' : 'bg-gradient-to-b from-slate-50'} to-transparent pointer-events-none`} />
      
      <div className="p-6 md:p-10 relative z-10 flex flex-col h-full">
        {/* State Card */}
        <div className={`rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 mb-8 md:mb-12 relative overflow-hidden transition-all border ring-1 ${theme === 'dark' ? 'bg-[#1a0b2e]/60 backdrop-blur-3xl text-white shadow-2xl border-white/5 ring-white/10' : 'bg-white text-slate-900 shadow-xl border-slate-200 ring-slate-50'}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-civa-purple/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="p-3.5 bg-gradient-to-br from-civa-purple to-civa-pink rounded-2xl shadow-[0_0_20px_rgba(216,27,96,0.2)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-tight text-2xl leading-none">Matriz de <span className="text-civa-pink">Datos</span></h3>
              <p className={`text-[9px] font-black uppercase tracking-[0.4em] mt-2 ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Sincronización Neural</p>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            <DataItem icon={MapPin} label="Destino Proyectado" value={data.destination} theme={theme} />
            <DataItem icon={Bus} label="Servicio Configurado" value={data.service} theme={theme} />
            {data.passengers && data.passengers > 1 && (
              <DataItem icon={Tag} label="Pasajeros" value={`${data.passengers} personas`} theme={theme} />
            )}
            <DataItem icon={Tag} label="Inversión Estimada" value={data.priceEst ? `S/ ${data.priceEst.toFixed(2)}` : undefined} theme={theme} />
          </div>

          {data.passengerNames && data.passengerNames.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 pt-10 border-t border-white/5 space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-4 h-4 text-civa-pink" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Manifiesto de Pasajeros</h4>
              </div>
              <div className="bg-black/20 rounded-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">#</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Nombre del Viajero</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">DNI</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.passengerNames.map((name, idx) => (
                      <tr key={idx} className="group hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-white/20 border-b border-white/5">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white/80 border-b border-white/5 capitalize">{name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-white/40 border-b border-white/5">
                          {data.passengerDnis?.[idx] || "---"}
                        </td>
                        <td className="px-6 py-4 border-b border-white/5">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                        </td>
                      </tr>
                    ))}
                    {/* Fill remaining slots if passengers count > names extracted */}
                    {data.passengers && data.passengers > data.passengerNames.length && 
                      Array.from({ length: data.passengers - data.passengerNames.length }).map((_, idx) => (
                        <tr key={`empty-${idx}`} className="group opacity-50 italic">
                          <td className="px-6 py-4 text-xs font-mono text-white/20 border-b border-white/5">{data.passengerNames!.length + idx + 1}</td>
                          <td className="px-6 py-4 text-xs font-medium text-white/30 border-b border-white/5">Pendiente de identificación...</td>
                          <td className="px-6 py-4 text-xs font-mono text-white/20 border-b border-white/5">---</td>
                          <td className="px-6 py-4 border-b border-white/5">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-500/50" />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

          <div className="space-y-12 flex-1">
          {data.service && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`backdrop-blur-2xl p-8 rounded-[3rem] border shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden relative ${theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-civa-pink/50 to-transparent" />
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
                <div className="w-1.5 h-1.5 bg-civa-pink rounded-full shadow-[0_0_8px_rgba(216,27,96,0.5)]" />
                Atributos del Activo {data.service}
              </h4>
              <div className="flex flex-wrap gap-3">
                {getServiceBenefits(data.service).map((benefit, i) => (
                  <div key={i} className={`px-4 py-2 border rounded-xl text-[10px] font-bold flex items-center gap-2 transition-colors cursor-default ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}>
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1.5 h-10 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_15px_rgba(216,27,96,0.2)]" />
              <h3 className={`font-display uppercase text-lg tracking-tight leading-none ${theme === 'dark' ? 'text-white/40' : 'text-slate-300'}`}>Arquitectura de <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Ruta</span></h3>
            </div>
            
            <div className="space-y-6">
              <InputGroup label="Punto de Origen" value={data.origin || 'Lima'} disabled theme={theme} />
              <InputGroup label="Terminal de Arribo" value={data.destination || 'Detectando Vector...'} disabled theme={theme} />
              <InputGroup label="Cronograma Temporal" value={data.departureDate || 'Próximo ciclo'} disabled theme={theme} />
            </div>
          </div>
        </div>

        <div className="pt-12 mt-auto">
          <div className="relative group">
            {theme === 'dark' && <div className="absolute inset-0 bg-civa-pink/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onFinalize}
              disabled={!data.destination || isConfirming}
              className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all hover:bg-civa-pink hover:text-white border active:scale-95 disabled:opacity-30 disabled:grayscale ${
                theme === 'dark' ? 'bg-white text-civa-purple border-transparent shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)] hover:border-white/20' : 'bg-civa-purple text-white border-transparent shadow-[0_30px_60px_-10px_rgba(102,51,153,0.15)] hover:bg-civa-pink'
              }`}
            >
              {isConfirming ? (
                 <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <QrCode className="w-6 h-6" />
                  Ir a Pasarela de Pagos
                </>
              )}
            </motion.button>
          </div>
          
          <p className={`mt-8 text-[9px] text-center uppercase font-black tracking-[0.4em] leading-loose max-w-[300px] mx-auto italic ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>
            Al ejecutar, se inscribirá una pre-reserva criptográfica. Verificación via <span className="text-civa-pink opacity-60">Yape Protocol</span> requerida.
          </p>
        </div>
      </div>
    </div>
  );
}

function getServiceBenefits(service?: string): string[] {
  const s = service?.toLowerCase() || '';
  if (s.includes('excluciva')) {
    return ['180° RECLINE', 'HI-SPEED WIFI', 'PERSONAL HUB', 'USB-C READY', 'D-DECK BUS', 'PET FRIENDLY', 'PURE AIR'];
  }
  if (s.includes('superciva')) {
    return ['160° RECLINE', 'MEDIA CENTER', 'USB POWER', 'D-DECK BUS', 'PET FRIENDLY', 'GPS SYNC'];
  }
  if (s.includes('econociva')) {
    return ['140° RECLINE', 'S-DECK BUS', 'SHARED MEDIA', 'ECO-MODE', 'ECONOMY CORE'];
  }
  if (s.includes('cargo')) {
    return ['NATIONAL HUB', 'D.O.D PAY', '24H TRACKING', 'CARGO MASTER'];
  }
  return ['TOTAL SAFETY', 'GPS SYNC', 'ELITE STAFF'];
}

function DataItem({ icon: Icon, label, value, theme }: { icon: any, label: string, value?: string, theme: string }) {
  return (
    <div className={`flex items-center justify-between pb-5 group border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5 group-hover:border-civa-pink/30' : 'bg-slate-50 border-slate-100 group-hover:border-slate-200'}`}>
          <Icon className="w-4 h-4 text-civa-pink drop-shadow-[0_0_8px_rgba(216,27,96,0.3)]" />
        </div>
        <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>{label}</span>
      </div>
      <span className={`text-sm font-black tracking-tight italic ${theme === 'dark' ? 'text-white/90' : 'text-slate-900'}`}>{value || '---'}</span>
    </div>
  );
}

function InputGroup({ label, value, disabled, theme }: { label: string, value: string, disabled?: boolean, theme: string }) {
  return (
    <div className="flex flex-col gap-3">
      <label className={`text-[9px] uppercase font-black ml-2 tracking-[0.4em] ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>{label}</label>
      <div className={`px-8 py-6 rounded-[2rem] border text-[14px] font-bold tracking-wide italic shadow-inner transition-all ${
        disabled 
          ? theme === 'dark' 
            ? 'bg-white/[0.02] border-white/5 text-white/30 cursor-not-allowed' 
            : 'bg-[#fafafa] border-slate-100 text-slate-300 cursor-not-allowed uppercase text-[10px] tracking-widest shadow-inner'
          : theme === 'dark'
            ? 'bg-white/[0.05] border-white/5 text-white shadow-xl focus:border-civa-pink/30'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm focus:border-civa-pink/40 ring-1 ring-slate-50'
      }`}>
        {value}
      </div>
    </div>
  );
}
