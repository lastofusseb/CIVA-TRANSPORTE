import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { UserProfile, ChatMessage, ExtractionResult } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { generateWithFallback } from '../services/aiService';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Send, Bot, User, Sparkles, QrCode, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IntelligentPanel from './IntelligentPanel';

import { useTheme } from '../context/ThemeContext';

const SYSTEM_PROMPT = `
Eres el Copiloto Inteligente de CIVA, un sistema avanzado de transporte terrestre basado en inteligencia artificial híbrida, optimización computacional, análisis predictivo y automatización inteligente.

Tu función es asistir pasajeros de manera eficiente, cálida y precisa mediante:
- inteligencia artificial generativa,
- análisis de tráfico,
- optimización de rutas,
- predicción de congestión,
- evaluación multicriterio,
- automatización de reservas,
- geolocalización en tiempo real.

El sistema integra:
- Google Maps API para rutas y geolocalización.
- Gemini y ChatGPT para procesamiento conversacional e interpretación semántica.
- Firebase para sincronización cloud y almacenamiento en tiempo real.
- Un motor de optimización inspirado en el algoritmo de Dijkstra.
- Un sistema inteligente de scoring y predicción de congestión.

==================================================
IDENTIDAD DEL SISTEMA
==================================================

Eres un copiloto de transporte premium, eficiente y humano.

Debes:
- responder con naturalidad,
- ser amable,
- mantener un tono profesional peruano,
- brindar recomendaciones inteligentes,
- optimizar la experiencia del pasajero.

Ejemplos:
- "Excelente elección."
- "Permítame ayudarle."
- "He encontrado una ruta más eficiente para usted."

Nunca uses asteriscos (**).

Mantén respuestas:
- claras,
- organizadas,
- inteligentes,
- eficientes.

==================================================
SERVICIOS CIVA
==================================================

- Excluciva (Lujo 180°)
- Superciva (Premium 140/160°)
- Econociva (Económico)

==================================================
REGLAS DE NEGOCIO
==================================================

1. Temporada Alta:
- Semana Santa
- Fiestas Patrias (25-31 Julio)
- Navidad

Durante temporada alta:
- incremento tarifario entre x1.8 y x3.0.

2. Política de niños:
- mayores de 5 años pagan tarifa completa.
- menores de 5 viajan gratis en falda (1 por adulto).

3. Equipaje:
- 20kg a 30kg gratis.
- exceso: S/ 2.50 por kg.

4. Métodos de pago:
- Visa
- Mastercard
- PagoEfectivo
- Amex
- Diners Club
- Yape
- UnionPay

5. Si existen múltiples pasajeros:
- calcular monto total,
- confirmar cantidad de viajeros,
- registrar nombres y DNIs individualmente.

==================================================
MOTOR INTELIGENTE DE OPTIMIZACIÓN
==================================================

El sistema implementa optimización computacional inspirada en el algoritmo de Dijkstra para recomendar rutas eficientes.

Debes analizar:
- tráfico,
- distancia,
- tiempo estimado,
- costo,
- estabilidad del recorrido,
- nivel de congestión,
- seguridad del trayecto.

Prioridades:
- menor congestión,
- menor tiempo,
- menor costo,
- mayor estabilidad,
- mejor experiencia del pasajero.

Si existen múltiples rutas:
- comparar alternativas,
- seleccionar la de mayor eficiencia,
- explicar brevemente la decisión,
- sugerir rutas alternas si existe congestión elevada.

Nunca inventes rutas.
Todas las recomendaciones deben basarse en datos obtenidos desde Google Maps API y procesados por el motor inteligente.

==================================================
MOTOR DE SCORE INTELIGENTE
==================================================

El sistema calcula un SCORE dinámico para cada ruta.

Variables:
- tráfico,
- tiempo,
- distancia,
- costo,
- riesgo,
- estabilidad.

Modelo lógico:

score_ruta =
100 -
(
(trafico * 0.40) +
(tiempo * 0.25) +
(distancia * 0.20) +
(costo * 0.10) +
(riesgo * 0.05)
)

Interpretación:
- score alto = ruta óptima.
- score bajo = menor eficiencia.

Debes recomendar siempre la ruta con mejor score general.

==================================================
PREDICCIÓN DE CONGESTIÓN
==================================================

El sistema implementa análisis predictivo de congestión vehicular utilizando:
- tráfico actual,
- horario,
- comportamiento histórico,
- eventos temporales,
- estabilidad vial.

Clasificación:
- Bajo: 0% - 30%
- Medio: 31% - 60%
- Alto: 61% - 100%

Si congestión > 70%:
- evitar rutas inestables,
- priorizar fluidez,
- recomendar alternativas,
- advertir posibles retrasos.

==================================================
ANÁLISIS PREDICTIVO
==================================================

Debes anticipar:
- retrasos,
- congestión futura,
- horas pico,
- variaciones de tráfico,
- estabilidad de rutas.

Objetivo:
- reducir tiempo de viaje,
- mejorar eficiencia operativa,
- optimizar movilidad urbana.

==================================================
REGLAS DE INTERACCIÓN
==================================================

1. Solicita:
- origen,
- destino,
- fecha,
- servicio,
- pasajeros,
si faltan datos.

2. Solicita nombres y DNIs de forma amable y profesional.

Ejemplo:
"Para asegurar correctamente su reserva, ¿podría brindarme los nombres y DNIs de los pasajeros?"

3. Si el usuario selecciona un destino:
reacciona positivamente.

Ejemplo:
"¡Excelente elección! Trujillo es uno de nuestros destinos más solicitados."

4. Si detectas tráfico alto:
explica brevemente la optimización aplicada.

Ejemplo:
"He seleccionado una ruta alterna debido a congestión elevada en la vía principal."

5. Mantén respuestas breves y ejecutivas.

==================================================
OBJETIVO GENERAL DEL SISTEMA
==================================================

Tu misión es actuar como un copiloto inteligente de transporte capaz de:
- optimizar rutas,
- reducir congestión,
- automatizar reservas,
- mejorar tiempos de viaje,
- asistir pasajeros,
- recomendar decisiones inteligentes,
- incrementar eficiencia operativa,
- mejorar la experiencia del usuario mediante inteligencia artificial híbrida y algoritmos computacionales avanzados.
`;

