import { ExtractionResult } from '../types';
import { Sparkles, MapPin, Bus, Tag, Calendar, QrCode, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface IntelligentPanelProps {
  data: ExtractionResult;
  onFinalize: () => void;
  isConfirming?: boolean;
}

export default function IntelligentPanel({ data, onFinalize, isConfirming }: IntelligentPanelProps) {
  return (
    <div className="w-[420px] border-l border-slate-200 bg-white flex flex-col h-full shrink-0 overflow-y-auto">
      <div className="p-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-civa-purple/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-2 bg-civa-purple rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-[0.05em] text-lg">Suite de Datos</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-civa-pink">Extracción en tiempo real</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <DataItem icon={MapPin} label="Destino Detectado" value={data.destination} />
            <DataItem icon={Bus} label="Servicio Sugerido" value={data.service} />
            <DataItem icon={Tag} label="Estimado de Inversión" value={data.priceEst ? `S/ ${data.priceEst.toFixed(2)}` : undefined} />
          </div>
        </div>

        <div className="space-y-10">
          {data.service && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100"
            >
              <h4 className="text-[10px] font-black uppercase text-civa-purple tracking-[0.2em] mb-4">Beneficios {data.service}</h4>
              <div className="flex flex-wrap gap-2">
                {getServiceBenefits(data.service).map((benefit, i) => (
                  <div key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 flex items-center gap-1.5 shadow-sm">
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-civa-pink rounded-full" />
              <h3 className="font-display uppercase text-sm tracking-widest text-slate-400">Detalles de Ruta</h3>
            </div>
            
            <div className="space-y-5">
              <InputGroup label="Origen de Viaje" value={data.origin || 'Lima'} disabled />
              <InputGroup label="Ciudad de Destino" value={data.destination || 'Detectando...'} disabled />
              <InputGroup label="Fecha Proyectada" value={data.departureDate || 'Próximo horario'} disabled />
            </div>
          </div>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onFinalize}
              disabled={!data.destination || isConfirming}
              className="w-full py-5 bg-civa-pink text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-civa-pink/30 disabled:opacity-50 disabled:grayscale transition-all"
            >
              {isConfirming ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Finalizar & Reservar
                </>
              )}
            </motion.button>
            
            <p className="mt-6 text-[10px] text-slate-400 text-center uppercase font-bold tracking-[0.1em] leading-relaxed max-w-[280px] mx-auto">
              Al confirmar, se generará una reserva en estado "Pendiente" hasta validar el pago con Yape.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getServiceBenefits(service?: string): string[] {
  const s = service?.toLowerCase() || '';
  if (s.includes('excluciva')) {
    return ['Asientos 180°', 'WiFi Alta Velocidad', 'Pantalla Personal', 'Cargador USB', 'Bus 2 Pisos', 'Mascotas OK', 'Aire Acondicionado'];
  }
  if (s.includes('superciva')) {
    return ['Asientos 160°', 'Entretenimiento', 'Cargador USB', 'Bus 2 Pisos', 'Mascotas OK', 'Monitoreo GPS'];
  }
  if (s.includes('econociva')) {
    return ['Asientos 140°', 'Bus 1 Piso', 'Entretenimiento Grupal', 'Servicios Higiénicos', 'Económico'];
  }
  if (s.includes('cargo')) {
    return ['Cobertura Nacional', 'Pago Contra Entrega', 'Monitoreo 24h', 'Líder en Encomiendas'];
  }
  return ['Seguridad Garantizada', 'Monitoreo GPS', 'Personal Calificado'];
}

function DataItem({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-white/5 rounded-lg">
          <Icon className="w-3.5 h-3.5 text-civa-pink" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">{label}</span>
      </div>
      <span className="text-sm font-black tracking-tight">{value || '---'}</span>
    </div>
  );
}

function InputGroup({ label, value, disabled }: { label: string, value: string, disabled?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] uppercase font-black text-slate-300 ml-1 tracking-[0.15em]">{label}</label>
      <div className={`px-6 py-4 rounded-2xl border border-slate-100 text-[13px] font-bold ${disabled ? 'bg-slate-50/50 text-slate-400' : 'bg-white text-slate-800'}`}>
        {value}
      </div>
    </div>
  );
}
