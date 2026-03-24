"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, Sparkles, Crown, ShieldCheck, Users } from 'lucide-react';

export default function PsicologoPlanPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("gratis");
  const [loading, setLoading] = useState(true);
  
  const [billingCycle, setBillingCycle] = useState('mensual');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
          if (data) setCurrentPlan(data.plan || 'gratis');
        }
      } catch (error) {
        console.error("Error al obtener el plan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const getPrice = () => {
    switch (billingCycle) {
      case 'mensual': return { total: 299, perMonth: 299, save: 0 };
      case 'trimestral': return { total: 799, perMonth: 266, save: 11 }; 
      case 'semestral': return { total: 1499, perMonth: 249, save: 16 }; 
      case 'anual': return { total: 2499, perMonth: 208, save: 30 }; 
      default: return { total: 299, perMonth: 299, save: 0 };
    }
  };

  const { total, perMonth, save } = getPrice();

  const handleUpgradeClick = () => {
    router.push(`/psicologo/settings/plan/checkout?cycle=${billingCycle}&amount=${total}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
       <div className="w-12 h-12 border-4 border-[#6C72F1]/30 border-t-[#6C72F1] rounded-full animate-spin mb-4"></div>
       <p className="text-[#1E293B] font-extrabold text-[15px]">Cargando información de tu plan...</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-16 px-4 sm:px-6 lg:px-8 mt-4">
      
      {/* HEADER HERO ESTILO GLASSMORPHISM */}
      <div className="bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white text-center mb-12 relative overflow-hidden flex flex-col items-center">
        
        {/* Decoraciones de fondo */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#6C72F1] opacity-[0.04] rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#3EAFA8] opacity-[0.04] rounded-full blur-[40px] pointer-events-none"></div>

        <div className="w-20 h-20 bg-[#EEF0FF] rounded-[24px] flex items-center justify-center shadow-sm border border-white mb-6 relative z-10">
           <Users className="w-10 h-10 text-[#6C72F1]" strokeWidth={2.5} />
        </div>
        
        <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#333333] mb-3 tracking-tight z-10 leading-tight">
          Potencia tu práctica clínica
        </h2>
        <p className="text-[#8A95A5] text-[16px] md:text-[18px] max-w-2xl mx-auto font-medium z-10 leading-relaxed">
          Expande tu agenda sin límites y obtén herramientas avanzadas para dar un mejor seguimiento a la evolución de tus pacientes.
        </p>
      </div>

      {/* SELECTOR DE CICLO DE FACTURACIÓN */}
      <div className="flex justify-center mb-12 relative z-20">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-[24px] border border-white shadow-sm flex flex-wrap justify-center gap-1 md:gap-2">
          <button 
            onClick={() => setBillingCycle('mensual')} 
            className={`px-5 md:px-6 py-3 text-[13px] md:text-[14px] font-extrabold rounded-[20px] transition-all flex items-center justify-center ${billingCycle === 'mensual' ? 'bg-[#6C72F1] text-white shadow-md' : 'text-[#8A95A5] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
          >
            1 Mes
          </button>
          <button 
            onClick={() => setBillingCycle('trimestral')} 
            className={`px-5 md:px-6 py-3 text-[13px] md:text-[14px] font-extrabold rounded-[20px] transition-all flex items-center justify-center ${billingCycle === 'trimestral' ? 'bg-[#6C72F1] text-white shadow-md' : 'text-[#8A95A5] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
          >
            3 Meses
          </button>
          <button 
            onClick={() => setBillingCycle('semestral')} 
            className={`px-5 md:px-6 py-3 text-[13px] md:text-[14px] font-extrabold rounded-[20px] transition-all flex items-center justify-center gap-2 ${billingCycle === 'semestral' ? 'bg-[#6C72F1] text-white shadow-md' : 'text-[#8A95A5] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
          >
            6 Meses 
            <span className={`text-[9px] px-2 py-1 rounded-[8px] uppercase tracking-wider ${billingCycle === 'semestral' ? 'bg-white/20 text-white' : 'bg-[#EEF0FF] text-[#6C72F1]'}`}>
              -16%
            </span>
          </button>
          <button 
            onClick={() => setBillingCycle('anual')} 
            className={`px-5 md:px-6 py-3 text-[13px] md:text-[14px] font-extrabold rounded-[20px] transition-all flex items-center justify-center gap-2 ${billingCycle === 'anual' ? 'bg-[#6C72F1] text-white shadow-md' : 'text-[#8A95A5] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
          >
            Anual 
            <span className={`text-[9px] px-2 py-1 rounded-[8px] uppercase tracking-wider ${billingCycle === 'anual' ? 'bg-white/20 text-white' : 'bg-[#F0FDFA] text-[#0F766E]'}`}>
              -30%
            </span>
          </button>
        </div>
      </div>

      {/* TARJETAS DE PLANES (Alineadas y centradas) */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
        
        {/* ======================================================== */}
        {/* PLAN BÁSICO (GRATIS) */}
        {/* ======================================================== */}
        <div className={`bg-white/60 backdrop-blur-xl rounded-[40px] p-8 md:p-10 border border-white flex flex-col w-full md:w-1/2 transition-all ${currentPlan === 'gratis' ? 'shadow-md scale-[1.02] ring-2 ring-[#6C72F1]/10' : 'shadow-sm opacity-90'}`}>
          <div className="mb-8">
            <h3 className="text-[22px] font-extrabold text-[#333333] mb-2">Plan Básico</h3>
            <p className="text-[#8A95A5] text-[14px] font-medium h-10 leading-relaxed">Perfecto para conocer la plataforma y gestionar tus primeros casos.</p>
          </div>
          
          <div className="mb-8 bg-white/50 p-6 rounded-[24px] border border-white shadow-inner flex items-baseline gap-1">
            <span className="text-[48px] font-black text-[#333333] leading-none tracking-tight">$0</span>
            <span className="text-[#8A95A5] font-bold text-[14px] uppercase tracking-widest">MXN / Siempre</span>
          </div>

          <div className="space-y-5 mb-10 flex-1">
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#E5F7F4] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#3EAFA8]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed"><b className="text-[#333333] font-extrabold">Límite de 5 pacientes</b> vinculados</p>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#E5F7F4] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#3EAFA8]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed">Visualización de estado de ánimo diario</p>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#E5F7F4] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#3EAFA8]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed">Monitoreo de tareas en tiempo real</p>
            </div>
            
            <div className="flex gap-4 items-start opacity-40">
              <div className="w-6 h-6 rounded-full bg-[#F8FAFC] flex items-center justify-center flex-shrink-0 border border-white mt-0.5">
                <XCircle className="w-4 h-4 text-[#94A3B8]" strokeWidth={2.5} />
              </div>
              <p className="text-[14px] text-[#94A3B8] font-medium line-through decoration-1">Pacientes ilimitados</p>
            </div>
            
            <div className="flex gap-4 items-start opacity-40">
              <div className="w-6 h-6 rounded-full bg-[#F8FAFC] flex items-center justify-center flex-shrink-0 border border-white mt-0.5">
                <XCircle className="w-4 h-4 text-[#94A3B8]" strokeWidth={2.5} />
              </div>
              <p className="text-[14px] text-[#94A3B8] font-medium line-through decoration-1">Perfil destacado en directorio</p>
            </div>
          </div>

          <button disabled className={`w-full py-4 rounded-[20px] font-extrabold text-[13px] uppercase tracking-wider transition-colors mt-auto ${currentPlan === 'gratis' ? 'bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]' : 'bg-[#F1F5F9] text-[#CBD5E1]'}`}>
            {currentPlan === 'gratis' ? 'Tu plan actual' : 'Plan básico'}
          </button>
        </div>

        {/* ======================================================== */}
        {/* PLAN PROFESIONAL (Luminoso, borde índigo sutil) */}
        {/* ======================================================== */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[40px] p-8 md:p-10 border-[3px] border-[#6C72F1]/30 shadow-[0_10px_40px_rgba(108,114,241,0.15)] relative flex flex-col w-full md:w-1/2 transform md:-translate-y-4">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#EEF0FF] to-white border border-[#6C72F1]/50 text-[#6C72F1] text-[10px] font-black uppercase tracking-[0.2em] py-1.5 px-5 rounded-[12px] flex items-center gap-1.5 shadow-sm">
            <Crown className="w-3.5 h-3.5" strokeWidth={2.5} /> Profesional
          </div>

          <div className="mb-8 mt-2">
            <h3 className="text-[24px] font-extrabold text-[#333333] mb-2 flex items-center gap-2">
              Nabi Pro <Sparkles className="w-6 h-6 text-[#6C72F1]" strokeWidth={2.5} fill="#EEF0FF" />
            </h3>
            <p className="text-[#8A95A5] text-[14px] font-medium h-10 leading-relaxed">Agenda abierta y herramientas para profesionales que buscan crecer.</p>
          </div>
          
          <div className="mb-8 p-6 bg-gradient-to-br from-[#EEF0FF]/50 to-white rounded-[24px] border border-white shadow-sm flex flex-col justify-center min-h-[104px]">
            <div className="flex items-end gap-1.5 mb-1.5">
              <span className="text-[48px] font-black text-[#6C72F1] leading-none tracking-tight">${total}</span>
              <span className="text-[#5C61E1] font-bold text-[14px] pb-1.5 uppercase tracking-widest">
                 MXN / {billingCycle === 'mensual' ? 'MES' : billingCycle === 'trimestral' ? '3 MESES' : billingCycle === 'semestral' ? '6 MESES' : 'AÑO'}
              </span>
            </div>
            
            {save > 0 ? (
              <p className="text-[12px] text-[#6C72F1] font-bold bg-[#EEF0FF] w-fit px-2 py-0.5 rounded-md border border-white">
                Equivale a ${perMonth} / mes (Ahorras {save}%)
              </p>
            ) : (
              <p className="text-[12px] text-transparent select-none">Espacio</p>
            )}
          </div>

          <div className="space-y-5 mb-10 flex-1">
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C72F1]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed">Todo lo del plan Básico</p>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <Users className="w-4 h-4 text-[#6C72F1]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#333333] font-extrabold leading-relaxed">Agenda de pacientes ILIMITADA</p>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C72F1]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed">Insignia de Profesional Verificado</p>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C72F1]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed">Soporte prioritario 24/7</p>
            </div>
            
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-white shadow-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C72F1]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#475569] font-medium leading-relaxed">Acceso a futuras herramientas clínicas</p>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleUpgradeClick}
              className="w-full py-4 bg-[#6C72F1] hover:bg-[#5C61E1] text-white rounded-[20px] font-extrabold text-[13px] uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {currentPlan === 'premium' ? 'Administrar Suscripción' : 'Adquirir Plan Profesional'}
            </button>
            
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[#8A95A5]">
               <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Pago 100% Seguro</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}