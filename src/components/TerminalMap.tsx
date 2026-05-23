import { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MapPin, Phone, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface Terminal {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const TERMINALS: Terminal[] = [
  {
    id: 'jp',
    name: 'Terminal Javier Prado (Principal)',
    address: 'Av. Javier Prado Este 1155, La Victoria, Lima',
    phone: '(01) 418-1111',
    hours: '24 Horas',
    lat: -12.0865,
    lng: -77.0272
  },
  {
    id: 'pn',
    name: 'Terminal Plaza Norte',
    address: 'Av. Gerardo Unger s/n, Independencia, Lima',
    phone: '(01) 418-1111',
    hours: '06:00 AM - 11:00 PM',
    lat: -12.0061,
    lng: -77.0589
  },
  {
    id: 'aqp',
    name: 'Terminal Terrestre Arequipa',
    address: 'Av. Arturo Ibáñez s/n, Arequipa',
    phone: '(054) 234-444',
    hours: '24 Horas',
    lat: -16.4194,
    lng: -71.5518
  }
];

export default function TerminalMap() {
  const { theme } = useTheme();
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal>(TERMINALS[0]);
  const [mapReady, setMapReady] = useState(false);

  const onMapIdle = useCallback(() => {
    setMapReady(true);
  }, []);

  const handleTerminalClick = (terminal: Terminal) => {
    setSelectedTerminal(terminal);
  };

  if (!hasValidKey) {
    return (
      <div className="flex h-full items-center justify-center bg-transparent p-8 font-sans">
        <div className="text-center max-w-lg bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-2xl border border-white/10 ring-1 ring-white/20">
          <div className="w-24 h-24 bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_50px_rgba(255,102,153,0.15)]">
            <MapPin className="w-12 h-12 text-civa-pink" />
          </div>
          <h2 className="text-3xl font-display text-white uppercase tracking-tight mb-4">Núcleo de Geolocalización</h2>
          <p className="text-white/40 text-sm font-medium mb-8 leading-relaxed">
            Para activar la visualización satelital de nuestros terminales, configure su acceso:
          </p>
          
          <div className="space-y-4 text-left bg-black/20 p-8 rounded-3xl mb-8 border border-white/5 shadow-inner">
            <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-3">
              <span className="w-5 h-5 shrink-0 rounded-lg bg-civa-pink text-white flex items-center justify-center font-bold text-[9px]">01</span>
              Abre Ajustes (Icono ⚙️ arriba a la derecha)
            </p>
            <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-3">
              <span className="w-5 h-5 shrink-0 rounded-lg bg-civa-pink text-white flex items-center justify-center font-bold text-[9px]">02</span>
              Agrega Secret: <code className="bg-white/10 px-2 py-0.5 rounded text-civa-accent font-mono">GOOGLE_MAPS_PLATFORM_KEY</code>
            </p>
            <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-3 leading-relaxed">
              <span className="w-5 h-5 shrink-0 rounded-lg bg-civa-pink text-white flex items-center justify-center font-bold text-[9px]">03</span>
              Sincroniza la API de Google Cloud para ver el mapa en tiempo real.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mapStyles = [
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": theme === 'dark' ? "#ffffff" : "#4e1e8b" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{ "visibility": "on" }, { "color": theme === 'dark' ? "#0b0612" : "#ffffff" }, { "weight": 2 }]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{ "color": theme === 'dark' ? "#1a0b2e" : "#e0d6f2" }]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{ "saturation": -20 }, { "lightness": 30 }]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#d81b60" }, { "weight": 2 }]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{ "color": theme === 'dark' ? "#0b0612" : "#b3c1ff" }, { "visibility": "on" }]
    }
  ];

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className={`flex flex-col lg:flex-row h-full gap-8 p-10 overflow-hidden font-sans relative transition-colors duration-700 ${theme === 'dark' ? 'bg-[#08040d]' : 'bg-[#1a0b2e]'}`}>
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-tr from-civa-purple/5' : 'bg-gradient-to-tr from-civa-purple/20 via-transparent to-civa-pink/10'} to-transparent pointer-events-none`} />
        
        <div className="lg:w-[400px] flex flex-col gap-8 overflow-y-auto pr-6 custom-scrollbar shrink-0 relative z-10">
          <div className="mb-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-1.5 h-12 bg-gradient-to-b from-civa-pink to-civa-purple rounded-full shadow-[0_0_20px_rgba(216,27,96,0.4)]" />
              <h2 className={`text-5xl font-display uppercase tracking-tighter leading-none text-white`}>Hubs de <br /><span className="text-civa-pink drop-shadow-[0_0_15px_rgba(216,27,96,0.3)]">Conexión</span></h2>
            </motion.div>
            <p className={`text-base font-medium italic max-w-sm text-white/40`}>Geolocalización avanzada de terminales logísticos y puntos de arribo.</p>
          </div>

          <div className="space-y-6">
            {TERMINALS.map((terminal) => (
              <motion.button
                key={terminal.id}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTerminalClick(terminal)}
                className={`p-8 rounded-[3.5rem] text-left transition-all border relative overflow-hidden group w-full ${
                  selectedTerminal.id === terminal.id 
                    ? 'bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10 border-white/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-civa-pink/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className={`font-black uppercase text-[11px] tracking-[0.3em] font-display ${selectedTerminal.id === terminal.id ? 'text-slate-900' : 'text-white/40'}`}>
                    {terminal.name}
                  </h3>
                  <MapPin className={`w-6 h-6 transition-transform group-hover:rotate-12 ${selectedTerminal.id === terminal.id ? 'text-civa-pink drop-shadow-[0_0_10px_rgba(216,27,96,0.6)]' : 'text-white/10'}`} />
                </div>
                <p className={`text-[12px] font-bold leading-relaxed mb-8 relative z-10 italic ${selectedTerminal.id === terminal.id ? 'text-slate-500' : 'text-white/30'}`}>{terminal.address}</p>
                
                <div className="flex flex-wrap gap-6 relative z-10">
                  <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${selectedTerminal.id === terminal.id ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-white/30 bg-black/30 border-white/5'}`}>
                    <Phone className="w-4 h-4 text-civa-pink" />
                    {terminal.phone}
                  </div>
                  <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-xl border shadow-[0_0_15px_rgba(16,185,129,0.1)] ${selectedTerminal.id === terminal.id ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10'}`}>
                    <Clock className="w-4 h-4" />
                    {terminal.hours}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className={`flex-1 relative rounded-[5rem] overflow-hidden border h-[500px] lg:h-full group ring-1 ${theme === 'dark' ? 'shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] border-white/10 ring-white/10' : 'shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] border-white/10 ring-white/10'}`}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: selectedTerminal.lat, lng: selectedTerminal.lng }}
            center={{ lat: selectedTerminal.lat, lng: selectedTerminal.lng }}
            defaultZoom={15}
            zoom={selectedTerminal.id === 'aqp' ? 14 : 16}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            onIdle={onMapIdle}
            className={`w-full h-full transition-all duration-700`}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {mapReady && TERMINALS.map((terminal) => (
              <AdvancedMarker 
                key={terminal.id} 
                position={{ lat: terminal.lat, lng: terminal.lng }}
                title={terminal.name}
                onClick={() => handleTerminalClick(terminal)}
              >
                <div className={`p-2.5 rounded-2xl shadow-2xl border bg-white/10 backdrop-blur-md transition-all duration-500 transform ${
                  selectedTerminal.id === terminal.id 
                    ? 'border-civa-pink scale-125 z-50 ring-4 ring-civa-pink/20' 
                    : 'border-white/10 scale-100 opacity-60'
                }`}>
                  <img src="https://img.icons8.com/color/48/bus.png" className="w-8 h-8" alt="bus marker" />
                  {selectedTerminal.id === terminal.id && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-civa-pink rounded-full border-2 border-white animate-bounce" />
                      {/* Animated Pulse Ring */}
                      <div className="absolute inset-0 rounded-2xl border border-civa-pink animate-ping opacity-75" />
                    </>
                  )}
                </div>
              </AdvancedMarker>
            ))}
          </Map>

          {!mapReady && (
            <div className="absolute inset-0 bg-[#0f0716] flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
              <div className="flex gap-3 mb-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-4 h-4 bg-civa-pink rounded-full shadow-[0_0_15px_rgba(216,27,96,0.6)]"
                  />
                ))}
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Enlazando con Red Satelital CIVA...</p>
            </div>
          )}
        </div>
      </div>
    </APIProvider>
  );
}
