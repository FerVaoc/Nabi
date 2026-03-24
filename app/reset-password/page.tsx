"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Supabase sabe quién es el usuario gracias al link seguro del correo
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      alert("¡Tu contraseña ha sido actualizada con éxito!");
      router.push("/login"); // Lo mandamos a iniciar sesión con su nueva clave
      
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Hubo un error al actualizar la contraseña. Es posible que el enlace haya expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3E7FC] via-[#E2F4EE] to-[#FDF3E9] p-6 relative overflow-hidden font-sans">
      
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
          Nueva contraseña
        </h1>
        <p className="text-[#8A95A5] mb-8 font-medium text-[15px] text-center leading-relaxed">
          Ingresa tu nueva clave de acceso. Asegúrate de guardarla en un lugar seguro.
        </p>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="w-full mb-8 bg-[#FEF2F2]/90 backdrop-blur-sm border border-[#FECACA] p-4 rounded-[20px] flex items-start gap-3 shadow-sm animate-in fade-in zoom-in-95">
             <ShieldCheck className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
             <p className="text-[#B91C1C] text-[13px] font-bold leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="w-full space-y-6">
          
          <div>
            <label className="block text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 pl-2">Nueva contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#8A95A5]" strokeWidth={2.5} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-14 pr-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all placeholder:font-medium placeholder:text-[#CBD5E1] shadow-inner text-[15px]" 
                required 
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 pl-2">Confirmar contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#8A95A5]" strokeWidth={2.5} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full pl-14 pr-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all placeholder:font-medium placeholder:text-[#CBD5E1] shadow-inner text-[15px]" 
                required 
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 rounded-[24px] bg-[#6C72F1] hover:bg-[#5C61E1] text-white font-extrabold text-[14px] uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                "Guardar contraseña"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 w-full text-center">
           <Link href="/login" className="text-[11px] font-extrabold text-[#8A95A5] hover:text-[#6C72F1] transition-colors uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-white shadow-sm">
             Volver al inicio de sesión
           </Link>
        </div>

      </div>
    </main>
  );
}