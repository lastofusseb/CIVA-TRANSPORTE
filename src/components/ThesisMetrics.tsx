import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Timer, Zap, CheckCircle, BarChart3, TrendingDown, TrendingUp, Sparkles, BrainCircuit, Users, Clock, History, Activity,
  Shield, DollarSign, CloudRain, Sun, Sliders, AlertTriangle, ChevronRight, HelpCircle, UserPlus, Trash2, HeartHandshake, Eye
} from 'lucide-react';
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
import {
  calculateRouteScore,
  predictCongestion,
  dashboardMetrics,
  optimalRoute,
  getTrafficStatus
} from "../lib/intelligentEngine";

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
  const [mounted, setMounted] = useState(false);

  // 4 VALUE PROPOSITIONS STATES
  const [activeValueTab, setActiveValueTab] = useState<'dijkstra' | 'fares' | 'timeline' | 'security'>('dijkstra');

  // Dijkstra state
  const [dijkstraTraffic, setDijkstraTraffic] = useState(45);
  const [dijkstraTime, setDijkstraTime] = useState(30);
  const [dijkstraDistance, setDijkstraDistance] = useState(25);
  const [dijkstraCost, setDijkstraCost] = useState(15);
  const [dijkstraRisk, setDijkstraRisk] = useState(10);

  // Fares & Demand State
  const [fareService, setFareService] = useState<'econociva' | 'superciva' | 'excluciva'>('superciva');
  const [fareSeason, setFareSeason] = useState<'normal' | 'semana_santa' | 'fiestas_patrias' | 'navidad'>('normal');
  const [farePassengers, setFarePassengers] = useState(1);
  const [fareLuggage, setFareLuggage] = useState(0);

  // Congestion curve state
  const [customWeather, setCustomWeather] = useState<'sunny' | 'rainy' | 'heavy_rain'>('sunny');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Safety status state
  const [safetyRoute, setSafetyRoute] = useState<'trujillo' | 'arequipa' | 'cusco' | 'piura' | 'chiclayo'>('trujillo');
  const [passengerInputName, setPassengerInputName] = useState('');
  const [passengerInputDni, setPassengerInputDni] = useState('');
  const [secManifest, setSecManifest] = useState<{name: string, dni: string, id: string}[]>([
    { name: "Juan Pérez", dni: "47281903", id: "SM-101" },
    { name: "Maria Alva", dni: "09218204", id: "SM-102" }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const routeScore = calculateRouteScore({
    traffic: 32,
    time: 20,
    distance: 18,
    cost: 10,
    risk: 5
  });

  const congestionPrediction = predictCongestion({
    currentTraffic: 55,
    hour: 18,
    weather: "rain"
  });

  const congestionStatus = getTrafficStatus(congestionPrediction);

  // Computed Dijkstra Score
  const computedDijkstraScore = Math.max(0, parseFloat((100 - (dijkstraTraffic * 0.40) - (dijkstraTime * 0.25) - (dijkstraDistance * 0.20) - (dijkstraCost * 0.10) - (dijkstraRisk * 0.05)).toFixed(1)));
  
  let dsRating = "Saturada / No Recomendable";
  let dsColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
  if (computedDijkstraScore >= 80) {
    dsRating = "Trayecto Óptimo / Alta Eficiencia";
    dsColor = "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
  } else if (computedDijkstraScore >= 60) {
    dsRating = "Trayecto Estable / Tránsito Medio";
    dsColor = "text-cyan-400 bg-cyan-500/10 border-cyan-400/20";
  } else if (computedDijkstraScore >= 40) {
    dsRating = "Vía Secundaria / Retrasos Ligeros";
    dsColor = "text-amber-400 bg-amber-500/10 border-amber-400/20";
  }

  // Fare calculations
  const getBasePrice = () => {
    if (fareService === 'econociva') return 60;
    if (fareService === 'superciva') return 90;
    return 120;
  };
  const getSeasonMultiplier = () => {
    if (fareSeason === 'semana_santa') return 1.8;
    if (fareSeason === 'fiestas_patrias') return 2.2;
    if (fareSeason === 'navidad') return 2.8;
    return 1.0;
  };
  const calculatedBaseTotal = getBasePrice() * farePassengers;
  const calculatedSeasonSurge = calculatedBaseTotal * (getSeasonMultiplier() - 1);
  const calculatedLuggageFee = fareLuggage * 2.50;
  const calculatedTotalBudget = calculatedBaseTotal + calculatedSeasonSurge + calculatedLuggageFee;

  // Congestion curve values based on customWeather state
  const hoursOfDeparture = [
    { hour: 6, label: '06:00' },
    { hour: 8, label: '08:00' },
    { hour: 10, label: '10:00' },
    { hour: 12, label: '12:00' },
    { hour: 14, label: '14:00' },
    { hour: 16, label: '16:00' },
    { hour: 18, label: '18:00' },
    { hour: 20, label: '20:00' },
    { hour: 22, label: '22:00' }
  ];

  const getWeatherFactor = () => {
    if (customWeather === 'rainy') return 15;
    if (customWeather === 'heavy_rain') return 25;
    return 0;
  };

  const baseHourlyTraffic = {
    6: 25,
    8: 75,
    10: 45,
    12: 35,
    14: 50,
    16: 60,
    18: 85,
    20: 70,
    22: 30
  };

  const getHourlyCongestion = (hr: number) => {
    const base = baseHourlyTraffic[hr as keyof typeof baseHourlyTraffic] || 50;
    return Math.min(100, base + getWeatherFactor());
  };

  // Find lowest hour
  let lowestHour = 22;
  let lowestCongestion = 100;
  hoursOfDeparture.forEach(h => {
    const cong = getHourlyCongestion(h.hour);
    if (cong < lowestCongestion) {
      lowestCongestion = cong;
      lowestHour = h.hour;
    }
  });

  // Safety status parameters based on safetyRoute state
  const safetySpecs = {
    trujillo: { index: 97, name: "Lima - Trujillo", weather: "Despejado", terrain: "Llanura Costera", details: "Eje Panamericano norte plano, clima seco, alta visibilidad, estabilizadores activos." },
    arequipa: { index: 92, name: "Lima - Arequipa", weather: "Parcial Nublado", terrain: "Zona de Quebradas", details: "Curvas moderadas en desniveles secos, monitoreo predictivo de fricción activo." },
    cusco: { index: 85, name: "Lima - Cusco", weather: "Lluvia Ligera", terrain: "Altas Cumbres Andinas", details: "Zonas montañosas, control activo de cabeceo por suspensión neumática, SOAT Premium incluido." },
    piura: { index: 95, name: "Lima - Piura", weather: "Cálido Desértico", terrain: "Arenas Planas", details: "Vientos cruzados estacionales, sensores antideslizamiento de neumáticos dinámicos." },
    chiclayo: { index: 96, name: "Lima - Chiclayo", weather: "Despejado", terrain: "Llanura Costera Norte", details: "Excelente adherencia de neumáticos, tramo lineal de flujo ágil optimizado." }
  };

  const currentSafetyInfo = safetySpecs[safetyRoute] || safetySpecs.trujillo;

  const handleAddManifestPassenger = () => {
    if (!passengerInputName.trim() || !passengerInputDni.trim()) return;
    const newPassenger = {
      name: passengerInputName.trim(),
      dni: passengerInputDni.trim(),
      id: `SM-${Math.floor(100 + Math.random() * 900)}`
    };
    setSecManifest([...secManifest, newPassenger]);
    setPassengerInputName('');
    setPassengerInputDni('');
  };

  const handleRemoveManifestPassenger = (id: string) => {
    setSecManifest(secManifest.filter(p => p.id !== id));
  };

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

      {/* Visual Metric Legend / Guide */}
      <div className={`relative z-10 p-8 rounded-[3rem] border backdrop-blur-xl ${
        theme === 'dark' ? 'bg-[#150a25]/60 border-white/5' : 'bg-slate-50/50 border-white/10'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-5 h-5 text-civa-pink animate-bounce" />
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">
            Guía de Interpretación de Métricas (Leyenda de Valores)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#00e676]">Precisión Cognitiva</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Calcula la exactitud lingüística con la que el modelo de CIVA IA extrae parámetros de viaje (Origen, Destino, Pasajeros, Fechas) a partir del chat.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#d81b60] shadow-[0_0_8px_rgba(216,27,96,0.5)]" />
              <span className="text-xs font-black uppercase tracking-widest text-civa-pink">Flujo / Latencia</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Muestra el caudal acumulado de reservas procesadas y la latencia en segundos (el tiempo que tarda la IA en responder con datos estructurados).
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">Índice de Certeza</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              El nivel de confianza del motor cognitivo al sugerir ofertas estacionales, rutas alternativas ágiles y optimizaciones de presupuesto en tiempo real.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              <span className="text-xs font-black uppercase tracking-widest text-fuchsia-400">Route Score (Dijkstra)</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Puntuación integral de eficiencia (0% a 100%) calculada en base a: Tráfico (40%), Duración (25%), Distancia (20%), Peajes (10%) y Clima (5%).
            </p>
          </div>
        </div>
      </div>

      {/* Intelligent Engine Metrics */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NUEVA CARD — ROUTE SCORE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#14051f] border border-fuchsia-500/20 rounded-[2rem] p-8 shadow-[0_0_60px_rgba(217,70,239,0.08)] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-black">
                Intelligent Route Score
              </p>
              <h2 className="text-5xl font-black text-fuchsia-500 mt-4 leading-none">
                {routeScore}%
              </h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="text-fuchsia-400 w-8 h-8" />
            </div>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Evaluación dinámica basada en IA híbrida,
            optimización computacional y análisis multicriterio.
          </p>
        </motion.div>

        {/* NUEVA CARD — CONGESTION PREDICTION */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#14051f] border border-emerald-500/20 rounded-[2rem] p-8 shadow-[0_0_60px_rgba(16,185,129,0.08)] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-black">
                Congestion Prediction
              </p>
              <h2 className="text-5xl font-black text-emerald-400 mt-4 leading-none">
                {congestionPrediction}%
              </h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Activity className="text-emerald-400 w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-sm">
              Estado predictivo del tráfico urbano.
            </p>
            <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-[0.2em] ml-2">
              {congestionStatus}
            </span>
          </div>
        </motion.div>

        {/* NUEVA CARD — OPTIMAL ROUTE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#14051f] border border-cyan-500/20 rounded-[2rem] p-8 shadow-[0_0_60px_rgba(6,182,212,0.08)] flex flex-col justify-between"
        >
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-black">
              Optimal Route Engine
            </p>
            <h2 className="text-3xl font-black text-cyan-400 mt-4 leading-none">
              {optimalRoute.name}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
              <span className="text-zinc-400 text-sm">Optimization Score</span>
              <span className="text-white font-black">
                {optimalRoute.score?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
              <span className="text-zinc-400 text-sm">Traffic Factor</span>
              <span className="text-white font-black">
                {optimalRoute.traffic}%
              </span>
            </div>
            <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <span className="text-emerald-500 text-sm font-medium">ETA Stability</span>
              <span className="text-emerald-400 font-black text-xs tracking-wider">
                OPTIMIZED
              </span>
            </div>
          </div>
        </motion.div>
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
              {mounted ? (
                <ResponsiveContainer id="flow-chart" width="100%" height={400}>
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
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-mono">
                  Sincronizando flujo de reservas...
                </div>
              )}
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
                  {mounted ? (
                    <ResponsiveContainer id="latency-chart" width="100%" height={120}>
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
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-mono">
                      Calculando latencia...
                    </div>
                  )}
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
            <div className="flex-1 min-h-[200px] relative">
              {mounted ? (
                <ResponsiveContainer id="certainty-chart" width="100%" height={230}>
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
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-mono">
                  Calculando precisión...
                </div>
              )}
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

      {/* ================================================== */}
      {/* 4 PROPUESTAS DE VALOR AGREGADO INTERACTIVAS v2.5 */}
      {/* ================================================== */}
      <div className="relative z-10 w-full mt-16 scroll-mt-10" id="premium-val-propositions">
        <div className={`backdrop-blur-3xl p-10 md:p-14 rounded-[4rem] border shadow-2xl relative overflow-hidden transition-all duration-700 ${
          theme === 'dark' ? 'bg-[#120722]/80 border-white/5 shadow-black/80' : 'bg-white/95 border-slate-200/80 shadow-slate-300'
        }`}>
          {/* Subtle grid animation/vibe background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--color-fuchsia-500)_1%,transparent_60%)] opacity-[0.03] pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-civa-pink/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Module Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/10 pb-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-civa-pink to-civa-purple text-xs text-white font-black uppercase tracking-[0.25em] flex items-center gap-2 border border-white/10 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  Módulo Premium CIVA AI
                </div>
              </div>
              <h3 className={`text-4xl md:text-5xl font-display uppercase tracking-tight italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Propuestas de <span className="text-civa-pink drop-shadow-[0_0_8px_rgba(216,27,96,0.3)]">Valor Agregado</span>
              </h3>
              <p className={`text-[11px] font-black uppercase tracking-[0.4em] mt-3 ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                4 Células de simulación heurística y optimización de viaje
              </p>
            </div>

            {/* Custom Interactive Tab Selectors */}
            <div className={`flex flex-wrap gap-2 p-2 rounded-3xl border backdrop-blur-xl ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
            }`} id="vpropositions-tabs">
              <button 
                id="vprop-tab-dijkstra"
                onClick={() => setActiveValueTab('dijkstra')}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                  activeValueTab === 'dijkstra' 
                    ? 'bg-[#d81b60] text-white shadow-[0_0_20px_rgba(216,27,96,0.4)]' 
                    : theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Dijkstra Heurístico
              </button>
              <button 
                id="vprop-tab-fares"
                onClick={() => setActiveValueTab('fares')}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                  activeValueTab === 'fares' 
                    ? 'bg-[#d81b60] text-white shadow-[0_0_20px_rgba(216,27,96,0.4)]' 
                    : theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Tarifas y Demanda
              </button>
              <button 
                id="vprop-tab-timeline"
                onClick={() => setActiveValueTab('timeline')}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                  activeValueTab === 'timeline' 
                    ? 'bg-[#d81b60] text-white shadow-[0_0_20px_rgba(216,27,96,0.4)]' 
                    : theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Predicción de Congestión
              </button>
              <button 
                id="vprop-tab-security"
                onClick={() => setActiveValueTab('security')}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                  activeValueTab === 'security' 
                    ? 'bg-[#d81b60] text-white shadow-[0_0_20px_rgba(216,27,96,0.4)]' 
                    : theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Seguridad y Manifiesto
              </button>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="relative min-h-[380px]" id="value-proposition-tab-contents">
            
            {/* TAB 1: DIJKSTRA HEURISTIC WEIGHT EXPLAINER */}
            {activeValueTab === 'dijkstra' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12"
                id="dijkstra-simulator-view"
              >
                <div className="space-y-8">
                  <div>
                    <h4 className={`text-xl font-black uppercase tracking-tight italic flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      <Sliders className="w-5 h-5 text-civa-pink" />
                      Ajuste de Atributos de Ponderación Dijkstra
                    </h4>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Modifica los coeficientes viales para ver cómo el algoritmo busca el camino con menor costo integrado.
                    </p>
                  </div>

                  {/* HIGH VALUE EXPLANATORY CRADLE */}
                  <div className={`p-6 rounded-3xl border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-white/[0.02] border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <span className="font-black text-civa-pink uppercase tracking-widest text-[9px] block mb-2">💡 ¿PARA QUÉ SIRVE ESTE AJUSTE?</span>
                    <p>
                      El motor cognitivo de CIVA IA computa las rutas viales del Perú utilizando un modelo heurístico basado en el <strong>Algoritmo de Dijkstra</strong>. Al modificar estos coeficientes deslizando los controles:
                    </p>
                    <ul className="list-disc pl-4 mt-2.5 space-y-2 font-medium">
                      <li><strong>Simulas prioridades de viaje:</strong> Por ejemplo, priorizar un trayecto rápido (baja tolerancia al Tiempo) frente a la economía (bajo Costo).</li>
                      <li><strong>Recalculas la Ruta Óptima en tiempo real:</strong> Si el riesgo climático o la congestión viales superan el umbral que definas, la IA penalizará severamente ese tramo y buscará trazados viales alternativos y desvíos seguros.</li>
                    </ul>
                  </div>

                  <div className="space-y-6">
                    {/* Traffic Factor */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                        <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-600'}>Tráfico en Ruta (Peso 40%)</span>
                        <span className="text-civa-pink">{dijkstraTraffic}% Congestión</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={dijkstraTraffic} 
                        onChange={(e) => setDijkstraTraffic(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg bg-white/10 accent-civa-pink appearance-none cursor-pointer"
                        id="slider-traffic"
                      />
                    </div>

                    {/* Time Factor */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                        <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-600'}>Tiempo Estimado (Peso 25%)</span>
                        <span className="text-fuchsia-400">{dijkstraTime}% Duración Estocástica</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={dijkstraTime} 
                        onChange={(e) => setDijkstraTime(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg bg-white/10 accent-[#8b5cf6] appearance-none cursor-pointer"
                        id="slider-time"
                      />
                    </div>

                    {/* Distance Factor */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                        <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-600'}>Distancia del Recorrido (Peso 20%)</span>
                        <span className="text-cyan-400">{dijkstraDistance}% Kilometraje</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={dijkstraDistance} 
                        onChange={(e) => setDijkstraDistance(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg bg-white/10 accent-cyan-400 appearance-none cursor-pointer"
                        id="slider-distance"
                      />
                    </div>

                    {/* Cost Factor */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                        <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-600'}>Costo Operativo / Peajes (Peso 10%)</span>
                        <span className="text-amber-400">{dijkstraCost}% Indexación Fiscal</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={dijkstraCost} 
                        onChange={(e) => setDijkstraCost(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg bg-white/10 accent-amber-400 appearance-none cursor-pointer"
                        id="slider-cost"
                      />
                    </div>

                    {/* Risk Factor */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                        <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-600'}>Riesgo Geográfico / Clima (Peso 5%)</span>
                        <span className="text-rose-500">{dijkstraRisk}% Alerta Climática</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={dijkstraRisk} 
                        onChange={(e) => setDijkstraRisk(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg bg-white/10 accent-rose-500 appearance-none cursor-pointer"
                        id="slider-risk"
                      />
                    </div>
                  </div>
                </div>

                {/* Score Output card */}
                <div className={`p-8 rounded-[3rem] border flex flex-col justify-between relative overflow-hidden ${
                  theme === 'dark' ? 'bg-[#1b0c30]/50 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-inner'
                }`} id="dijkstra-math-outcome-card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-civa-purple/5 rounded-full blur-[40px] pointer-events-none" />

                  <div className="space-y-6">
                    <p className={`text-[10px] uppercase font-black tracking-[0.3em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                      Dijkstra Efficiency Route Score
                    </p>
                    <div className="flex items-baseline gap-4">
                      <h2 className="text-7xl font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-civa-pink via-civa-accent to-emerald-400">
                        {computedDijkstraScore}%
                      </h2>
                      <span className={`px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-wider ${dsColor}`}>
                        {dsRating}
                      </span>
                    </div>

                    {/* Live Equation display */}
                    <div className="space-y-4">
                      <p className={`text-xs font-mono font-black ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                        Matriz de deducción algorítmica:
                      </p>
                      <div className="p-5 bg-black/30 border border-white/5 rounded-2Xl font-mono text-[11px] leading-relaxed text-zinc-300 space-y-3">
                        <div className="text-white font-bold opacity-80">
                          score_ruta = 100 - (T * 0.40) - (D * 0.25) - (K * 0.20) - (C * 0.10) - (R * 0.05)
                        </div>
                        <div className="h-[1px] bg-white/5" />
                        <div className="space-y-1">
                          <div>• Penalización por Tráfico: -{(dijkstraTraffic * 0.40).toFixed(1)}pt</div>
                          <div>• Penalización por Duración: -{(dijkstraTime * 0.25).toFixed(1)}pt</div>
                          <div>• Penalización por Distancia: -{(dijkstraDistance * 0.20).toFixed(1)}pt</div>
                          <div>• Penalización por Costo: -{(dijkstraCost * 0.10).toFixed(1)}pt</div>
                          <div>• Penalización por Riesgo: -{(dijkstraRisk * 0.05).toFixed(1)}pt</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className={`text-[10px] leading-relaxed italic ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                      El COPILOTO INTELIGENTE compara dinámicamente las rutas alternativas del Perú y prioriza en tiempo real aquella que arroje el SCORE de peso Dijkstra más cercano a 100%.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: FARES & DYNAMIC DEMAND OPTIMIZER */}
            {activeValueTab === 'fares' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12"
                id="fares-calculator-view"
              >
                <div className="space-y-8">
                  <div>
                    <h4 className={`text-xl font-black uppercase tracking-tight italic flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      <DollarSign className="w-5 h-5 text-civa-pink" />
                      Planificador Presupuestal y Demanda Estacional
                    </h4>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Calcula las tarifas estimadas frente a la inflación de alta demanda en temporadas pico.
                    </p>
                  </div>

                  {/* Options select */}
                  <div className="space-y-6">
                    {/* Service selection */}
                    <div className="space-y-3">
                      <label className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Tipo de Servicio</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['econociva', 'superciva', 'excluciva'].map((srv) => (
                          <button
                            key={srv}
                            onClick={() => setFareService(srv as any)}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                              fareService === srv
                                ? 'bg-gradient-to-r from-civa-purple to-civa-pink text-white border-transparent shadow-lg'
                                : theme === 'dark' ? 'bg-black/20 border-white/5 text-white/50 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {srv === 'econociva' ? 'Econociva (S/ 60)' : srv === 'superciva' ? 'Superciva (S/ 90)' : 'Excluciva (S/ 120)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Season selection */}
                    <div className="space-y-3">
                      <label className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Calendario / Temporada</label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { id: 'normal', name: 'Normal (1.0x)' },
                          { id: 'semana_santa', name: 'Semana S. (1.8x)' },
                          { id: 'fiestas_patrias', name: 'Julio 28 (2.2x)' },
                          { id: 'navidad', name: 'Navidad (2.8x)' }
                        ].map((szn) => (
                          <button
                            key={szn.id}
                            onClick={() => setFareSeason(szn.id as any)}
                            className={`py-3.5 px-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border ${
                              fareSeason === szn.id
                                ? 'bg-[#d81b60] text-white border-transparent shadow-md'
                                : theme === 'dark' ? 'bg-black/20 border-white/5 text-white/50 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {szn.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Passengers & luggage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Asientos / Pasajeros</label>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setFarePassengers(Math.max(1, farePassengers - 1))}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${
                              theme === 'dark' ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                            }`}
                          >-</button>
                          <span className={`w-12 text-center text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{farePassengers}</span>
                          <button 
                            onClick={() => setFarePassengers(Math.min(10, farePassengers + 1))}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${
                              theme === 'dark' ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                            }`}
                          >+</button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                          <span className={theme === 'dark' ? 'text-white/40' : 'text-slate-500'}>Equipaje de Exceso</span>
                          <span className="text-amber-400">{fareLuggage} kg de Exceso</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="20" 
                          value={fareLuggage} 
                          onChange={(e) => setFareLuggage(parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg bg-white/10 accent-civa-pink appearance-none cursor-pointer mt-4"
                          id="excess-luggage-slider"
                        />
                        <p className={`text-[9px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Tolerancia gratuita: 30kg. Exceso: S/ 2.50/kg</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Invoice output */}
                <div className={`p-8 rounded-[3rem] border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#1b0c30]/50 border-white/5' : 'bg-slate-50 border-slate-200'
                }`} id="fares-invoice-outcome">
                  <div className="space-y-6">
                    <p className={`text-[10px] uppercase font-black tracking-[0.3em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Detalle del Presupuesto IA</p>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-600'}>Pasaje base ({farePassengers} pax)</span>
                        <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>S/ {calculatedBaseTotal.toFixed(2)}</span>
                      </div>
                      
                      {calculatedSeasonSurge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Recargo Temporada ({fareSeason === 'semana_santa' ? 'Easter' : fareSeason === 'fiestas_patrias' ? '28 Julio' : 'Navidad'})
                          </span>
                          <span className="text-amber-400 font-black">+ S/ {calculatedSeasonSurge.toFixed(2)}</span>
                        </div>
                      )}

                      {calculatedLuggageFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-fuchsia-400 select-none">Exceso de Equipaje ({fareLuggage} kg)</span>
                          <span className="text-fuchsia-400 font-black">+ S/ {calculatedLuggageFee.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="h-[1px] bg-white/10 my-4" />

                      <div className="flex justify-between items-baseline">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Inversión Total</span>
                        <div className="text-right">
                          <h2 className="text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-civa-pink to-emerald-400">
                            S/ {calculatedTotalBudget.toFixed(2)}
                          </h2>
                          <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-emerald-500/80' : 'text-emerald-600'}`}>Sincronización via Yape Activa</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-8 p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-100 shadow-sm'} flex items-start gap-4`}>
                    <HeartHandshake className="w-6 h-6 text-civa-pink shrink-0" />
                    <p className={`text-[10px] leading-relaxed italic ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                      <strong>Consejo de Valor CIVA AI:</strong> Reservando tus viajes para Fiestas Patrias o Navidad con al menos 20 días de anticipación con el Copiloto Inteligente, aseguras pasajes a tarifa plana normal, evitando el recargo estacional dinámico de las semanas pico.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: CONGESTION PREDICTION & DETAILED TIMELINE PLANNER */}
            {activeValueTab === 'timeline' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
                id="congestion-timeline-view"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className={`text-xl font-black uppercase tracking-tight italic flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      <Activity className="w-5 h-5 text-civa-pink" />
                      Planificación Horaria y Escenario Climático
                    </h4>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Analiza la congestión estocástica de salida y calcula el tiempo de retraso previsto según la hora y clima.
                    </p>
                  </div>

                  {/* Weather switcher */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-black tracking-wider ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Clima Simulator:</span>
                    <div className={`flex p-1 border rounded-xl backdrop-blur-md ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                      {[
                        { id: 'sunny', label: 'Despejado', icon: Sun },
                        { id: 'rainy', label: 'Lluvia (+15%)', icon: CloudRain },
                        { id: 'heavy_rain', label: 'Tormenta (+25%)', icon: AlertTriangle }
                      ].map((w) => {
                        const IconComponent = w.icon;
                        return (
                          <button
                            key={w.id}
                            onClick={() => setCustomWeather(w.id as any)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                              customWeather === w.id
                                ? 'bg-civa-pink text-white shadow-sm'
                                : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Simulated Curve Timeline */}
                <div className={`p-8 rounded-[3.5rem] border ${
                  theme === 'dark' ? 'bg-[#1b0c30]/40 border-white/5' : 'bg-slate-50 border-slate-200'
                }`} id="congestion-timeline-grid-wrapper">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <p className={`text-[10px] uppercase font-black tracking-[0.3em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                      Índice Predictivo De Congestión Vial por Horas
                    </p>
                    
                    {/* ENRICHED AESTHETIC LEGEND */}
                    <div className="flex flex-wrap gap-4 text-[10px] uppercase font-black tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}>Verde (&lt;45%): Fluidez Óptima</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>Amarillo (45%-70%): Flujo Moderado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                        <span className={theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}>Rojo (&gt;70%): Congestión Crítica</span>
                      </div>
                    </div>
                  </div>

                  {/* LEGEND INTUITION PANEL */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl mb-8 border text-[11px] leading-relaxed ${
                    theme === 'dark' ? 'bg-black/20 border-white/5 text-zinc-300' : 'bg-white border-slate-100 text-slate-600'
                  }`}>
                    <div>
                      <strong className="text-emerald-400 uppercase tracking-widest text-[9px] block mb-1">🟢 Fluidez Óptima (&lt;45%)</strong>
                      Ideal para salir. Mayor autonomía de combustible, tránsito fluido en carreteras andinas/costeras, y mínimo retraso temporal.
                    </div>
                    <div>
                      <strong className="text-amber-400 uppercase tracking-widest text-[9px] block mb-1">🟡 Flujo Moderado (45% - 70%)</strong>
                      Condiciones estándar de tránsito. Velocidades normales pero con ligeras variaciones de ETA debido a transportes locales.
                    </div>
                    <div>
                      <strong className="text-rose-400 uppercase tracking-widest text-[9px] block mb-1">🔴 Congestión Crítica (&gt;70%)</strong>
                      Horas pico o clima hostil. Alto riesgo de detenciones temporales, mayor gasto de combustible por parada y retrasos de +30 min.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
                    {hoursOfDeparture.map((item) => {
                      const congestionPct = getHourlyCongestion(item.hour);
                      let borderStyle = "border-emerald-500/20 bg-emerald-500/5";
                      let textStyle = "text-emerald-400";
                      let barColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";

                      if (congestionPct > 70) {
                        borderStyle = "border-rose-500/30 bg-rose-500/5";
                        textStyle = "text-rose-400";
                        barColor = "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                      } else if (congestionPct > 45) {
                        borderStyle = "border-amber-500/20 bg-amber-500/5";
                        textStyle = "text-amber-400";
                        barColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
                      }

                      return (
                        <div
                          key={item.hour}
                          onMouseEnter={() => setHoveredHour(item.hour)}
                          onMouseLeave={() => setHoveredHour(null)}
                          className={`p-5 rounded-2.5xl border text-center transition-all duration-300 transform hover:scale-105 cursor-pointer relative ${
                            hoveredHour === item.hour 
                              ? 'ring-2 ring-civa-pink scale-105 shadow-[0_15px_30px_rgba(0,0,0,0.3)]' 
                              : ''
                          } ${borderStyle}`}
                        >
                          <p className={`text-xs font-mono font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>{item.label}</p>
                          <div className={`w-full h-12 rounded-full overflow-hidden bg-white/5 my-4 relative flex items-end justify-center p-1`}>
                            <div className="w-full rounded-full transition-all duration-500" style={{ height: `${congestionPct}%`, backgroundColor: 'transparent' }}>
                              <div className={`w-full h-full rounded-full ${barColor}`} />
                            </div>
                          </div>
                          <p className={`text-sm font-black tracking-tight ${textStyle}`}>{congestionPct}%</p>
                          
                          {/* Delayed output snippet */}
                          <div className={`text-[8px] font-bold uppercase mt-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>
                            +{Math.round(congestionPct * 0.35)} min ETA
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-white/5 items-center">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest text-civa-pink`}>RECOMENDACIÓN DIGITAL PARA SELECCIÓN DEL HORARIO:</span>
                      <h4 className={`text-lg font-black uppercase italic mt-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        Partir a las {lowestHour}:00 horas es la opción más eficiente
                      </h4>
                      <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Nuestros servidores cognitivos prevén que a las {lowestHour}:00 el flujo vial alcanza su nivel mínimo de {lowestCongestion}% con un retraso promedio en ruta de solo {Math.round(lowestCongestion * 0.35)} minutos.
                      </p>
                    </div>

                    <div className={`p-6 rounded-2xl border ${
                      theme === 'dark' ? 'bg-[#00e676]/5 border-[#00e676]/15' : 'bg-emerald-500/5 border-emerald-500/20'
                    } flex items-center gap-4`}>
                      <Clock className="w-10 h-10 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-emerald-400 text-xs font-black uppercase tracking-widest">Optimización de Arribo</div>
                        <p className={`text-[10px] mt-1 leading-relaxed ${theme === 'dark' ? 'text-[#00e676]/80' : 'text-emerald-700'}`}>
                          Bajo el escenario climático de simulación "{customWeather === 'sunny' ? 'Despejado' : customWeather === 'rainy' ? 'Lluvia Moderada' : 'Tormenta / Aluvión'}", viajar fuera de las horas pico (08:00 y 18:00) reduce efectivamente el gasto estocástico de combustible en un <strong>24%</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: ACTIVE PASSENGER MANIFEST & ROUTE SAFETY ANALYSIS */}
            {activeValueTab === 'security' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12"
                id="security-manifest-view"
              >
                <div className="space-y-8">
                  <div>
                    <h4 className={`text-xl font-black uppercase tracking-tight italic flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      <Shield className="w-5 h-5 text-civa-pink" />
                      Trazabilidad Geográfica e Indicador de Estabilidad
                    </h4>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Consulta el índice de estabilidad de tramo y monitorea el manifiesto de seguridad activo.
                    </p>
                  </div>

                  {/* Route selector buttons */}
                  <div className="space-y-4">
                    <label className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Seleccionar Ruta para Análisis Geográfico:</label>
                    <div className="flex flex-wrap gap-2.5">
                      {['trujillo', 'arequipa', 'cusco', 'piura', 'chiclayo'].map((rt) => (
                        <button
                          key={rt}
                          onClick={() => setSafetyRoute(rt as any)}
                          className={`px-5 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                            safetyRoute === rt
                              ? 'bg-civa-purple text-white border-transparent shadow'
                              : theme === 'dark' ? 'bg-black/20 border-white/5 text-white/50 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {rt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Regional indicators */}
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.02]' : 'bg-white shadow-inner'} border-white/5 space-y-4`}>
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Segmento Vial</span>
                      <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{currentSafetyInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Geografía Terrain</span>
                      <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{currentSafetyInfo.terrain}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Reporte Clima Real</span>
                      <span className={`text-sm font-bold text-emerald-400`}>{currentSafetyInfo.weather}</span>
                    </div>
                    <div className="space-y-2">
                      <span className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Control Dinámico Estabilizador:</span>
                      <p className={`text-[11px] leading-relaxed italic ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>{currentSafetyInfo.details}</p>
                    </div>
                  </div>
                </div>

                {/* Live Passenger Manifest custom registry */}
                <div className={`p-8 rounded-[3.5rem] border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#1a0b2e]/60 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner'
                }`} id="security-passenger-registry">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className={`text-[10px] uppercase font-black tracking-[0.3em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Manifiesto Inteligente de Pasajeros</p>
                      <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        SOAT Premium Activo
                      </span>
                    </div>

                    {/* Inputs panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text"
                        placeholder="Nombre Pasajero"
                        value={passengerInputName}
                        onChange={(e) => setPassengerInputName(e.target.value)}
                        className={`px-4 py-3 rounded-xl border text-[11px] font-bold outline-none ${
                          theme === 'dark' ? 'bg-black/30 border-white/5 text-white placeholder:text-white/20' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                        id="passenger-input-name"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="DNI"
                          maxLength={8}
                          value={passengerInputDni}
                          onChange={(e) => setPassengerInputDni(e.target.value)}
                          className={`px-4 py-3 rounded-xl border text-[11px] font-bold outline-none flex-1 ${
                            theme === 'dark' ? 'bg-black/30 border-white/5 text-white placeholder:text-white/20' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                          id="passenger-input-dni"
                        />
                        <button
                          onClick={handleAddManifestPassenger}
                          className="px-4 bg-civa-purple text-white rounded-xl hover:bg-civa-pink transition-colors cursor-pointer flex items-center justify-center shadow"
                          id="btn-add-passenger"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Registry list */}
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                      {secManifest.map((p) => (
                        <div 
                          key={p.id} 
                          className={`px-5 py-3 rounded-xl border flex items-center justify-between text-xs transition-colors hover:bg-white/5 ${
                            theme === 'dark' ? 'bg-black/20 border-white/5 text-white/80' : 'bg-white border-slate-100 text-slate-700 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-civa-pink/80 text-[10px] font-bold">{p.id}</span>
                            <span className="font-bold capitalize">{p.name}</span>
                            <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>• DNI {p.dni}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveManifestPassenger(p.id)}
                            className="text-white/20 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-6 pt-5 border-t border-white/5`}>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={theme === 'dark' ? 'text-white/30' : 'text-slate-400'}>Score de Seguridad Vial:</span>
                      <span className="font-bold text-fuchsia-400">{currentSafetyInfo.index}/100 ESTABILIDAD</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-3 border border-white/5">
                      <div className="h-full bg-gradient-to-r from-civa-pink via-civa-purple to-[#00e676]" style={{ width: `${currentSafetyInfo.index}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
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
