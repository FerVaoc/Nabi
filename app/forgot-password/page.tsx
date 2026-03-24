"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Le decimos a Supabase a dónde mandarlo cuando le dé clic al correo
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage("Te hemos enviado un correo con un enlace para recuperar tu contraseña. Por favor, revisa tu bandeja de entrada (y spam).");
      setEmail(""); // Limpiamos el campo
    } catch (error: any) {
      console.error(error);
      setErrorMsg("No pudimos enviar el correo. Verifica que la dirección sea correcta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E7FC] via-[#E2F4EE] to-[#FDF3E9] p-6 relative overflow-hidden font-sans">
      
      {/* Botón Volver (Estilo Pastilla Flotante) */}
      <Link href="/login" className="absolute top-6 left-6 sm:top-10 sm:left-10 inline-flex items-center text-[12px] font-extrabold uppercase tracking-wider text-[#8A95A5] hover:text-[#6C72F1] transition-colors gap-2 z-30 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-white">
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Volver al login
      </Link>

      {/* Decoración de fondo (Glassmorphism blobs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#6C72F1] opacity-[0.05] rounded-full blur-[60px]"></div>
         <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#3EAFA8] opacity-[0.05] rounded-full blur-[60px]"></div>
      </div>

      <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-xl rounded-[40px] p-10 md:p-14 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo Centrado */}
        <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm border border-[#E2E8F0] flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Nabi Logo" className="w-12 h-12 object-contain hover:scale-105 transition-transform" />
        </div>

        <h1 className="text-[32px] font-extrabold text-[#333333] mb-2 tracking-tight leading-tight text-center">
          Recuperar acceso
        </h1>
        <p className="text-[#8A95A5] mb-10 font-medium text-[15px] text-center leading-relaxed">
          Ingresa el correo asociado a tu cuenta y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>

        {/* Mensaje de Éxito */}
        {message && (
          <div className="w-full mb-8 bg-[#F0FDF4]/90 backdrop-blur-sm border border-[#BBF7D0] p-4 rounded-[20px] flex items-start gap-3 shadow-sm animate-in fade-in zoom-in-95">
             <CheckCircle2 className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
             <p className="text-[#166534] text-[13px] font-bold leading-relaxed">{message}</p>
          </div>
        )}

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="w-full mb-8 bg-[#FEF2F2]/90 backdrop-blur-sm border border-[#FECACA] p-4 rounded-[20px] flex items-start gap-3 shadow-sm animate-in fade-in zoom-in-95">
             <ShieldCheck className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
             <p className="text-[#B91C1C] text-[13px] font-bold leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleResetRequest} className="w-full space-y-6">
          
          <div>
            <label className="block text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 pl-2">Correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#8A95A5]" strokeWidth={2.5} />
              </div>
              <input 
                type="email" 
                placeholder="correo@ejemplo.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-14 pr-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all placeholder:font-medium placeholder:text-[#CBD5E1] shadow-inner text-[15px]" 
                required 
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading || !!message} 
              className="w-full py-4 rounded-[24px] bg-[#6C72F1] hover:bg-[#5C61E1] text-white font-extrabold text-[14px] uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                "Enviar enlace"
              )}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}