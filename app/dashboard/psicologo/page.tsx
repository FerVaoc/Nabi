"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link2, ShieldCheck, CheckCircle2, Flame, BarChart3, Smile, Activity, ShieldAlert, ArrowRight, UserX, UserCheck } from 'lucide-react';

export default function PsicologoPage() {
  const [isLinked, setIsLinked] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [psychologistName, setPsychologistName] = useState('');
  const [psychologistId, setPsychologistId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState(''); 

  // Estados REALES para los switches de privacidad
  const [shareTasks, setShareTasks] = useState(true);
  const [shareStreak, setShareStreak] = useState(true);
  const [shareSurveys, setShareSurveys] = useState(true);
  const [shareEmotion, setShareEmotion] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('psychologist_id, share_tasks, share_streak, share_surveys, share_emotion, full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setPatientName(profile.full_name || 'Un paciente');
          
          if (profile.share_tasks !== null) setShareTasks(profile.share_tasks);
          if (profile.share_streak !== null) setShareStreak(profile.share_streak);
          if (profile.share_surveys !== null) setShareSurveys(profile.share_surveys);
          if (profile.share_emotion !== null) setShareEmotion(profile.share_emotion);

          if (profile.psychologist_id) {
            setPsychologistId(profile.psychologist_id);
            const { data: docProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', profile.psychologist_id)
              .single();

            if (docProfile) {
              setPsychologistName(docProfile.full_name);
              setIsLinked(true);
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar estado:", error);
      }
    };
    checkStatus();
  }, []);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (linkCode.trim() === '' || !userId) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: doc, error: searchError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('link_code', linkCode.toUpperCase())
        .eq('role', 'psicologo')
        .single();

      if (searchError || !doc) {
        throw new Error("Código no válido o psicólogo no encontrado.");
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ psychologist_id: doc.id })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Enviamos la notificación a la bandeja del Psicólogo
      await supabase.from('notifications').insert([{
        user_id: doc.id,
        title: 'Nuevo paciente vinculado',
        message: `${patientName} ha ingresado tu código y se ha unido a tu directorio clínico.`,
        type: 'link'
      }]);

      setPsychologistId(doc.id);
      setPsychologistName(doc.full_name);
      setIsLinked(true);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!userId) return;
    if(!window.confirm(`¿Estás seguro de que deseas desvincularte de ${psychologistName}? Perderás el acceso a todo tu progreso.`)) return;

    setLoading(true);
    try {
      // Le avisamos al psicólogo ANTES de borrar el vínculo
      if (psychologistId) {
        await supabase.from('notifications').insert([{
          user_id: psychologistId,
          title: 'Paciente desvinculado',
          message: `${patientName} ha revocado el acceso y se ha desvinculado de tu cuenta.`,
          type: 'unlink'
        }]);
      }

      const { error } = await supabase
        .from('profiles')
        .update({ psychologist_id: null })
        .eq('id', userId);

      if (error) throw error;

      setIsLinked(false);
      setLinkCode('');
      setPsychologistName('');
      setPsychologistId(null);
    } catch (error) {
      console.error("Error al desvincular:", error);
      alert("Hubo un error al intentar desvincular la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (field: string, currentValue: boolean) => {
    if (!userId) return;
    const newValue = !currentValue;
    
    if (field === 'share_tasks') setShareTasks(newValue);
    if (field === 'share_streak') setShareStreak(newValue);
    if (field === 'share_surveys') setShareSurveys(newValue);
    if (field === 'share_emotion') setShareEmotion(newValue);

    try {
      await supabase.from('profiles').update({ [field]: newValue }).eq('id', userId);
    } catch (error) {
      console.error("Error guardando permiso:", error);
    }
  };

  // --- CÁLCULO DE INICIALES DEL PSICÓLOGO ---
  // Si tiene "Dr." o "Dra.", lo omitimos para las iniciales.
  const cleanName = psychologistName.replace(/Dr(a)?\.\s*/i, '').trim();
  const names = cleanName.split(' ');
  let initials = "DR"; // Fallback por defecto
  if (names.length > 0 && names[0] !== "") {
    initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-12">
      
      {!isLinked ? (
        // ==========================================
        // VISTA 1: NO VINCULADO (Invita a vincular)
        // ==========================================
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-14 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center text-center max-w-3xl mx-auto mt-8 relative overflow-hidden">
          
          {/* Decoraciones de fondo */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#6C72F1] opacity-[0.03] rounded-full blur-[40px] pointer-events-none"></div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#3EAFA8] opacity-[0.03] rounded-full blur-[40px] pointer-events-none"></div>

          <div className="w-28 h-28 bg-gradient-to-br from-[#EEF0FF] to-white rounded-[32px] flex items-center justify-center text-[#6C72F1] mb-8 shadow-sm border border-white relative z-10">
            <Link2 className="w-12 h-12 stroke-[2.5]" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-[#F8FAFC]">
               <ShieldCheck className="w-6 h-6 text-[#3EAFA8]" strokeWidth={2.5} />
            </div>
          </div>
          
          <h2 className="text-[32px] md:text-[36px] font-extrabold text-[#333333] mb-4 tracking-tight z-10">
            Conecta con tu especialista
          </h2>
          <p className="text-[#8A95A5] text-[16px] mb-10 leading-relaxed font-medium max-w-lg mx-auto z-10">
            Ingresa el código único que te proporcionó tu psicólogo para vincular tu cuenta. Así podrán dar seguimiento a tu progreso de forma segura.
          </p>
          
          {errorMsg && (
            <div className="w-full bg-[#FEF2F2]/80 backdrop-blur-sm border border-[#FECACA] text-[#EF4444] px-5 py-3.5 rounded-[20px] mb-6 text-[13px] font-bold flex items-center gap-2 justify-center z-10">
              <ShieldAlert className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLink} className="w-full max-w-sm z-10">
            <label className="block font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 text-[10px] text-left pl-2">Código de vinculación</label>
            <input 
              type="text" 
              placeholder="Ej: PSY-2043"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value)}
              className="w-full px-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-black focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all text-center text-xl placeholder:text-[#CBD5E1] placeholder:font-medium tracking-[0.2em] uppercase mb-6 shadow-inner"
              required
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#6C72F1] hover:bg-[#5C61E1] text-white font-extrabold py-4 rounded-[20px] transition-all duration-300 shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-[14px] uppercase tracking-wider"
            >
              {loading ? "Buscando..." : "Vincular mi cuenta"} {!loading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
            </button>
          </form>

        </div>
      ) : (
        // ==========================================
        // VISTA 2: VINCULADO (Centro de Privacidad)
        // ==========================================
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">

          {/* BANNER DE PRIVACIDAD */}
          <div className="bg-gradient-to-r from-[#F0FDFA] to-white/60 backdrop-blur-sm border-l-[6px] border-[#3EAFA8] p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row gap-5 items-start md:items-center shadow-sm border-t border-r border-b border-white">
            <div className="bg-white p-3 rounded-[20px] shadow-sm border border-white flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#3EAFA8]" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0F766E] mb-1.5 text-[20px]">Centro de Privacidad Activa</h3>
              <p className="text-[#0F766E]/80 text-[14px] font-medium leading-relaxed max-w-4xl">
                Tú tienes el control total sobre lo que decides compartir con tu especialista. Desactiva cualquier opción y esa información dejará de estar visible inmediatamente en su directorio clínico.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ======================================= */}
            {/* CONTROLES DE COMPARTIR (Izquierda - 2/3) */}
            {/* ======================================= */}
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-black text-[#8A95A5] tracking-[0.15em] uppercase mb-4 px-2">Permisos de datos compartidos</h3>
              
              <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-sm border border-white overflow-hidden">
                
                {/* Switch 1: Tareas */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 border-b border-[#F1F5F9]/60 hover:bg-[#F8FAFC]/50 transition-colors group gap-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors shadow-sm border border-white flex-shrink-0 ${shareTasks ? 'bg-[#EEF0FF] text-[#6C72F1]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                      <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className={`font-extrabold text-[16px] transition-colors ${shareTasks ? 'text-[#333333]' : 'text-[#8A95A5]'}`}>Progreso de tareas</h4>
                      <p className="text-[13px] text-[#8A95A5] font-medium mt-0.5 leading-snug">Permite que tu psicólogo vea qué actividades has completado hoy.</p>
                    </div>
                  </div>
                  <button onClick={() => togglePermission('share_tasks', shareTasks)} className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner flex-shrink-0 relative ${shareTasks ? 'bg-[#6C72F1]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm absolute top-1 ${shareTasks ? 'left-8' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Switch 2: Racha */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 border-b border-[#F1F5F9]/60 hover:bg-[#F8FAFC]/50 transition-colors group gap-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors shadow-sm border border-white flex-shrink-0 ${shareStreak ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                      <Flame className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className={`font-extrabold text-[16px] transition-colors ${shareStreak ? 'text-[#333333]' : 'text-[#8A95A5]'}`}>Tu racha actual</h4>
                      <p className="text-[13px] text-[#8A95A5] font-medium mt-0.5 leading-snug">Muestra tu constancia diaria en el uso de la aplicación.</p>
                    </div>
                  </div>
                  <button onClick={() => togglePermission('share_streak', shareStreak)} className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner flex-shrink-0 relative ${shareStreak ? 'bg-[#6C72F1]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm absolute top-1 ${shareStreak ? 'left-8' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Switch 3: Encuestas */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 border-b border-[#F1F5F9]/60 hover:bg-[#F8FAFC]/50 transition-colors group gap-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors shadow-sm border border-white flex-shrink-0 ${shareSurveys ? 'bg-[#E5F7F4] text-[#3EAFA8]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                      <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className={`font-extrabold text-[16px] transition-colors ${shareSurveys ? 'text-[#333333]' : 'text-[#8A95A5]'}`}>Resultados de encuestas</h4>
                      <p className="text-[13px] text-[#8A95A5] font-medium mt-0.5 leading-snug">Comparte tus respuestas a los tests de seguimiento clínico.</p>
                    </div>
                  </div>
                  <button onClick={() => togglePermission('share_surveys', shareSurveys)} className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner flex-shrink-0 relative ${shareSurveys ? 'bg-[#6C72F1]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm absolute top-1 ${shareSurveys ? 'left-8' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Switch 4: Emoción */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 hover:bg-[#F8FAFC]/50 transition-colors group gap-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors shadow-sm border border-white flex-shrink-0 ${shareEmotion ? 'bg-[#FAF5FF] text-[#A68DD9]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                      <Smile className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className={`font-extrabold text-[16px] transition-colors ${shareEmotion ? 'text-[#333333]' : 'text-[#8A95A5]'}`}>Estado emocional</h4>
                      <p className="text-[13px] text-[#8A95A5] font-medium mt-0.5 leading-snug">Permite ver tu registro de ánimo diario y sus tendencias.</p>
                    </div>
                  </div>
                  <button onClick={() => togglePermission('share_emotion', shareEmotion)} className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 shadow-inner flex-shrink-0 relative ${shareEmotion ? 'bg-[#6C72F1]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm absolute top-1 ${shareEmotion ? 'left-8' : 'left-1'}`}></div>
                  </button>
                </div>

              </div>
            </div>

            {/* ======================================= */}
            {/* TARJETA DEL PSICÓLOGO (Derecha - 1/3) */}
            {/* ======================================= */}
            <div className="lg:col-span-1 flex flex-col">
              <h3 className="text-[10px] font-black text-[#8A95A5] tracking-[0.15em] uppercase mb-4 px-2">Tu Especialista</h3>
              
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-sm border border-white flex flex-col items-center text-center relative overflow-hidden h-full min-h-[380px]">
                
                {/* Elemento Decorativo */}
                <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#EEF0FF]/60 to-transparent"></div>

                <div className="relative mb-6 z-10 mt-4 group">
                  {/* --- ADIÓS EMOJI, HOLA INICIALES PROFESIONALES --- */}
                  <div className="w-[100px] h-[100px] bg-[#EEF0FF] rounded-[32px] flex items-center justify-center text-[36px] font-black text-[#6C72F1] shadow-sm border-[4px] border-white transition-transform duration-300 group-hover:scale-105">
                    {initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md border border-white">
                    <UserCheck className="w-[20px] h-[20px] text-[#3EAFA8]" strokeWidth={3} />
                  </div>
                </div>
                
                <h4 className="font-extrabold text-[#333333] text-[24px] mb-2 z-10 leading-tight">{psychologistName || "Dr. Especialista"}</h4>
                <p className="text-[10px] text-[#6C72F1] font-black uppercase tracking-[0.15em] mb-8 z-10 bg-[#EEF0FF] px-4 py-1.5 rounded-full border border-white shadow-sm">
                  Profesional Verificado
                </p>
                
                <div className="mt-auto w-full z-10 pt-6">
                  <p className="text-[12px] text-[#8A95A5] mb-5 font-medium px-2 leading-relaxed">
                    Si decides finalizar el tratamiento, puedes retirar el acceso a tus datos de forma definitiva.
                  </p>
                  <button 
                    onClick={handleUnlink} 
                    disabled={loading} 
                    className="w-full flex items-center justify-center gap-2 text-[#EF4444] font-bold py-4 rounded-[24px] bg-white border border-[#FECACA] hover:bg-[#FEF2F2] transition-all disabled:opacity-50 text-[14px] shadow-sm"
                  >
                    <UserX className="w-5 h-5" /> Desvincular 
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}