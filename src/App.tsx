/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import Login from './components/Login';
import Layout from './components/Layout';
import Copilot from './components/Copilot';
import Destinations from './components/Destinations';
import Reservations from './components/Reservations';
import ThesisMetrics from './components/ThesisMetrics';
import Payments from './components/Payments';
import TerminalMap from './components/TerminalMap';
import QRModal from './components/QRModal';
import { UserProfile, ExtractionResult, Reservation } from './types';
import { Loader2 } from 'lucide-react';
import Profile from './components/Profile';
import LibroReclamaciones from './components/LibroReclamaciones';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('civa_local_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('copilot');
  const [extraction, setExtraction] = useState<ExtractionResult>({});
  const [lastReactedDest, setLastReactedDest] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleDestinationSelect = (destination: string) => {
    setExtraction({ ...extraction, destination });
    setLastReactedDest(null); // Reset to allow reaction for the NEW selection
    setCurrentTab('copilot');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            if (!data.role) {
              data.role = (data.email === 'admin@civa.pe' || data.email?.startsWith('admin@')) ? 'admin' : 'client';
              await setDoc(userDocRef, { role: data.role }, { merge: true });
            }
            setProfile(data);
          } else {
            // Create profile if it doesn't exist (e.g. first login)
            const newRole = (firebaseUser.email === 'admin@civa.pe' || firebaseUser.email?.startsWith('admin@')) ? 'admin' : 'client';
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'Usuario CIVA',
              email: firebaseUser.email || '',
              createdAt: new Date().toISOString(),
              role: newRole,
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-civa-purple font-sans relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,transparent_70%)]" />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative z-10"
        >
           <img 
            src="https://ais-pre-3j6gcypzjr257hkbdfrzzu-694702629373.us-east1.run.app/assets/logo.png" 
            alt="CIVA" 
            className="h-16 brightness-0 invert filter grayscale brightness-[5] mb-8" 
          />
        </motion.div>
        <div className="flex gap-2">
           <div className="w-2 h-2 bg-civa-pink rounded-full animate-bounce [animation-delay:-0.3s]" />
           <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
           <div className="w-2 h-2 bg-civa-pink rounded-full animate-bounce" />
         </div>
      </div>
    );
  }

  const activeProfile = profile || localProfile;
  const isAuthenticated = !!user || !!localProfile;

  if (!isAuthenticated) {
    return <Login onLocalLogin={(prof: UserProfile) => {
      setLocalProfile(prof);
      localStorage.setItem('civa_local_profile', JSON.stringify(prof));
    }} />;
  }

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab} profile={activeProfile}>
      {currentTab === 'copilot' && (
        <Copilot 
          profile={activeProfile} 
          setExtraction={setExtraction} 
          extraction={extraction} 
          lastReactedDest={lastReactedDest}
          setLastReactedDest={setLastReactedDest}
          onFinalize={() => setCurrentTab('payments')} 
        />
      )}
      {currentTab === 'destinations' && <Destinations onSelect={handleDestinationSelect} />}
      {currentTab === 'terminals' && <TerminalMap />}
      {currentTab === 'reservations' && <Reservations profile={activeProfile} onViewQR={(res) => setSelectedReservation(res)} />}
      {currentTab === 'metrics' && <ThesisMetrics />}
      {currentTab === 'payments' && (
        <Payments 
          extraction={extraction} 
          profile={activeProfile} 
          onPay={() => setCurrentTab('reservations')} 
          onGotoProfile={() => setCurrentTab('profile')}
        />
      )}
      {currentTab === 'profile' && <Profile profile={activeProfile} />}
      {currentTab === 'reclamaciones' && <LibroReclamaciones profile={activeProfile} />}
      
      {selectedReservation && <QRModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />}
    </Layout>
  );
}

