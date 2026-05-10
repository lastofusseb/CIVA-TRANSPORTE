import { useState } from 'react';
import { Bus, MapPin, Clock, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DESTINATIONS } from '../constants';

export default function Destinations({ onSelect }: { onSelect: (name: string) => void }) {
  const [filterRegion, setFilterRegion] = useState<string | 'ALL'>('ALL');
  
  const regions = ['ALL', 'NORTE', 'SUR', 'ORIENTE'];
  const filteredDestinations = filterRegion === 'ALL' 
    ? DESTINATIONS 
    : DESTINATIONS.filter(d => d.region === filterRegion);

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8f7ff] pb-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-display uppercase tracking-tight text-civa-purple">
              Destinos <span className="text-civa-pink">Explora Perú</span>
            </h2>
            <p className="text-slate-500 font-medium italic">
              Seleccionamos las mejores rutas para tu próxima aventura en el territorio nacional.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setFilterRegion(region)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterRegion === region 
                  ? 'bg-civa-purple text-white shadow-lg' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-civa-purple/30'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: 'easeOut' }}
                key={dest.id}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-civa-purple/10 transition-all shadow-sm"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-display uppercase text-slate-800 tracking-tight leading-none mb-2">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-civa-pink text-[10px] font-black uppercase tracking-widest">
                        <MapPin className="w-3 h-3" />
                        REGION {dest.region}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl text-slate-300 group-hover:text-civa-purple group-hover:bg-civa-purple/5 transition-all">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Econociva (120°)</span>
                      <span className="text-sm font-bold text-slate-700 font-mono">S/ {dest.econociva}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                      <span className="text-[10px] font-black uppercase text-civa-purple tracking-wider">Superciva (160°)</span>
                      <span className="text-sm font-bold text-civa-purple font-mono">S/ {dest.superciva}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                      <span className="text-[10px] font-black uppercase text-civa-pink tracking-wider">Excluciva (180°)</span>
                      <span className="text-sm font-bold text-civa-pink font-mono">
                        {dest.excluciva > 0 ? `S/ ${dest.excluciva}` : 'NO DISP.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-8 text-[11px] text-slate-500 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Info className="w-4 h-4 text-civa-purple" />
                    Duración aprox: <span className="font-bold text-slate-700">{dest.duration}</span>
                  </div>
                  
                  <button 
                    onClick={() => onSelect(dest.name)}
                    className="w-full py-4 bg-slate-50 text-civa-purple font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 group-hover:bg-civa-purple group-hover:text-white transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Bus className="w-4 h-4" />
                    Reservar Ahora <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
