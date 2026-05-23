import { motion } from 'motion/react';
import { Timer, Zap, CheckCircle, BarChart3, TrendingDown, TrendingUp, Sparkles, BrainCircuit, Users, Clock, History } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useTheme } from '../context/ThemeContext';

const dashboardData = [
  { name: 'Lun', reservas: 400, precision: 92, latencia: 1.2 },
  { name: 'Mar', reservas: 300, precision: 95, latencia: 1.1 },
  { name: 'Mie', reservas: 550, precision: 98, latencia: 1.0 },
  { name: 'Jue', reservas: 278, precision: 94, latencia: 1.3 },
  { name: 'Vie', reservas: 489, precision: 96, latencia: 1.2 },
  { name: 'Sab', reservas: 639, precision: 97, latencia: 0.9 },
  { name: 'Dom', reservas: 849, precision: 99, latencia: 0.8 },
];

const COLORS = ['#4e1e8b', '#d81b60', '#ffd600', '#00e676'];

export default function ThesisMetrics() {
  const { theme } = useTheme();
  return (
    <div className={`p-10 space-y-12 max-w-7xl mx-auto pb-20 relative overflow-hidden min-h-full font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-civa-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-50/5 rounded-full blur-[100px] pointer-events-none" />

      <div className={`relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-10 ${theme === 'dark' ? 'border-white/5' : 'border-white/10'}`}>
        <div className="flex items-center gap-6">
          <div className="p-5 bg-gradient-to-br from-civa-purple to-civa-pink rounded-[2rem] text-white shadow-[0_0_30px_rgba(78,30,139,0.3)] transform -rotate-3 border border-white/20">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className={`text-5xl font-display uppercase tracking-tight leading-none mb-2 text-white`}>Panel <span className="text-civa-pink drop-shadow-[0_0_10px_rgba(216,27,96,0.5)]">Analítico</span></h2>
            <p className={`font-bold italic text-xl text-white/40`}>Sincronización de flujos y eficiencia cognitiva operativa.</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-4 px-8 py-4 rounded-[2rem] border backdrop-blur-xl shadow-2xl ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10 shadow-black/20'
        }`}>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-white/40`}>RESEARCH STREAM: LIVE</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp} label="Precisión Cognitiva" value="98.4%" color="bg-emerald-500" trend="+4.2%" theme={theme} />
        <StatCard icon={Users} label="Interacción IA" value="14.2k" color="bg-civa-purple" trend="+12%" theme={theme} />
        <StatCard icon={Clock} label="Latencia Inferencia" value="0.8s" color="bg-civa-accent" trend="-0.4s" theme={theme} />
        <StatCard icon={Zap} label="Ahorro Operativo" value="42.5%" color="bg-civa-pink" trend="+8.1%" theme={theme} />
      </div>

      <div className="relative z-10 grid lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-3xl p-10 rounded-[4rem] border shadow-2xl overflow-hidden group relative transition-colors ${
              theme === 'dark' ? 'bg-[#1a0b2e]/40 border-white/5' : 'bg-white/5 border-white/10 shadow-black/40'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-civa-purple/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-110" />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h4 className={`font-display uppercase tracking-tight text-3xl leading-none text-white`}>Flujo de Reservas</h4>
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-3 text-white/30`}>Procesamiento distribuido Copiloto G3</p>
              </div>
              <div className={`flex gap-3 p-2 rounded-2.5xl border backdrop-blur-md ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10 shadow-black/20'
              }`}>
                <button className={`px-5 py-2 hover:text-civa-pink rounded-2xl text-[9px] font-black uppercase tracking-widest transition-colors text-white/40`}>7D</button>
                <button className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl ${
                  theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-civa-purple shadow-black/10'
                }`}>30D</button>
              </div>
            </div>
            <div className="h-[400px] relative z-10">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={dashboardData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d81b60" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#4e1e8b" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={'rgba(255,255,255,0.03)'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 900, textAnchor: 'middle'}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 900}} 
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 7, 22, 0.9)', 
                      borderRadius: '2rem', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(20px)',
                      padding: '24px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
                    }}
                  />
                  <Bar dataKey="reservas" fill="url(#barGradient)" radius={[12, 12, 0, 0]} barSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Efficiency & Latency */}
          <div className="grid md:grid-cols-2 gap-8">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className={`backdrop-blur-3xl p-10 rounded-[3.5rem] border shadow-2xl relative overflow-hidden transition-colors ${
                 theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10 shadow-black/40'
               }`}
             >
                <div className={`absolute bottom-0 right-0 p-8 opacity-[0.03] text-white`}>
                  <BrainCircuit className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                  <h5 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/30`}>Red Neuronal</h5>
                  <p className={`text-5xl font-display mb-4 leading-none text-white`}>99.1%</p>
                  <div className={`w-full h-2 rounded-full overflow-hidden border bg-white/5 border-white/5`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '99.1%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-civa-pink to-civa-accent shadow-[0_0_15px_rgba(216,27,96,0.6)]" 
                    />
                  </div>
                  <p className={`mt-6 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed text-white/20`}>Máxima fidelidad en extracción de entidades semánticas.</p>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className={`backdrop-blur-3xl p-10 rounded-[3.5rem] border shadow-2xl relative overflow-hidden transition-colors ${
                 theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10 shadow-black/40'
               }`}
             >
                <h5 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/30`}>Latencia de Respuesta</h5>
                <div className="h-[120px] mb-6">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={dashboardData}>
                       <defs>
                        <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d81b60" stopOpacity={0.2}/>
                          <stop offset="100%" stopColor="#d81b60" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="latencia" stroke="#d81b60" fill="url(#latencyGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className={`text-4xl font-display leading-none text-white`}>1.02s</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest mt-2 text-white/20`}>Promedio Inferencia</p>
                  </div>
                  <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">-18% v2.4</span>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-3xl p-10 rounded-[4rem] border shadow-2xl h-[500px] flex flex-col relative overflow-hidden transition-colors ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10 shadow-black/40'
            }`}
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-civa-pink via-civa-purple to-civa-accent" />
            <h4 className={`font-display uppercase tracking-[0.4em] text-[10px] mb-10 text-white/30`}>Índice de Certeza</h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={dashboardData}>
                  <defs>
                    <linearGradient id="colorPrec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 7, 22, 0.9)', 
                      borderRadius: '1.5rem', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Area type="monotone" dataKey="precision" stroke="#00e676" fillOpacity={1} fill="url(#colorPrec)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-8 pt-8 border-t border-white/5`}>
              <div className="flex items-center justify-between px-2">
                 <span className={`text-[9px] font-black uppercase tracking-widest text-white/30`}>Estado</span>
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Optimizado</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-3xl p-8 rounded-[3rem] border shadow-2xl group transition-colors ${
              theme === 'dark' ? 'bg-[#0f0716]/60 border-white/5' : 'bg-white/5 border-white/10 shadow-black/20'
            }`}
          >
            <div className="flex items-center gap-5 mb-8">
                 <div className={`w-14 h-14 rounded-2.5xl flex items-center justify-center border group-hover:rotate-12 transition-transform shadow-inner bg-white/5 border-white/10`}>
                    <Sparkles className="w-6 h-6 text-civa-pink drop-shadow-[0_0_8px_rgba(216,27,96,0.3)]" />
                 </div>
                 <div>
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] text-white/20`}>Arquitectura</p>
                    <p className={`font-display text-xl uppercase tracking-tight text-white`}>CIVA AI <span className="text-civa-pink">v2.5</span></p>
                 </div>
            </div>
            <p className={`text-[11px] leading-relaxed italic font-medium px-2 text-white/40`}>
              Calibración avanzada utilizando Gemini Flash para procesamiento distribuido. Máximo rendimiento semántico en entornos de alta densidad de datos.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br rounded-[5rem] p-20 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border transition-colors ${
          theme === 'dark' ? 'from-[#1a0b2e] via-civa-purple/20 to-[#0f0716] border-white/5 text-white' : 'from-civa-purple via-civa-purple/90 to-civa-pink border-white/10 text-white'
        }`}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-civa-pink/10 rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10 grid md:grid-cols-[1fr_300px] gap-16 items-center">
          <div>
             <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-[2px] bg-civa-pink shadow-[0_0_10px_rgba(216,27,96,0.5)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">Philosophia Operativa</span>
             </div>
            <h3 className="text-5xl font-display uppercase mb-10 tracking-tight leading-none italic text-white">Postulado de <span className="text-civa-pink">CIVA Research</span></h3>
            <p className="text-white/60 leading-loose text-2xl font-medium italic mb-10 max-w-2xl">
              "La integración de arquitecturas generativas en el transporte masivo no es una mejora incremental; es una <span className="text-white border-b-2 border-civa-pink/30 pb-1">ruptura paradigmática</span> que traslada la carga cognitiva del usuario al sistema inteligente."
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="relative w-56 h-56 flex items-center justify-center"
            >
              <div className="absolute inset-0 border border-white/5 rounded-full" />
              <div className="absolute inset-4 border border-white/10 rounded-full border-dashed" />
              <div className="w-40 h-40 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center p-8 shadow-2xl relative">
                 <img src="https://www.civa.com.pe/assets/img/logo_civa.png" alt="Logo" className="w-full opacity-20 invert grayscale" />
                 <div className="absolute inset-0 bg-gradient-to-br from-civa-pink/10 to-transparent rounded-full" />
              </div>
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mt-12">Nucleus Core Engine v2.5</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend, theme }: { icon: any, label: string, value: string, color: string, trend: string, theme: string }) {
  return (
    <motion.div 
      whileHover={{ translateY: -10, scale: 1.02 }}
      className={`backdrop-blur-3xl p-10 rounded-[3.5rem] border shadow-2xl relative overflow-hidden group transition-colors ${
        theme === 'dark' ? 'bg-[#1a0b2e]/60 border-white/5 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-100'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className={`w-16 h-16 ${color} rounded-2.5xl flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:rotate-12 border border-white/20`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-4xl font-display leading-none tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      </div>
    </motion.div>
  );
}
