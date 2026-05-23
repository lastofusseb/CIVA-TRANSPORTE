import { useState } from 'react';
import { Bus, MapPin, Clock, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DESTINATIONS } from '../constants';
import { useTheme } from '../context/ThemeContext';

export default function Destinations({ onSelect }: { onSelect: (name: string) => void }) {
  const { theme } = useTheme();
  const [filterRegion, setFilterRegion] = useState<string | 'ALL'>('ALL');
  
  const regions = ['ALL', 'NORTE', 'SUR', 'ORIENTE'];
  const filteredDestinations = filterRegion === 'ALL' 
    ? DESTINATIONS 
    : DESTINATIONS.filter(d => d.region === filterRegion);

  return (
    <div className={`flex-1 overflow-y-auto p-10 pb-24 relative font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-tr from-civa-purple/5 via-transparent to-civa-pink/10' : 'bg-gradient-to-tr from-civa-purple/20 via-transparent to-rose-50/10'} pointer-events-none`} />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-civa-pink/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-1.5 h-10 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_15px_rgba(216,27,96,0.3)]" />
              <h2 className={`text-6xl font-display uppercase tracking-tight leading-tight text-white`}>
                Destinos <br /><span className="text-civa-pink italic drop-shadow-[0_0_25px_rgba(216,27,96,0.5)] sélection:bg-white selection:text-civa-pink font-medium">Explora Perú</span>
              </h2>
            </motion.div>
            <p className={`text-lg font-medium italic max-w-xl leading-relaxed text-white/40`}>
              Active su protocolo de navegación por las arterias viales del territorio nacional con nuestra <span className="text-white/60">flota de última generación</span>.
            </p>
          </div>
          
          <div className={`flex flex-wrap gap-4 p-2 rounded-[2.5rem] backdrop-blur-3xl border ring-1 shadow-2xl ${
            theme === 'dark' ? 'bg-white/5 border-white/5 ring-white/5' : 'bg-white/5 border-white/10 ring-white/5 shadow-black/20'
          }`}>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setFilterRegion(region)}
                className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 relative overflow-hidden ${
                  filterRegion === region 
                  ? 'text-slate-900' 
                  : (theme === 'dark' ? 'text-white/20 hover:text-white/50' : 'text-white/40 hover:text-white/60')
                }`}
              >
                {filterRegion === region && (
                  <motion.div 
                    layoutId="activeRegion"
                    className="absolute inset-0 bg-white shadow-[0_0_30px_rgba(216,27,96,0.3)]"
                  />
                )}
                <span className="relative z-10">{region}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                key={dest.id}
                className={`group backdrop-blur-3xl rounded-[4rem] overflow-hidden border hover:border-civa-pink/40 transition-all duration-700 shadow-2xl relative ring-1 ${
                  theme === 'dark' ? 'bg-[#1a0b2e]/40 border-white/5 ring-white/5 hover:shadow-[0_50px_100px_-20_rgba(0,0,0,0.8)]' : 'bg-white/5 border-white/10 ring-white/5 shadow-black/40'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-civa-pink/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className={`p-12 relative z-10 h-full flex flex-col`}>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className={`text-4xl font-display uppercase tracking-tight leading-none mb-4 group-hover:text-civa-pink transition-colors italic text-white`}>{dest.name}</h3>
                      <div className="flex items-center gap-3 text-civa-accent text-[10px] font-black uppercase tracking-[0.3em]">
                        <div className="w-1.5 h-1.5 bg-civa-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,176,255,0.5)]" />
                        REGION {dest.region}
                      </div>
                    </div>
                    <div className={`p-5 rounded-3xl group-hover:text-civa-pink group-hover:bg-civa-pink/10 transition-all border shadow-inner ${
                      theme === 'dark' ? 'bg-white/5 text-white/10 border-white/5' : 'bg-white/5 text-white/20 border-white/10 shadow-black/10'
                    }`}>
                      <Clock className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-6 mb-12 flex-1">
                    {[
                      { l: 'ECONOCIVA (120°)', v: dest.econociva, c: 'text-white/40' },
                      { l: 'SUPERCIVA (160°)', v: dest.superciva, c: 'text-civa-accent' },
                      { l: 'EXCLUCIVA (180°)', v: dest.excluciva, c: 'text-civa-pink' }
                    ].map((item, idx) => (
                      <div key={idx} className={`flex justify-between items-center py-4 border-b group/row ${theme === 'dark' ? 'border-white/5' : 'border-white/5'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${item.c} opacity-60 group-hover/row:opacity-100 transition-opacity`}>{item.l}</span>
                        <span className={`text-xl font-bold ${item.c} font-mono tracking-tighter italic`}>
                          {item.v > 0 ? `S/ ${item.v}` : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={`flex items-center gap-4 mb-10 text-[12px] font-medium p-6 rounded-[2.5rem] border shadow-inner relative overflow-hidden group/info ${
                    theme === 'dark' ? 'text-white/30 bg-black/20 border-white/5' : 'text-white/30 bg-black/40 border-white/10 shadow-black/30'
                  }`}>
                    <div className="absolute inset-0 bg-civa-pink/5 translate-x-full group-hover/info:translate-x-0 transition-transform duration-700" />
                    <span className="relative z-10 italic">Duración de Vector: <span className={`font-black ml-1 text-white`}>{dest.duration}</span></span>
                  </div>
                  
                  <button 
                    onClick={() => onSelect(dest.name)}
                    className="w-full py-6 bg-civa-purple text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-[2.2rem] flex items-center justify-center gap-4 hover:bg-civa-pink transition-all shadow-lg active:scale-95 border border-transparent group/btn"
                  >
                    <Bus className="w-5 h-5 transition-transform group-hover/btn:rotate-6" />
                    Sincronizar Ruta <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500" />
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
