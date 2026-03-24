"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Crown, Flame, Target, Trophy, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// === CATÁLOGO DE SKINS ===
const AVAILABLE_SKINS = [
  { id: 'comun', name: 'Nabi Común', level: 1, color: '#8AD8CB', bg: 'bg-[#8AD8CB]', gradient: 'from-[#EAF1FF] to-[#E3F2F3]', border: 'border-[#8AD8CB]' },
  { id: 'monarca', name: 'Monarca', level: 10, color: '#F97316', bg: 'bg-[#F97316]', gradient: 'from-[#FFEDD5] to-[#FFEDD5]', border: 'border-[#F97316]' },
  { id: 'morpho', name: 'Morpho Azul', level: 25, color: '#3B82F6', bg: 'bg-[#3B82F6]', gradient: 'from-[#DBEAFE] to-[#DBEAFE]', border: 'border-[#3B82F6]' },
  { id: 'luna', name: 'Polilla Luna', level: 50, color: '#10B981', bg: 'bg-[#10B981]', gradient: 'from-[#D1FAE5] to-[#D1FAE5]', border: 'border-[#10B981]' },
];

const CompanionVisual = ({ stage, species, className = "w-16 h-16" }: { stage: string, species: string, className?: string }) => {
  const skin = AVAILABLE_SKINS.find(s => s.id === species) || AVAILABLE_SKINS[0];
  const mainColor = skin.color;

  if (stage === 'huevo') {
    return (
      <div className={`${className} relative flex items-center justify-center`}>
        <div className="absolute w-[60%] h-[80%] rounded-[45%_55%_55%_45%] bg-white shadow-md border-2 border-gray-50 overflow-hidden relative">
          <div className="absolute -bottom-2 -right-2 w-full h-full rounded-full opacity-30 blur-md" style={{ backgroundColor: mainColor }}></div>
          <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-80"></div>
        </div>
      </div>
    );
  }

  if (stage === 'oruga') {
    return (
      <div className={`${className} relative flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-[80%] h-[80%] drop-shadow-sm">
          <circle cx="25" cy="60" r="12" fill={mainColor} opacity="0.6" />
          <circle cx="45" cy="50" r="14" fill={mainColor} opacity="0.8" />
          <circle cx="68" cy="45" r="16" fill={mainColor} />
          <circle cx="72" cy="40" r="2" fill="white" />
          <circle cx="65" cy="40" r="2" fill="white" />
        </svg>
      </div>
    );
  }

  if (stage === 'crisalida') {
    return (
      <div className={`${className} relative flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-[60%] h-[80%] drop-shadow-md">
           <path d="M50 5 V15" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
           <path d="M50 15 C 30 30, 30 70, 50 95 C 70 70, 70 30, 50 15 Z" fill={mainColor} opacity="0.9" />
           <path d="M40 30 C 50 35, 60 30, 60 30" stroke="white" strokeWidth="2" opacity="0.5" fill="none" strokeLinecap="round" />
           <path d="M35 50 C 50 55, 65 50, 65 50" stroke="white" strokeWidth="2" opacity="0.5" fill="none" strokeLinecap="round" />
           <path d="M42 70 C 50 75, 58 70, 58 70" stroke="white" strokeWidth="2" opacity="0.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-md transition-transform hover:scale-110 duration-500">
        <path d="M48 45 C 20 20, 10 30, 5 45 C 5 60, 25 55, 48 55 Z" fill={mainColor} opacity="0.9" />
        <path d="M52 45 C 80 20, 90 30, 95 45 C 95 60, 75 55, 52 55 Z" fill={mainColor} opacity="0.9" />
        <path d="M48 55 C 30 65, 20 85, 40 95 C 45 80, 45 65, 48 55 Z" fill={mainColor} opacity="0.7" />
        <path d="M52 55 C 70 65, 80 85, 60 95 C 55 80, 55 65, 52 55 Z" fill={mainColor} opacity="0.7" />
        <rect x="47" y="35" width="6" height="30" rx="3" fill="#0F172A" />
        <path d="M48 35 C 45 25, 40 20, 40 20" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M52 35 C 55 25, 60 20, 60 20" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="20" cy="45" r="4" fill="white" opacity="0.8" />
        <circle cx="80" cy="45" r="4" fill="white" opacity="0.8" />
        <circle cx="35" cy="80" r="3" fill="white" opacity="0.6" />
        <circle cx="65" cy="80" r="3" fill="white" opacity="0.6" />
      </svg>
    </div>
  );
};

export default function ProgresoPage() {
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState("gratis");
  const [companion, setCompanion] = useState<any>(null);
  
  const [userData, setUserData] = useState({
    name: "Cargando...",
    initials: "U",
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedTasks: 0,
    nextMilestone: { target: 7, message: '' }
  });

  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [profileRes, companionRes, tasksRes] = await Promise.all([
          supabase.from('profiles').select('full_name, current_streak, longest_streak, plan').eq('id', user.id).single(),
          supabase.from('user_companions').select('*').eq('patient_id', user.id).single(),
          supabase.from('patient_tasks').select('assigned_date').eq('patient_id', user.id).eq('is_completed', true)
        ]);

        const profile = profileRes.data;
        setUserPlan(profile?.plan || 'gratis');
        
        let compData = null;
        if (profile?.plan === 'premium' && companionRes.data) {
          setCompanion(companionRes.data);
          compData = companionRes.data;
        }

        const recentTasks = tasksRes.data || [];
        const completedCount = recentTasks.length;
        
        const calculatedXP = compData ? compData.xp : (completedCount * 25); 

        const currentStreak = profile?.current_streak || 0;
        let target = 7;
        if (currentStreak >= 7) target = 14;
        if (currentStreak >= 14) target = 30;
        if (currentStreak >= 30) target = 100;

        const initials = profile?.full_name?.charAt(0).toUpperCase() || "U";

        setUserData({
          name: profile?.full_name || "Usuario",
          initials: initials,
          xp: calculatedXP,
          currentStreak: currentStreak,
          longestStreak: profile?.longest_streak || 0,
          completedTasks: completedCount,
          nextMilestone: {
            target: target,
            message: `¡Solo faltan ${target - currentStreak} días para tu nueva medalla!`
          }
        });

        const today = new Date();
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          return d;
        });

        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const chartData = last7Days.map((dateObj, index) => {
          const dateString = dateObj.toISOString().split('T')[0];
          const tasksThisDay = recentTasks.filter(t => t.assigned_date === dateString).length;
          const percentage = Math.min((tasksThisDay / 6) * 100, 100);
          
          return {
            day: diasSemana[dateObj.getDay()],
            value: percentage,
            active: index === 6 
          };
        });

        setWeeklyActivity(chartData);

      } catch (error) {
        console.error("Error al cargar progreso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
         <div className="w-12 h-12 border-4 border-[#6C72F1]/30 border-t-[#6C72F1] rounded-full animate-spin mb-4"></div>
         <p className="text-[#1E293B] font-extrabold text-[15px]">Calculando tu progreso evolutivo...</p>
      </div>
    );
  }

  const compLevel = companion?.level || 1;
  const xpNeededForNextLevel = compLevel * 100;
  let currentLevelXp = userData.xp;
  let lvlCalc = 1;
  while (currentLevelXp >= lvlCalc * 100) {
    currentLevelXp -= lvlCalc * 100;
    lvlCalc++;
  }
  const progressPercentage = Math.min(100, (currentLevelXp / xpNeededForNextLevel) * 100);

  const activeSkin = AVAILABLE_SKINS.find(s => s.id === companion?.species) || AVAILABLE_SKINS[0];

  const getStageName = (stage: string) => {
    switch(stage) {
      case 'huevo': return 'Semilla / Huevo';
      case 'oruga': return 'Oruga';
      case 'crisalida': return 'Crisálida';
      case 'mariposa': return 'Mariposa';
      default: return 'Desconocido';
    }
  };

  return (
    // CONTENEDOR PRINCIPAL: Agregamos px y eliminamos márgenes negativos extraños
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-12 space-y-8 px-4 sm:px-6 lg:px-8 mt-4">

      {/* =============================================================== */}
      {/* TARJETA SUPERIOR: PERFIL Y COMPAÑERO */}
      {/* =============================================================== */}
      <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        
        {/* Lado Izquierdo: Info del Paciente */}
        <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
          <div className="w-24 h-24 bg-[#EEF0FF] rounded-[28px] flex items-center justify-center shadow-inner border border-white overflow-hidden text-[40px] font-black text-[#6C72F1]">
            {userData.initials}
          </div>
          <div>
            <h2 className="font-extrabold text-[#333333] text-[28px] md:text-[36px] tracking-tight mb-2 leading-none">
              {userData.name}
            </h2>
            {userPlan === 'premium' ? (
              <span className="text-[10px] font-black bg-gradient-to-r from-[#FEF3C7] to-[#FFFBEB] text-[#D97706] px-4 py-1.5 rounded-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 w-fit border border-[#FDE047]/50 shadow-sm">
                <Crown className="w-3.5 h-3.5" /> Nabi Premium
              </span>
            ) : (
              <span className="text-[10px] font-black bg-[#F8FAFC] text-[#8A95A5] px-4 py-1.5 rounded-[10px] uppercase tracking-[0.2em] w-fit shadow-sm border border-white">
                Plan Básico
              </span>
            )}
          </div>
        </div>

        {/* Separador Desktop */}
        <div className="hidden md:block w-[1px] h-20 bg-[#CBD5E1]/50 relative z-10"></div>

        {/* Lado Derecho: Puntos o Compañero Evolutivo */}
        <div className="w-full md:w-auto flex-1 md:flex-none flex items-center gap-6 justify-end relative z-10">
          
          {userPlan === 'gratis' ? (
            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end bg-white/50 backdrop-blur-md p-6 rounded-[28px] border border-white shadow-sm">
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-[#6C72F1] tracking-[0.15em] uppercase mb-1">Puntos Acumulados</p>
                <p className="font-extrabold text-[#333333] text-[32px] tracking-tight leading-none">{userData.xp.toLocaleString()} XP</p>
              </div>
              <Link href="/dashboard/settings/plan" className="bg-[#6C72F1] hover:bg-[#5C61E1] text-white font-extrabold text-[13px] uppercase tracking-wider px-8 py-4 rounded-[20px] transition-all shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" strokeWidth={2.5} /> Evolucionar
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-left md:text-right w-full max-w-[200px]">
                <p className="text-[10px] font-black text-[#6C72F1] tracking-[0.15em] uppercase mb-2.5 flex justify-between">
                  <span>{companion?.name || 'Compañero'}</span>
                  <span className="text-[#3EAFA8]">{currentLevelXp} / {xpNeededForNextLevel}</span>
                </p>
                <div className="w-full bg-[#F8FAFC] border border-white shadow-inner rounded-full h-[8px] mb-2 overflow-hidden p-[1.5px]">
                  <div className="bg-[#6C72F1] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="font-extrabold text-[#333333] text-[14px]">
                  Nivel {compLevel} <span className="text-[#CBD5E1] font-normal mx-1.5">•</span> <span className="text-[#8A95A5] text-[13px] font-bold">{getStageName(companion?.stage || 'huevo')}</span>
                </p>
              </div>
              
              <div className={`w-20 h-20 bg-gradient-to-b ${activeSkin.gradient} rounded-[28px] border-[3px] border-white shadow-inner flex items-center justify-center flex-shrink-0 relative ring-1 ring-gray-100`}>
                 <CompanionVisual stage={companion?.stage || 'huevo'} species={companion?.species || 'comun'} className="w-14 h-14" />
                 <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-50">
                    <Crown className="w-4 h-4 text-[#FDE047]" strokeWidth={3} />
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =============================================================== */}
      {/* BANNER DE RACHA PANORÁMICO */}
      {/* =============================================================== */}
      <div className="bg-gradient-to-br from-[#6A70F0] to-[#5C61E1] p-10 md:p-14 rounded-[40px] text-center flex flex-col items-center justify-center relative overflow-hidden shadow-sm border border-white/10">
        
        <Zap className="absolute -left-10 -bottom-8 w-64 h-64 text-white opacity-[0.05] rotate-12" fill="currentColor" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-[0.08] rounded-full blur-[60px] pointer-events-none"></div>

        <div className="w-[80px] h-[80px] bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner mb-6 z-10 border border-white/30">
          <Flame className="w-10 h-10 text-[#FDE047]" fill="#FEF3C7" strokeWidth={2.5} />
        </div>
        
        <p className="text-[11px] font-black text-white/90 tracking-[0.3em] uppercase mb-1 z-10">Tu Racha Actual</p>
        <h3 className="text-[64px] md:text-[80px] font-black text-white mb-6 z-10 tracking-tight leading-none">
          {userData.currentStreak} <span className="text-[20px] md:text-[24px] text-white/80 font-bold tracking-normal">días</span>
        </h3>
        
        <div className="z-10 bg-white/10 backdrop-blur-md rounded-[20px] px-6 py-3 border border-white/20 shadow-sm mt-1">
          <p className="text-white font-medium max-w-sm leading-relaxed text-[15px]">
            {userData.currentStreak > 0 
              ? "¡Increíble! Mantén el ritmo para fortalecer tus hábitos." 
              : "Hoy es un excelente día para comenzar. Enciende tu racha."}
          </p>
        </div>
      </div>

      {/* =============================================================== */}
      {/* GRID INFERIOR (Gráfico y Tarjetas) */}
      {/* =============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* GRÁFICO SEMANAL */}
        <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white flex flex-col h-full min-h-[420px]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-extrabold text-[#333333] text-[24px] mb-1 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#6C72F1]" strokeWidth={2.5} /> Actividad Semanal
              </h3>
              <p className="text-[14px] text-[#8A95A5] font-medium">Tus últimos 7 días</p>
            </div>
            <span className="bg-[#EEF0FF] text-[#6C72F1] px-4 py-2 rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] border border-white shadow-sm">
              En progreso
            </span>
          </div>

          <div className="flex justify-between items-end mt-auto pt-6 h-64 relative">
            
            {/* Líneas guía del gráfico */}
            <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between py-6 pointer-events-none opacity-30">
               <div className="border-b border-dashed border-[#8A95A5] w-full"></div>
               <div className="border-b border-dashed border-[#8A95A5] w-full"></div>
               <div className="border-b border-dashed border-[#8A95A5] w-full"></div>
            </div>

            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-4 w-full z-10 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E293B] text-white text-[10px] font-bold px-3 py-2 rounded-[10px] shadow-sm mb-1 whitespace-nowrap">
                   {Math.round(day.value)}%
                </div>
                
                <div className="w-full max-w-[40px] bg-[#F8FAFC] rounded-t-[20px] flex items-end justify-center h-48 relative overflow-hidden border-x border-t border-white shadow-inner">
                  <div 
                    className={`w-full rounded-t-[20px] transition-all duration-1000 ease-out flex justify-center shadow-sm ${day.active ? 'bg-[#6C72F1]' : 'bg-[#CBD5E1]'}`}
                    style={{ height: `${Math.max(10, day.value)}%` }} // Minimum 10%
                  >
                  </div>
                </div>
                <span className={`text-[11px] uppercase tracking-wider ${day.active ? 'text-[#333333] font-black' : 'text-[#8A95A5] font-bold'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA (Hito y Metas) */}
        <div className="flex flex-col gap-8 h-full justify-between">
          
          {/* PRÓXIMO HITO */}
          <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white">
            <h3 className="font-extrabold text-[#333333] text-[24px] mb-8 flex items-center gap-3">
               <Target className="w-6 h-6 text-[#3EAFA8]" strokeWidth={2.5} /> Tu Próximo Hito
            </h3>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#E5F7F4] rounded-[20px] flex items-center justify-center text-[#3EAFA8] shadow-sm border border-white">
                    <Trophy className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <span className="font-extrabold text-[#333333] text-[18px]">Medalla {userData.nextMilestone.target} Días</span>
                </div>
                <span className="text-[24px] font-black text-[#333333]">{userData.currentStreak}<span className="text-[16px] text-[#8A95A5] font-bold">/{userData.nextMilestone.target}</span></span>
              </div>
              
              <div className="w-full bg-[#F8FAFC] rounded-full h-[12px] overflow-hidden border border-white shadow-inner p-[2px]">
                <div 
                  className="bg-[#3EAFA8] h-full rounded-full transition-all duration-1000 shadow-sm" 
                  style={{ width: `${(userData.currentStreak / userData.nextMilestone.target) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-[24px] border border-white shadow-sm text-center">
              <p className="text-[14px] text-[#64748B] font-bold leading-relaxed">
                {userData.nextMilestone.message}
              </p>
            </div>
          </div>

          {/* TARJETAS DE MÉTRICAS GLOBALES */}
          <div className="grid grid-cols-2 gap-6">
            
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white text-center flex flex-col items-center justify-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all group h-[180px]">
              <div className="w-14 h-14 bg-[#EEF0FF] rounded-[24px] flex items-center justify-center text-[#6C72F1] mb-4 shadow-sm border border-white group-hover:scale-105 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h4 className="text-[36px] font-black text-[#333333] tracking-tight leading-none mb-1">{userData.completedTasks}</h4>
              <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.2em]">Completadas</p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white text-center flex flex-col items-center justify-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all group h-[180px]">
              <div className="w-14 h-14 bg-[#FFFBEB] rounded-[24px] flex items-center justify-center text-[#D97706] mb-4 shadow-sm border border-white group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-6 h-6" strokeWidth={2.5} fill="#FEF3C7" />
              </div>
              <h4 className="text-[36px] font-black text-[#333333] tracking-tight leading-none mb-1">{userData.longestStreak}</h4>
              <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.2em]">Racha Máxima</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}