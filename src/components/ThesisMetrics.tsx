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
  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-civa-purple rounded-[2rem] text-white shadow-2xl shadow-civa-purple/30 transform -rotate-3">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-display uppercase tracking-tight text-civa-purple leading-none mb-2">Panel de Control <span className="text-civa-pink italic">Analítico IA</span></h2>
            <p className="text-slate-500 font-medium italic">Evaluación de impacto cognitivo y eficiencias operativas v2.5</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live Research Stream</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp} label="Precisión Cognitiva" value="98.4%" color="bg-green-500" trend="+4.2%" />
        <StatCard icon={Users} label="Interacción IA" value="14.2k" color="bg-civa-purple" trend="+12%" />
        <StatCard icon={Clock} label="Latencia Inferencia" value="0.8s" color="bg-civa-accent" trend="-0.4s" />
        <StatCard icon={Zap} label="Ahorro Operativo" value="42.5%" color="bg-civa-pink" trend="+8.1%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="font-display uppercase tracking-tight text-xl text-slate-800">Crecimiento de Reservas Asistidas</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Volumen semanal procesado por Copiloto G3</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black">7D</div>
                <div className="px-3 py-1 bg-civa-purple text-white rounded-lg text-[10px] font-black">30D</div>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4e1e8b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#d81b60" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                  />
                  <Bar dataKey="reservas" fill="url(#barGradient)" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Efficiency & Latency */}
          <div className="grid md:grid-cols-2 gap-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-8">
                  <BrainCircuit className="w-12 h-12 text-white/10" />
                </div>
                <h5 className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-6">Eficiencia Red Neuronal</h5>
                <p className="text-4xl font-display mb-2">99.1%</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.1%' }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-gradient-to-r from-civa-pink to-civa-accent" 
                  />
                </div>
                <p className="mt-4 text-xs text-white/40 font-medium italic">Tasa de éxito en extracción de entidades.</p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl"
             >
                <h5 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Latencia de Inferencia</h5>
                <div className="h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData}>
                      <Area type="monotone" dataKey="latencia" stroke="#d81b60" fill="#fdf2f8" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-2xl font-display text-slate-800">1.02s</span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">-18% vs v2.4</span>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl h-[450px] flex flex-col"
          >
            <h4 className="font-display uppercase tracking-widest text-xs text-slate-400 mb-8">Índice de Certeza</h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData}>
                  <defs>
                    <linearGradient id="colorPrec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d81b60" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#d81b60" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="precision" stroke="#d81b60" fillOpacity={1} fill="url(#colorPrec)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-civa-purple" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimización</p>
                    <p className="font-bold text-slate-800">CIVA AI v2.5</p>
                 </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              El modelo fue calibrado usando Gemini 3 Flash para maximizar la velocidad de respuesta sin sacrificar la coherencia gramatical.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-civa-purple to-civa-pink rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="relative z-10 grid md:grid-cols-[1fr_200px] gap-12 items-center">
          <div>
            <h3 className="text-4xl font-display uppercase mb-8 tracking-tight">Postulado la Investigación</h3>
            <p className="text-white/80 leading-relaxed text-xl font-medium italic mb-8">
              "La integración de arquitecturas generativas en el transporte masivo no es una mejora incremental; es una ruptura paradigmática que traslada la carga cognitiva del usuario al sistema."
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 mb-6 shadow-2xl">
               <img src="https://www.civa.com.pe/assets/img/logo_civa.png" alt="Logo" className="w-full grayscale opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 text-center">CIVA RESEARCH</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }: { icon: any, label: string, value: string, color: string, trend: string }) {
  return (
    <motion.div 
      whileHover={{ translateY: -5 }}
      className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-purple-900/[0.02] flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black">
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-display text-slate-800 leading-none">{value}</p>
      </div>
    </motion.div>
  );
}
