import React from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  Book, 
  MessageCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenLibro: () => void;
}

export default function Footer({ onOpenLibro }: FooterProps) {
  const { theme } = useTheme();
  
  const handleWhatsApp = () => {
    // Official Civa WhatsApp Help Channel Link
    window.open('https://api.whatsapp.com/send?phone=51989201911&text=Hola%20CIVA,%20solicito%20asistencia%20personalizada.', '_blank');
  };

  return (
    <footer className={`relative overflow-hidden pt-16 pb-8 transition-colors duration-700 ${theme === 'dark' ? 'bg-[#1a0b3e]' : 'bg-[#2d1b4d]'} border-t border-white/10`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Social */}
          <div className="space-y-6">
            <img 
              src="https://www.civa.com.pe/assets/img/logo_civa.png" 
              alt="CIVA" 
              className="h-10 brightness-0 invert" 
            />
            <div className="space-y-4">
              <p className="text-white text-sm font-bold">Llámanos: 418 1111</p>
              <div className="space-y-2">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Encuéntranos en</p>
                <div className="flex gap-4">
                  <a href="#" className="text-white/60 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-black uppercase tracking-widest">¿Tienes dudas?</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink label="Términos y condiciones" />
              <FooterLink label="Políticas de privacidad" />
              <FooterLink label="Política de seguridad vial" />
            </nav>
          </div>

          {/* Links 2 */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-black uppercase tracking-widest">Soporte y ayuda</h4>
            <nav className="flex flex-col gap-3">
              <button 
                onClick={onOpenLibro}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-xs font-bold text-left group"
              >
                Libro de reclamaciones <Book className="w-3.5 h-3.5" />
              </button>
              <FooterLink label="Comprobantes electrónicos" />
              <FooterLink label="Trabaja con nosotros" />
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-black uppercase tracking-widest">Información de contacto</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-white text-[11px] font-bold">EconoCiva, SuperCiva</p>
                <p className="text-white/60 text-[10px]">Av. Paseo de la República Nro. 569 La Victoria</p>
              </div>
              <div className="space-y-1">
                <p className="text-white text-[11px] font-bold">ExcluCiva</p>
                <p className="text-white/60 text-[10px]">Av. Javier Prado Este Nro 1155 La Victoria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[10px] font-medium text-white/40">
            <span>Civa 2026 - Todos los derechos reservados ©</span>
            <span className="hidden md:block">|</span>
            <span>Powered by <span className="text-white/60 font-bold">kupos.pe</span></span>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-6 md:gap-8">
            <img src="https://logodownload.org/wp-content/uploads/2016/10/visa-logo-1.png" alt="Visa" className="h-3 brightness-0 invert opacity-60" />
            <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" alt="Mastercard" className="h-5 brightness-0 invert opacity-60" />
            <img src="https://static.wixstatic.com/media/2cd43b_40cf35a4d467439da1259e87515e453c~mv2.png/v1/fill/w_320,h_102,al_c,q_85,usm_0.66_1.00_0.01/pago-efectivo-logo-png.webp" alt="PagoEfectivo" className="h-4 brightness-0 invert opacity-60" />
            <img src="https://logodownload.org/wp-content/uploads/2015/05/american-express-logo-0.png" alt="Amex" className="h-4 brightness-0 invert opacity-60" />
            <img src="https://iconape.com/wp-content/png_logo_vector/diners-club-international-1.png" alt="Diners" className="h-4 brightness-0 invert opacity-60" />
            <img src="https://vignette.wikia.nocookie.net/logopedia/images/b/b5/Yape_BCP_logo.png/revision/latest?cb=20180424164103" alt="Yape" className="h-5 brightness-0 invert opacity-60" />
            <img src="https://logodownload.org/wp-content/uploads/2019/12/unionpay-logo.png" alt="UnionPay" className="h-4 brightness-0 invert opacity-60" />
            
            <button 
              onClick={handleWhatsApp}
              className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform ml-4"
            >
              <MessageCircle className="w-6 h-6 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button - Reduced prominence as it's now in footer bar too */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 group md:hidden"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </motion.button>
    </footer>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-white/60 hover:text-white transition-colors text-xs font-bold font-sans tracking-tight">
      {label}
    </a>
  );
}
