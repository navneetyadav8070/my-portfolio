import { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

// Direct contact ke liye floating buttons — WhatsApp aur Call.
// Left side par rakhe hain kyunki right side pehle se busy hai:
// AIAssistant (bottom-5 right-5, z-50) aur ScrollToTop (bottom-24 right-5, z-40).
const PHONE = '+918826999747';
const WHATSAPP_NUMBER = '918826999747'; // wa.me ko number bina '+' aur space ke chahiye
const WHATSAPP_MESSAGE = "Hi Navneet! I saw your portfolio and I'd like to discuss a project.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const FloatingContact = () => {
  const [mounted, setMounted] = useState(false);

  // Thoda delay — page khulte hi ye buttons hero content se dhyaan na kheenche,
  // halke se fade + slide karke aate hain.
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 flex flex-col items-start gap-3 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* ---------- WhatsApp ---------- */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-transform outline-none"
      >
        {/* Pulse ring — sirf dikhne ke liye, isliye click block na kare */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />
        <FaWhatsapp className="relative text-2xl sm:text-[26px]" />
        {/* Tooltip sirf bade screens par (mobile par hover hota hi nahi) */}
        <span className="hidden sm:block absolute left-full ml-3 whitespace-nowrap px-3 py-1.5 rounded-lg bg-dark-card text-white text-xs border border-white/10 shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>

      {/* ---------- Call ---------- */}
      <a
        href={`tel:${PHONE}`}
        aria-label={`Call ${PHONE}`}
        title={`Call ${PHONE}`}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-accent to-green-400 text-dark flex items-center justify-center shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-transform outline-none"
      >
        <FaPhoneAlt className="relative text-lg sm:text-xl" />
        <span className="hidden sm:block absolute left-full ml-3 whitespace-nowrap px-3 py-1.5 rounded-lg bg-dark-card text-white text-xs border border-white/10 shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          Call Now
        </span>
      </a>
    </div>
  );
};

export default FloatingContact;
