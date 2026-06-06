import { ExtractionResult } from '../types';
import { Sparkles, MapPin, Bus, Tag, Calendar, QrCode, ArrowRight, Loader2, Users, Shield, UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { DESTINATIONS } from '../constants';

interface IntelligentPanelProps {
  data: ExtractionResult;
  onFinalize: () => void;
  isConfirming?: boolean;
  onChange?: (updated: ExtractionResult | ((prev: ExtractionResult) => ExtractionResult)) => void;
}

export default function IntelligentPanel({ data, onFinalize, isConfirming, onChange }: IntelligentPanelProps) {
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
                    {Array.from({ length: data.passengers || 1 }).map((_, idx) => {
                      const name = data.passengerNames?.[idx] || '';
                      const dni = data.passengerDnis?.[idx] || '';
                      return (
                        <tr key={idx} className="group hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-white/20 border-b border-white/5">{idx + 1}</td>
                          <td className="px-6 py-3 border-b border-white/5">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => {
                                const val = e.target.value;
                                onChange?.((prev) => {
                                  const newNames = [...(prev.passengerNames || [])];
                                  while (newNames.length <= idx) newNames.push('');
                                  newNames[idx] = val;
                                  return { ...prev, passengerNames: newNames };
                                });
                              }}
                              placeholder="Nombre del Pasajero"
                              className="bg-transparent border-none outline-none text-white placeholder:text-white/20 w-full text-sm font-medium capitalize focus:ring-0"
                            />
                          </td>
                          <td className="px-6 py-3 border-b border-white/5 font-mono">
                            <input
                              type="text"
                              value={dni}
                              maxLength={12}
                              onChange={(e) => {
                                const val = e.target.value;
                                onChange?.((prev) => {
                                  const newDnis = [...(prev.passengerDnis || [])];
                                  while (newDnis.length <= idx) newDnis.push('');
                                  newDnis[idx] = val;
                                  return { ...prev, passengerDnis: newDnis };
                                });
                              }}
                              placeholder="DNI/Pasaporte"
                              className="bg-transparent border-none outline-none text-white/80 placeholder:text-white/10 w-full text-xs font-mono focus:ring-0"
                            />
                          </td>
                          <td className="px-6 py-4 border-b border-white/5">
                            <span className={`inline-block w-2 h-2 rounded-full ${name.trim() ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500/50'} animate-pulse`} />
                          </td>
                        </tr>
                      );
                    })}
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
              {/* Origen */}
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] uppercase font-black ml-2 tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Punto de Origen</label>
                <select
                  value={data.origin || 'Lima'}
                  onChange={(e) => {
                    const origin = e.target.value;
                    onChange?.((prev) => ({ ...prev, origin }));
                  }}
                  className={`px-8 py-5.5 rounded-[2rem] border text-sm font-semibold tracking-wide bg-transparent outline-none transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#150a24] border-white/5 text-white focus:border-civa-pink' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-civa-pink'
                  }`}
                  style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                >
                  <option value="Lima" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Lima (Terminal Norte/Sur)</option>
                  <option value="Arequipa" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Arequipa</option>
                  <option value="Cusco" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Cusco</option>
                  <option value="Trujillo" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Trujillo</option>
                </select>
              </div>

              {/* Destino */}
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] uppercase font-black ml-2 tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Terminal de Arribo</label>
                <select
                  value={data.destination || ''}
                  onChange={(e) => {
                    const destination = e.target.value;
                    onChange?.((prev) => {
                      const destItem = DESTINATIONS.find(d => d.name === destination);
                      const serviceType = prev.service || 'Excluciva';
                      let priceEst = prev.priceEst || 80;
                      if (destItem) {
                        if (serviceType.toLowerCase().includes('econociva')) priceEst = destItem.econociva;
                        else if (serviceType.toLowerCase().includes('superciva')) priceEst = destItem.superciva;
                        else priceEst = destItem.excluciva || 80;
                      }
                      return { ...prev, destination, priceEst };
                    });
                  }}
                  className={`px-8 py-5.5 rounded-[2rem] border text-sm font-semibold tracking-wide bg-transparent outline-none transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#150a24] border-white/5 text-white focus:border-civa-pink' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-civa-pink hover:border-civa-pink/40'
                  }`}
                  style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                >
                  <option value="" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>-- Detectando o Seleccione --</option>
                  {DESTINATIONS.map(d => (
                    <option key={d.id} value={d.name} className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>
                      {d.name} (S/ {d.excluciva} Excluciva)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Servicio */}
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] uppercase font-black ml-2 tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Tipo de Servicio</label>
                <select
                  value={data.service || 'Excluciva'}
                  onChange={(e) => {
                    const service = e.target.value;
                    onChange?.((prev) => {
                      const destItem = DESTINATIONS.find(d => d.name === prev.destination);
                      let priceEst = prev.priceEst || 80;
                      if (destItem) {
                        if (service.toLowerCase().includes('econociva')) priceEst = destItem.econociva;
                        else if (service.toLowerCase().includes('superciva')) priceEst = destItem.superciva;
                        else priceEst = destItem.excluciva || 80;
                      }
                      return { ...prev, service, priceEst };
                    });
                  }}
                  className={`px-8 py-5.5 rounded-[2rem] border text-sm font-semibold tracking-wide bg-transparent outline-none transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#150a24] border-white/5 text-white focus:border-civa-pink' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-civa-pink hover:border-civa-pink/40'
                  }`}
                  style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                >
                  <option value="Excluciva" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Excluciva (Servicio Premium VIP)</option>
                  <option value="Superciva" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Superciva (Cama 160° Confort)</option>
                  <option value="Econociva" className={theme === 'dark' ? 'bg-[#150a24] text-white' : 'bg-white text-slate-900'}>Econociva (Ecológico/Económico)</option>
                </select>
              </div>

              {/* Fecha y Pasajeros */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={`text-[10px] uppercase font-black ml-2 tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Fecha Viaje</label>
                  <input
                    type="date"
                    value={data.departureDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const departureDate = e.target.value;
                      onChange?.((prev) => ({ ...prev, departureDate }));
                    }}
                    className={`px-6 py-4.5 rounded-[1.5rem] border text-xs font-semibold bg-transparent outline-none transition-all cursor-pointer ${
                      theme === 'dark' ? 'bg-[#150a24] border-white/5 text-white focus:border-civa-pink' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-civa-pink hover:border-civa-pink/40'
                    }`}
                    style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-[10px] uppercase font-black ml-2 tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Pasajeros</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={data.passengers || 1}
                    onChange={(e) => {
                      const passengers = Math.max(1, parseInt(e.target.value) || 1);
                      onChange?.((prev) => {
                        const passengerNames = [...(prev.passengerNames || [])];
                        const passengerDnis = [...(prev.passengerDnis || [])];
                        while (passengerNames.length < passengers) {
                          passengerNames.push('');
                        }
                        while (passengerDnis.length < passengers) {
                          passengerDnis.push('');
                        }
                        return {
                          ...prev,
                          passengers,
                          passengerNames: passengerNames.slice(0, passengers),
                          passengerDnis: passengerDnis.slice(0, passengers)
                        };
                      });
                    }}
                    className={`px-6 py-4.5 rounded-[1.5rem] border text-xs font-semibold bg-transparent outline-none transition-all cursor-pointer ${
                      theme === 'dark' ? 'bg-[#150a24] border-white/5 text-white focus:border-civa-pink' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-civa-pink hover:border-civa-pink/40'
                    }`}
                  />
                </div>
              </div>
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
