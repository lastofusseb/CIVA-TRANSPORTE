import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ChatMessage, ExtractionResult } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Send, Bot, User, Sparkles, QrCode, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IntelligentPanel from './IntelligentPanel';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Eres el Copiloto Inteligente de CIVA, una empresa líder en transporte terrestre en Perú.
Tu objetivo es ayudar a los usuarios a planificar sus viajes de forma rápida y amable. 
Eres el Copiloto de CIVA, rápido y eficiente.

Servicios Civap: Excluciva (Lujo 180°), Superciva (Premium 140/160°), Econociva (Económico).

REGLAS DE NEGOCIO:
1. Temporada Alta (Semana Santa, Fiestas Patrias 25-31 Jul, Navidad): Precios suben x1.8 a x3.0.
2. Política Niños: Mayores de 5 pagan completo. Menores de 5 viajan gratis en falda (1 por adulto).
3. Equipaje: 20-30kg gratis en bodega. Exceso S/ 2.50 por kg.
4. Métodos Pago: Visa, Mastercard, PagoEfectivo, Amex, Diners Club, Yape, UnionPay.

REGLAS DE INTERACCIÓN:
1. Sé MUY BREVE. La velocidad es prioridad.
2. Si el usuario elige un destino, confírmalo y menciona los servicios (Excluciva, Superciva, Econociva).
3. Usa un tono peruano profesional y cercano.
4. NUNCA uses asteriscos (**). No los uses para resaltar nada.
5. Si el usuario ya eligió destino (vía Explora Perú), NO preguntes de nuevo. Ve directo a la fecha.
`;

export default function Copilot({ profile, setExtraction, extraction, onFinalize, lastReactedDest, setLastReactedDest }: { 
  profile: UserProfile | null, 
  setExtraction: (res: ExtractionResult) => void, 
  extraction: ExtractionResult, 
  onFinalize: () => void,
  lastReactedDest: string | null,
  setLastReactedDest: (val: string | null) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
    });

    return () => unsubscribe();
  }, [profile, extraction.destination]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleResetChat = async () => {
    if (!profile) return;
    try {
      // Clear local state immediately for instant feedback
      setMessages([]);
      setExtraction({});

      const q = query(collection(db, 'users', profile.uid, 'chats'));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error resetting chat:", error);
    }
  };

  const addMessage = async (msg: Partial<ChatMessage>) => {
    if (!profile) return;
    try {
      await addDoc(collection(db, 'users', profile.uid, 'chats'), {
        ...msg,
        userId: profile.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${profile.uid}/chats`);
    }
  };

  const extractData = async (userText: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extrae datos de reserva en JSON: "${userText}". 
        Campos: destination, origin, service, priceEst (num), departureDate (YYYY-MM-DD).
        Solo responde el JSON puro.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson) as ExtractionResult;
      
      setExtraction({
        ...extraction,
        ...Object.fromEntries(Object.entries(result).filter(([_, v]) => v != null))
      });
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes('429')) {
        console.warn("AI Quota Exceeded - extraction ignored");
      }
      console.error("Extraction error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !profile) return;

    const userMsg = input.trim();
    setInput('');
    setIsTyping(true);

    try {
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

      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: currentContents as any,
        config: {
          systemInstruction: SYSTEM_PROMPT + "\n\nIMPORTANTE: No uses asteriscos para negritas (**). Mantén la respuesta por debajo de 3 líneas a menos que pregunten detalles. Si eligen destino, invita a pagar con Yape de forma breve.",
          temperature: 0.7,
        }
      });
      
      const botText = response.text;
      if (botText) {
        await addMessage({ role: 'model', content: botText.replace(/\*\*/g, '') });
      } else {
        throw new Error("No response text from Gemini");
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
    if (!profile) return;
    try {
      const origin = extraction.origin || 'Lima';
      const destination = extraction.destination || 'Arequipa';
      const date = extraction.departureDate || new Date().toISOString().split('T')[0];
      const service = extraction.service || 'Excluciva';
      const price = extraction.priceEst || 80;

      await addDoc(collection(db, 'reservations'), {
        userId: profile.uid,
        origin: origin,
        destinationId: destination.toLowerCase(),
        destinationName: destination,
        departureDate: date,
        serviceType: service,
        price: price,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      // Also create a notification message in the chat
      await addMessage({
        role: 'model',
        content: `¡Excelente! He procesado tu reserva. \n\n📍 Ruta: ${origin} a ${destination}\n📅 Fecha: ${date}\n🚌 Servicio: ${service}\n💰 Precio: S/ ${price}\n\nPuedes encontrar tu código QR en la pestaña de 'Mis Reservas'. ¡Buen viaje!`,
      });

      onFinalize();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reservations');
    }
  };

  return (
    <div className="flex h-full min-w-0 bg-[#f8f7ff] relative">
      <div className="absolute inset-0 civa-bg-pattern pointer-events-none opacity-[0.03]" />
      <div className="flex-1 flex flex-col p-8 min-w-0 relative z-10">
        {/* Floating Reset Button */}
        <div className="absolute top-8 right-12 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetChat}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2 hover:text-civa-pink transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            Limpiar Chat
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-xl border-2 ${m.role === 'user' ? 'bg-civa-purple border-white/20' : 'bg-white border-slate-100'}`}>
                  {m.role === 'user' ? (
                    <img src={USER_PLACEHOLDER} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <img src={BOT_AVATAR} alt="Bot" className="w-full h-full object-contain p-2" />
                  )}
                </div>
                <div className={`max-w-[85%] px-7 py-5 rounded-[2rem] shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-civa-purple text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium mb-4">{m.content}</p>
                  
                  {/* Dynamic QR Button */}
                  {m.role === 'model' && (m.content.includes('DETALLES DE TU VIAJE') || m.content.includes('pre-reserva')) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('generate-qr-direct'));
                      }}
                      className="w-full py-3 bg-gradient-to-r from-civa-pink to-civa-purple text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4 text-white" />
                      Generar Código QR de Embarque
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-xl">
                <img src={BOT_AVATAR} alt="Bot" className="w-full h-full object-contain p-2" />
              </div>
              <div className="bg-white border border-slate-100 px-6 py-4 rounded-[2rem] rounded-tl-none flex gap-1 items-center shadow-lg">
                <div className="w-2 h-2 bg-civa-pink rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-civa-purple rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-civa-pink rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-8 relative max-w-4xl mx-auto w-full">
          <div className="absolute inset-0 bg-civa-purple/5 blur-xl rounded-full" />
          <div className="relative flex items-center bg-white border border-slate-200 rounded-[2rem] p-2 shadow-xl shadow-slate-200/40">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 pl-6 pr-4 py-4 bg-transparent focus:outline-none text-slate-900 font-medium placeholder:text-slate-300"
            />
            <button
              onClick={handleSend}
              disabled={isTyping}
              className="p-4 bg-civa-purple text-white rounded-[1.5rem] hover:bg-civa-dark transition-all disabled:opacity-50 shadow-lg shadow-civa-purple/20 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-center text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">
              SISTEMA CIVA AI v2.5 • PROCESAMIENTO G3 PREVIEW
          </p>
        </div>
      </div>

      <IntelligentPanel data={extraction} onFinalize={handleCreateReservation} />
    </div>
  );
}