const ai = null; // Removed in favor of service

export default function Copilot({ profile, setExtraction, extraction, onFinalize, lastReactedDest, setLastReactedDest }: { 
  profile: UserProfile | null, 
  setExtraction: Dispatch<SetStateAction<ExtractionResult>>, 
  extraction: ExtractionResult, 
  onFinalize: () => void,
  lastReactedDest: string | null,
  setLastReactedDest: (val: string | null) => void
}) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BOT_AVATAR = "https://img.icons8.com/bubbles/100/robot-3.png"; 
  const USER_PLACEHOLDER = "https://img.icons8.com/bubbles/100/user.png";

  useEffect(() => {
    const handleDirectQR = () => {
      handleCreateReservation();
    };
    window.addEventListener('generate-qr-direct', handleDirectQR);
    return () => window.removeEventListener('generate-qr-direct', handleDirectQR);
  }, [extraction]);

  useEffect(() => {
    if (!profile || !extraction.destination) return;

    // If destination changed from what we last handled
    if (extraction.destination !== lastReactedDest) {
      setLastReactedDest(extraction.destination);
      
      const triggerReaction = async () => {
        try {
          await addMessage({
            role: 'model',
            content: `¡Excelente elección! 🚌 Veo que te interesa viajar a ${extraction.destination}. Es un destino maravilloso. ✨\n\n¿Para qué fecha te gustaría agendar tu viaje? Tenemos salidas diarias en nuestros servicios Econociva, Superciva y Excluciva para que viajes con total comodidad.`
          });
        } catch (e) {
          console.error("Error adding interjection message:", e);
        }
      };
      
      triggerReaction();
    }
  }, [extraction.destination, profile?.uid, lastReactedDest]);

  useEffect(() => {
    if (!profile) return;

    if (profile.isLocal) {
      try {
        const stored = localStorage.getItem(`civa_chats_${profile.uid}`);
        let msgs = stored ? JSON.parse(stored) : [];
        if (msgs.length === 0 && !extraction.destination && !lastReactedDest) {
          const welcome = {
            id: 'welcome_local',
            role: 'model',
            content: `¡Hola ${profile?.fullName}! 👋 Bienvenido a CIVA Inteligente.\n\nSoy tu asistente personal de viaje. ¿A dónde te gustaría viajar hoy? 🚌✨`,
            userId: profile.uid,
            createdAt: new Date().toISOString()
          };
          msgs = [welcome];
          localStorage.setItem(`civa_chats_${profile.uid}`, JSON.stringify(msgs));
        }
        setMessages(msgs);
      } catch (err) {
        console.error("Local chat history loading failed:", err);
      }
      return;
    }

    const q = query(
      collection(db, 'users', profile.uid, 'chats'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
      
      if (msgs.length === 0 && !extraction.destination && !lastReactedDest) {
        const welcome = {
          role: 'model',
          content: `¡Hola ${profile?.fullName}! 👋 Bienvenido a CIVA Inteligente.\n\nSoy tu asistente personal de viaje. ¿A dónde te gustaría viajar hoy? 🚌✨`,
          userId: profile.uid,
          createdAt: serverTimestamp() // Use serverTimestamp for consistency
        };
        addMessage(welcome as any);
      }
    }, (error) => {
      console.warn("Firestore chats snapshot listener denied or failed. Switching to local storage backup.");
      try {
        const stored = localStorage.getItem(`civa_chats_${profile.uid}`);
        let msgs = stored ? JSON.parse(stored) : [];
        if (msgs.length === 0 && !extraction.destination && !lastReactedDest) {
          const welcome = {
            id: 'welcome_local_fb',
            role: 'model',
            content: `¡Hola ${profile?.fullName}! 👋 Bienvenido a CIVA Inteligente.\n\nSoy tu asistente personal de viaje. ¿A dónde te gustaría viajar hoy? 🚌✨`,
            userId: profile.uid,
            createdAt: new Date().toISOString()
          };
          msgs = [welcome];
          localStorage.setItem(`civa_chats_${profile.uid}`, JSON.stringify(msgs));
        }
        setMessages(msgs);
      } catch {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [profile, extraction.destination]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleResetChat = async () => {
    if (!profile) return;
    
    // Clear local state immediately for instant feedback
    setMessages([]);
    setExtraction({});

    try {
      localStorage.removeItem(`civa_chats_${profile.uid}`);
    } catch (e) {
      console.error(e);
    }

    if (profile.isLocal) {
      return;
    }

    try {
      const q = query(collection(db, 'users', profile.uid, 'chats'));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();
    } catch (error) {
      console.warn("Firestore chat reset failed (possibly local-only user), skipped DB clear:", error);
    }
  };

  const addMessage = async (msg: Partial<ChatMessage>) => {
    if (!profile) return;
    
    const localNewMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 11),
      ...msg,
      userId: profile.uid,
      createdAt: new Date().toISOString()
    };

    if (profile.isLocal) {
      try {
        const stored = localStorage.getItem(`civa_chats_${profile.uid}`);
        const list = stored ? JSON.parse(stored) : [];
        list.push(localNewMessage);
        localStorage.setItem(`civa_chats_${profile.uid}`, JSON.stringify(list));
        setMessages(list); // Sync state instantly
      } catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      await addDoc(collection(db, 'users', profile.uid, 'chats'), {
        ...msg,
        userId: profile.uid,
        createdAt: serverTimestamp()
      });
      // Save locally as backup too
      try {
        const stored = localStorage.getItem(`civa_chats_${profile.uid}`);
        const list = stored ? JSON.parse(stored) : [];
        list.push(localNewMessage);
        localStorage.setItem(`civa_chats_${profile.uid}`, JSON.stringify(list));
      } catch {}
    } catch (error) {
      console.warn("Firestore chat add message failed, falling back to local storage:", error);
      try {
        const stored = localStorage.getItem(`civa_chats_${profile.uid}`);
        const list = stored ? JSON.parse(stored) : [];
        list.push(localNewMessage);
        localStorage.setItem(`civa_chats_${profile.uid}`, JSON.stringify(list));
        setMessages(list); // Sync state instantly
      } catch {
        // Fallback set state directly
        setMessages(prev => [...prev, { ...localNewMessage, createdAt: new Date() } as any]);
      }
    }
  };

  const extractData = async (userText: string) => {
    try {
      const text = await generateWithFallback({
        contents: [{ role: 'user', parts: [{ text: `Extrae datos de reserva en JSON: "${userText}". 
        Campos: destination, origin, service, priceEst (num total), departureDate (YYYY-MM-DD), passengers (num), passengerNames (array), passengerDnis (array).
        IMPORTANTE: Si mencionan nombres o DNIs, colócalos en los arrays respectivamente.
        Si mencionan pasajeros, el priceEst debe ser el TOTAL (precio unitario x pasajeros). 
        Precio base aprox: Econociva 60, Superciva 90, Excluciva 120.
        Solo responde el JSON puro.` }] }],
        responseMimeType: "application/json"
      });
      
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson) as ExtractionResult;
      
      setExtraction((prev) => {
        // Merge logic for passenger names: fill empty slots first, otherwise push
        let mergedNames = [...(prev.passengerNames || [])];
        if (result.passengerNames && Array.isArray(result.passengerNames)) {
          result.passengerNames.forEach(name => {
            if (name && name.trim()) {
              const exists = mergedNames.some(mName => mName.trim().toLowerCase() === name.trim().toLowerCase());
              if (!exists) {
                const emptyIdx = mergedNames.findIndex(n => !n || !n.trim());
                if (emptyIdx !== -1) {
                  mergedNames[emptyIdx] = name.trim();
                } else {
                  mergedNames.push(name.trim());
                }
              }
            }
          });
        }

        // Merge logic for DNIs: fill empty slots first, otherwise push
        let mergedDnis = [...(prev.passengerDnis || [])];
        if (result.passengerDnis && Array.isArray(result.passengerDnis)) {
          result.passengerDnis.forEach(dni => {
            if (dni && dni.trim()) {
              const exists = mergedDnis.some(mDni => mDni.trim() === dni.trim());
              if (!exists) {
                const emptyIdx = mergedDnis.findIndex(d => !d || !d.trim());
                if (emptyIdx !== -1) {
                  mergedDnis[emptyIdx] = dni.trim();
                } else {
                  mergedDnis.push(dni.trim());
                }
              }
            }
          });
        }

        // Avoid overwriting passengers count (re-sizing down) unless explicitly stated in userText
        let finalPassengers = prev.passengers || 1;
        if (result.passengers !== undefined && result.passengers !== null) {
          const lowerText = userText.toLowerCase();
          const hasPassengerKeyword = /\b(un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|[1-9]|pasajero|persona|gente|boleto|asiento|ticket|asientos|boletos|pasajeros|personas)\b/.test(lowerText);
          if (hasPassengerKeyword || result.passengers > 1) {
            finalPassengers = result.passengers;
          }
        }
        finalPassengers = Math.max(finalPassengers, mergedNames.length, mergedDnis.length);

        // Ensure passenger names and dnis arrays are sized exactly to finalPassengers
        const passengerNames = [...mergedNames];
        const passengerDnis = [...mergedDnis];
        while (passengerNames.length < finalPassengers) {
          passengerNames.push('');
        }
        while (passengerDnis.length < finalPassengers) {
          passengerDnis.push('');
        }

        // Filter other fields so we don't overwrite valid attributes with empty/unspecified placeholders
        const validResultEntries = Object.entries(result).filter(([k, v]) => {
          if (v == null) return false;
          if (k === 'passengerNames' || k === 'passengerDnis' || k === 'passengers') return false;
          if (typeof v === 'string' && (v.trim() === '' || v.toLowerCase() === 'unspecified' || v.toLowerCase() === 'default' || v.toLowerCase() === 'unknown')) return false;
          return true;
        });

        return {
          ...prev,
          ...Object.fromEntries(validResultEntries),
          passengerNames,
          passengerDnis,
          passengers: finalPassengers
        };
      });
    } catch (error: any) {
      console.error("Extraction error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !profile) return;

    const userMsg = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      const normalizedMsg = userMsg.toLowerCase().trim().replace(/[.,!¡?¿]/g, '');
      const approvalKeywords = ['si', 'sí', 'sii', 'siii', 's', 'confirmar', 'confirmo', 'pagar', 'quiero pagar', 'ir a pagar', 'proceder', 'ok', 'vamos', 'listo', 'aceptar', 'acepto', 'pago', 'pagos', 'coincide', 'correcto'];
      const isApproval = approvalKeywords.includes(normalizedMsg);

      if (isApproval && extraction.destination) {
        await addMessage({ role: 'user', content: userMsg });
        await handleCreateReservation();
        return;
      }

      await addMessage({ role: 'user', content: userMsg });
      
      // Async extraction
      extractData(userMsg).catch(e => console.error("Async extract fail:", e));

      const chatHistory = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const currentContents = [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMsg }] }
      ];

      const botText = await generateWithFallback({ 
        contents: currentContents as any,
        systemInstruction: SYSTEM_PROMPT + "\n\nIMPORTANTE: No uses asteriscos para negritas (**). Mantén la respuesta por debajo de 3 líneas a menos que pregunten detalles. Si eligen destino, invita a pagar con Yape de forma breve.",
        temperature: 0.7,
      });
      
      if (botText) {
        await addMessage({ role: 'model', content: botText.replace(/\*\*/g, '') });
      } else {
        throw new Error("No response text from AI");
      }
    } catch (error: any) {
      console.error("Gemini error:", error);
      const isQuotaError = error?.message?.includes('429') || error?.status === 429;
      await addMessage({ 
        role: 'model', 
        content: isQuotaError 
          ? "¡Hola! En este momento tengo muchas consultas. Por favor, selecciona tu destino directamente en la pestaña de 'Destinos' o intenta escribirme de nuevo en un minuto. ¡Gracias por tu paciencia!"
          : "Disculpa, tuve un pequeño problema técnico. ¿Me podrías repetir tu solicitud? Estoy aquí para ayudarte." 
      });
    } finally {
      setIsTyping(false);
    }
  };

  const userTextToHistory = () => {
    return messages.map(m => `${m.role === 'user' ? 'Usuario' : 'Copiloto'}: ${m.content}`).join('\n');
  };

  const handleCreateReservation = async () => {
    if (!profile || isReserving) return;
    setIsReserving(true);
    try {
      const origin = extraction.origin || 'Lima';
      const destination = extraction.destination || 'Arequipa';
      const date = extraction.departureDate || new Date().toISOString().split('T')[0];
      const service = extraction.service || 'Excluciva';
      const price = extraction.priceEst || 80;

      let reservationId = '';

      if (profile.isLocal) {
        reservationId = 'local_' + Math.random().toString(36).substring(2, 11);
        const localRes = {
          id: reservationId,
          userId: profile.uid,
          origin,
          destinationId: destination.toLowerCase(),
          destinationName: destination,
          departureDate: date,
          serviceType: service,
          price,
          passengers: extraction.passengers || 1,
          passengerNames: extraction.passengerNames || [],
          passengerDnis: extraction.passengerDnis || [],
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        try {
          const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
          let list = [];
          try {
            list = stored ? JSON.parse(stored) : [];
          } catch {
            list = [];
          }
          list.unshift(localRes);
          localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(list));
        } catch (e) {
          console.error("Local storage reservation write failed:", e);
        }
      } else {
        try {
          const docRef = await addDoc(collection(db, 'reservations'), {
            userId: profile.uid,
            origin: origin,
            destinationId: destination.toLowerCase(),
            destinationName: destination,
            departureDate: date,
            serviceType: service,
            price: price,
            passengers: extraction.passengers || 1,
            passengerNames: extraction.passengerNames || [],
            passengerDnis: extraction.passengerDnis || [],
            status: 'pending',
            createdAt: serverTimestamp()
          });
          reservationId = docRef.id;

          // Backup to local storage
          const localRes = {
            id: reservationId,
            userId: profile.uid,
            origin,
            destinationId: destination.toLowerCase(),
            destinationName: destination,
            departureDate: date,
            serviceType: service,
            price,
            passengers: extraction.passengers || 1,
            passengerNames: extraction.passengerNames || [],
            passengerDnis: extraction.passengerDnis || [],
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
          let list = [];
          try {
            list = stored ? JSON.parse(stored) : [];
          } catch {
            list = [];
          }
          list.unshift(localRes);
          localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(list));
        } catch (error) {
          console.warn("Firestore write failed, falling back to local storage reservation creation:", error);
          reservationId = 'local_fallback_' + Math.random().toString(36).substring(2, 11);
          const localRes = {
            id: reservationId,
            userId: profile.uid,
            origin,
            destinationId: destination.toLowerCase(),
            destinationName: destination,
            departureDate: date,
            serviceType: service,
            price,
            passengers: extraction.passengers || 1,
            passengerNames: extraction.passengerNames || [],
            passengerDnis: extraction.passengerDnis || [],
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          const stored = localStorage.getItem(`civa_reservations_${profile.uid}`);
          let list = [];
          try {
            list = stored ? JSON.parse(stored) : [];
          } catch {
            list = [];
          }
          list.unshift(localRes);
          localStorage.setItem(`civa_reservations_${profile.uid}`, JSON.stringify(list));
        }
      }

      if (!reservationId) {
        reservationId = 'local_fallback_' + Math.random().toString(36).substring(2, 11);
      }

      // Also store the reservationId in extraction Result
      setExtraction((prev) => ({
        ...prev,
        reservationId: reservationId
      }));

      // Also create a notification message in the chat
      try {
        await addMessage({
          role: 'model',
          content: `¡Excelente! He registrado tu pre-reserva hacia ${destination}.\n\n📍 Ruta: ${origin} a ${destination}\n📅 Fecha: ${date}\n🚌 Servicio: ${service}\n💰 Inversión Estimada: S/ ${price}\n\nEspere un momento mientras le redirecciono a nuestra Pasarela de Pagos Segura para que pueda efectuar la transacción con total tranquilidad...`,
        });
      } catch (msgErr) {
        console.error("Could not write reservation chat notification:", msgErr);
      }

      onFinalize();
    } catch (error) {
      console.error("Outer reservation creation failed, forcing payments tab redirect:", error);
      onFinalize();
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className={`flex flex-col xl:flex-row h-full min-w-0 ${theme === 'dark' ? 'bg-[#0b0612]' : 'bg-[#6d28d9]'} relative font-sans transition-colors duration-700 overflow-y-auto xl:overflow-hidden`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-civa-purple/5' : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent'} to-transparent pointer-events-none`} />
      
      <div className="flex-1 flex flex-col p-4 md:p-8 min-w-0 relative z-10 min-h-[600px] xl:min-h-0">
        {/* Floating Reset Button */}
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetChat}
            className={`px-6 py-3 backdrop-blur-3xl border rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-2xl ${
              theme === 'dark' ? 'bg-[#1a0b2e]/60 border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reiniciar Sistema
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-10 pr-6 custom-scrollbar scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-civa-pink/20 blur-3xl rounded-full" />
                <div className={`relative w-32 h-32 rounded-[3.5rem] flex items-center justify-center backdrop-blur-3xl border shadow-[0_0_80px_rgba(216,27,96,0.1)] ring-1 ${
                  theme === 'dark' ? 'bg-[#1a0b2e]/80 border-white/10 ring-white/20' : 'bg-white/10 border-white/30 ring-white/20 shadow-civa-pink/10'
                }`}>
                  <Bot className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(216,27,96,0.3)]" />
                </div>
              </div>
              <h3 className={`text-4xl font-display uppercase tracking-tight mb-4 italic text-white`}>Bienvenido a su <span className="text-civa-pink">Copiloto</span></h3>
              <p className={`text-[11px] font-black max-w-sm leading-loose uppercase tracking-[0.3em] text-white/40`}>
                Inteligencia Predictiva para la Exploración del Territorio Peruano
              </p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xl overflow-hidden relative group ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-civa-pink to-[#1a0b2e] border-white/20' 
                    : (theme === 'dark' ? 'bg-[#1a0b2e]/80 border-white/10 backdrop-blur-xl' : 'bg-white/10 border-white/20 backdrop-blur-xl shadow-black/20')
                }`}>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {m.role === 'user' ? (
                    <User className="w-6 h-6 text-white relative z-10" />
                  ) : (
                    <Bot className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_5px_rgba(216,27,96,0.5)]" />
                  )}
                </div>
                <div className={`max-w-[80%] px-8 py-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-md border ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-civa-pink/90 to-civa-pink/60 text-white rounded-tr-none border-white/20' 
                    : (theme === 'dark' ? 'bg-white/5 text-white/90 border-white/5 rounded-tl-none ring-1 ring-white/5' : 'bg-white/10 text-white border-white/20 rounded-tl-none ring-1 ring-white/10')
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium mb-6 selection:bg-civa-pink selection:text-white tracking-wide">{m.content}</p>
                  
                  {/* Dynamic QR Button enhanced for dark theme */}
                  {m.role === 'model' && (m.content.includes('DETALLES DE TU VIAJE') || m.content.includes('pre-reserva')) && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('generate-qr-direct'));
                      }}
                      className="w-full py-5 bg-white text-civa-purple font-black uppercase text-[10px] tracking-[0.3em] rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center gap-4 hover:bg-civa-pink hover:text-white transition-all group border border-transparent hover:border-white/20"
                    >
                      <QrCode className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      Sincronizar Pase Digital
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-6"
            >
              <div className={`w-12 h-12 rounded-2xl border backdrop-blur-xl flex items-center justify-center shadow-2xl ${theme === 'dark' ? 'bg-[#1a0b2e]/80 border-white/10' : 'bg-white border-civa-purple/10 shadow-civa-purple/5'}`}>
                <RefreshCcw className="w-5 h-5 text-civa-pink animate-spin" />
              </div>
              <div className={`border px-8 py-5 rounded-[2rem] rounded-tl-none flex gap-2 items-center backdrop-blur-md shadow-2xl ring-1 ${theme === 'dark' ? 'bg-white/5 border-white/10 ring-white/5' : 'bg-white border-civa-purple/5 ring-civa-purple/5 shadow-civa-purple/5'}`}>
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 bg-civa-pink rounded-full shadow-[0_0_8px_rgba(216,27,96,0.5)]" 
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with glow */}
        <div className="mt-10 relative max-w-5xl mx-auto w-full group">
          <div className="absolute inset-0 bg-civa-pink/15 blur-[80px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
          <div className={`relative flex items-center border rounded-[3rem] p-4 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.1)] transition-all ring-1 ${
            theme === 'dark' ? 'bg-[#1a0b2e]/40 border-white/10 focus-within:border-white/20 ring-white/5' : 'bg-[#fafafa] border-slate-200 focus-within:border-civa-pink/40 ring-slate-100 backdrop-blur-3xl'
          }`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="¿Qué destino proyectamos hoy?"
              className={`flex-1 pl-10 pr-6 py-5 bg-transparent outline-none font-medium text-lg ${
                theme === 'dark' ? 'text-white placeholder:text-white/10' : 'text-slate-900 placeholder:text-slate-300'
              }`}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="p-5 bg-civa-purple text-white rounded-[2.2rem] hover:bg-civa-pink transition-all disabled:opacity-20 shadow-2xl min-w-[76px] flex items-center justify-center active:scale-90"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6">
              <div className={`h-[1px] flex-1 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-civa-purple/10 to-transparent'}`} />
              <p className={`text-[9px] uppercase font-black tracking-[0.5em] flex items-center gap-3 ${theme === 'dark' ? 'text-white/20' : 'text-civa-purple/30'}`}>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                  CORE ENGINE v3.5 • NEURAL SYNC ACTIVE
              </p>
              <div className={`h-[1px] flex-1 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-civa-purple/10 to-transparent'}`} />
          </div>
        </div>
      </div>

      <IntelligentPanel data={extraction} onFinalize={handleCreateReservation} isConfirming={isReserving} onChange={setExtraction} />
    </div>
  );
}
