"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Wind, Headphones, BookOpen, Sun, CheckCircle, Users, Heart, Moon, Clock, Zap, Activity, Lock, Sparkles, Crown, Edit2, X, Palette, Type, CheckCircle2, Smile, Flame, Meh, Frown, Brain, Check } from 'lucide-react';
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
        <div className="absolute w-[60%] h-[80%] rounded-[45%_55%_55%_45%] bg-white shadow-md border-2 border-gray-100 overflow-hidden relative">
          <div className="absolute -bottom-2 -right-2 w-full h-full rounded-full opacity-30 blur-md" style={{ backgroundColor: mainColor }}></div>
          <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-70"></div>
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
        <rect x="47" y="35" width="6" height="30" rx="3" fill="#1E293B" />
        <path d="M48 35 C 45 25, 40 20, 40 20" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M52 35 C 55 25, 60 20, 60 20" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="20" cy="45" r="4" fill="white" opacity="0.8" />
        <circle cx="80" cy="45" r="4" fill="white" opacity="0.8" />
        <circle cx="35" cy="80" r="3" fill="white" opacity="0.6" />
        <circle cx="65" cy="80" r="3" fill="white" opacity="0.6" />
      </svg>
    </div>
  );
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]); 
  const [customTask, setCustomTask] = useState<any>(null); 
  
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState("gratis");
  const [userName, setUserName] = useState("Usuario");
  
  const [currentStreak, setCurrentStreak] = useState(0);
  
  const [companion, setCompanion] = useState<any>(null); 
  
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("¡Hola! Listo para seguir creciendo juntos.");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'name' | 'skins'>('name');
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [completedCustomTask, setCompletedCustomTask] = useState(false); 

  const [isSavingMood, setIsSavingMood] = useState(false);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [todayMoodId, setTodayMoodId] = useState<number | null>(null);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Wind': return <Wind className="w-5 h-5 text-[#6C72F1]" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-[#6C72F1]" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-[#6C72F1]" />;
      case 'Sun': return <Sun className="w-5 h-5 text-[#6C72F1]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#6C72F1]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#6C72F1]" />;
      case 'Moon': return <Moon className="w-5 h-5 text-[#6C72F1]" />;
      case 'Clock': return <Clock className="w-5 h-5 text-[#6C72F1]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#6C72F1]" />;
      case 'Activity': return <Activity className="w-5 h-5 text-[#6C72F1]" />;
      default: return <Edit2 className="w-5 h-5 text-[#6C72F1]" />;
    }
  };

  const getLocalDateString = () => {
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const todayDateString = getLocalDateString();

        const { data: profile } = await supabase.from('profiles').select('full_name, selected_route, plan, current_streak, last_activity_date').eq('id', user.id).single();
        
        let extractedName = "Usuario";
        if (profile) {
            extractedName = profile.full_name ? profile.full_name.split(' ')[0] : 'Usuario';
            setUserName(extractedName);
            setUserPlan(profile.plan || 'gratis');
            
            const now = new Date();
            const yesterdayDate = new Date(now);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = new Date(yesterdayDate.getTime() - (yesterdayDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            
            let activeStreak = profile.current_streak || 0;
            if (profile.last_activity_date !== todayDateString && profile.last_activity_date !== yesterdayStr) {
                if (activeStreak > 0) {
                    activeStreak = 0;
                    await supabase.from('profiles').update({ current_streak: 0 }).eq('id', user.id);
                }
            }
            setCurrentStreak(activeStreak);

            if (profile.selected_route) {
              setSelectedRoute(profile.selected_route);
              const { data: routeObj } = await supabase.from('routes').select('id').eq('name', profile.selected_route).single();
              if (routeObj) {
                const { data: catalogTasks } = await supabase.from('tasks_catalog').select('*').eq('route_id', routeObj.id);
                if (catalogTasks && catalogTasks.length > 0) {
                  const dateNumber = parseInt(todayDateString.replace(/-/g, ''));
                  let shuffled = [...catalogTasks].sort((a, b) => {
                     const pseudoRandomA = (a.id * dateNumber) % 100;
                     const pseudoRandomB = (b.id * dateNumber) % 100;
                     return pseudoRandomA - pseudoRandomB;
                  });
                  setTasks(shuffled.slice(0, 5));
                }
              }
            }

            if (profile.plan === 'premium') {
              const { data: companionData } = await supabase.from('user_companions').select('*').eq('patient_id', user.id).single();
              if (companionData) setCompanion(companionData);
            }
        }

        const [messagesRes, completedRes, customRes, moodRes] = await Promise.all([
          supabase.from('companion_messages').select('*'),
          supabase.from('patient_tasks').select('task_catalog_id').eq('patient_id', user.id).eq('assigned_date', todayDateString).eq('is_completed', true),
          supabase.from('custom_tasks').select('*').eq('patient_id', user.id).eq('assigned_date', todayDateString).maybeSingle(),
          supabase.from('mood_logs')
            .select('id, mood, log_date')
            .eq('patient_id', user.id)
            .eq('log_date', todayDateString)
            .order('logged_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        if (messagesRes.data) {
          setAllMessages(messagesRes.data);
          const greetings = messagesRes.data.filter(m => m.category === 'greeting');
          if (greetings.length > 0) {
            const randomMsg = greetings[Math.floor(Math.random() * greetings.length)].content;
            setCurrentMessage(randomMsg.replace('{name}', extractedName));
          }
        }

        if (completedRes.data) setCompletedTasks(completedRes.data.map(pt => pt.task_catalog_id));
        
        if (customRes.data) {
          setCustomTask(customRes.data);
          setCompletedCustomTask(customRes.data.is_completed);
        }

        if (moodRes.data) {
          setTodayMood(moodRes.data.mood);
          setTodayMoodId(moodRes.data.id);
        }

      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const triggerMessage = (category: string) => {
    if (allMessages.length === 0) return;
    const filtered = allMessages.filter(m => m.category === category);
    if (filtered.length > 0) {
      const randomMsg = filtered[Math.floor(Math.random() * filtered.length)].content;
      setCurrentMessage(randomMsg.replace('{name}', userName));
    }
  };

  const updateXP = async (xpChange: number) => {
    if (userPlan !== 'premium' || !companion) return;

    let totalXp = Math.max(0, companion.xp + xpChange); 
    let newLevel = 1;
    let tempXp = totalXp;
    while (tempXp >= newLevel * 100) {
      tempXp -= newLevel * 100;
      newLevel++;
    }

    let newStage = 'huevo';
    if (newLevel >= 4) newStage = 'oruga';
    if (newLevel >= 8) newStage = 'crisalida';
    if (newLevel >= 12) newStage = 'mariposa';

    setCompanion({ ...companion, xp: totalXp, level: newLevel, stage: newStage });

    try {
      await supabase.from('user_companions').update({ xp: totalXp, level: newLevel, stage: newStage }).eq('id', companion.id);
    } catch (e) {}
  };

  const checkAndUpdateStreak = async () => {
    if (!userId) return;
    
    try {
      const { data: profile } = await supabase.from('profiles').select('current_streak, longest_streak, last_activity_date').eq('id', userId).single();
      if (!profile) return;

      const todayStr = getLocalDateString();
      const lastActivityStr = profile.last_activity_date;

      if (lastActivityStr === todayStr) return;

      const now = new Date();
      const yesterdayDate = new Date(now);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = new Date(yesterdayDate.getTime() - (yesterdayDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      let newCurrentStreak = 1; 

      if (lastActivityStr === yesterdayStr) {
        newCurrentStreak = (profile.current_streak || 0) + 1;
      }

      const newLongestStreak = Math.max(profile.longest_streak || 0, newCurrentStreak);

      setCurrentStreak(newCurrentStreak);

      await supabase
        .from('profiles')
        .update({ 
          current_streak: newCurrentStreak, 
          longest_streak: newLongestStreak,
          last_activity_date: todayStr 
        })
        .eq('id', userId);

    } catch (error) {
      console.error("Error actualizando racha:", error);
    }
  };

  const handleMoodSelect = async (mood: string) => {
    if (!userId || isSavingMood) return;
    setIsSavingMood(true);
    setTodayMood(mood);
    
    triggerMessage(`mood_${mood}`);

    try {
      if (todayMoodId) {
        await supabase.from('mood_logs').update({ mood: mood }).eq('id', todayMoodId);
      } else {
        const { data } = await supabase
          .from('mood_logs')
          .insert([{ patient_id: userId, mood: mood, log_date: getLocalDateString() }])
          .select()
          .single();
        if (data) setTodayMoodId(data.id);
      }
    } catch (error) {} finally { setIsSavingMood(false); }
  };

  const toggleTask = async (taskId: number) => {
    if (!userId) return;
    const isCurrentlyCompleted = completedTasks.includes(taskId);
    const todayDateString = getLocalDateString();
    
    if (isCurrentlyCompleted) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
      updateXP(-25); 
    } else {
      setCompletedTasks([...completedTasks, taskId]);
      updateXP(25); 
      triggerMessage('motivation');
      checkAndUpdateStreak();
    }

    try {
      if (isCurrentlyCompleted) {
        await supabase.from('patient_tasks').delete().eq('patient_id', userId).eq('task_catalog_id', taskId).eq('assigned_date', todayDateString);
      } else {
        await supabase.from('patient_tasks').insert([{ patient_id: userId, task_catalog_id: taskId, is_completed: true, assigned_date: todayDateString }]);
      }
    } catch (error) {}
  };

  const toggleCustomTask = async () => {
    if (!userId || !customTask) return;
    const newValue = !completedCustomTask;
    setCompletedCustomTask(newValue);
    
    if (newValue) {
      updateXP(25);
      triggerMessage('motivation');
      checkAndUpdateStreak();
    } else {
      updateXP(-25);
    }

    try { await supabase.from('custom_tasks').update({ is_completed: newValue }).eq('id', customTask.id); } catch (error) {}
  };

  const saveCompanionName = async () => {
    if (!newName.trim() || !companion) return;
    setIsSaving(true);
    try {
      await supabase.from('user_companions').update({ name: newName.trim() }).eq('id', companion.id);
      setCompanion({ ...companion, name: newName.trim() });
      setIsModalOpen(false);
    } catch (error) {
      alert("Hubo un error al guardar el nombre.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEquipSkin = async (skinId: string, requiredLevel: number) => {
    if (!companion || compLevel < requiredLevel) return;
    setIsSaving(true);
    try {
      await supabase.from('user_companions').update({ species: skinId }).eq('id', companion.id);
      setCompanion({ ...companion, species: skinId });
    } catch (error) {
      alert("Hubo un error al equipar el aspecto.");
    } finally {
      setIsSaving(false);
    }
  };

  const tareasActualesCompletadas = tasks.filter(task => completedTasks.includes(task.id)).length;
  const totalTareasHoy = tasks.length + (customTask ? 1 : 0);
  const totalCompletadasHoy = tareasActualesCompletadas + (completedCustomTask ? 1 : 0);

  const compLevel = companion?.level || 1;
  const totalXp = companion?.xp || 0;
  
  let currentLevelXp = totalXp;
  let lvlCalc = 1;
  while (currentLevelXp >= lvlCalc * 100) {
    currentLevelXp -= lvlCalc * 100;
    lvlCalc++;
  }
  const xpNeededForNextLevel = compLevel * 100; 
  const progressPercentage = Math.min(100, (currentLevelXp / xpNeededForNextLevel) * 100);

  const getStageName = (stage: string) => {
    switch(stage) {
      case 'huevo': return 'Semilla / Huevo';
      case 'oruga': return 'Oruga';
      case 'crisalida': return 'Crisálida';
      case 'mariposa': return 'Mariposa';
      default: return 'Desconocido';
    }
  };

  const activeSkin = AVAILABLE_SKINS.find(s => s.id === companion?.species) || AVAILABLE_SKINS[0];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F3E7FC] via-[#E2F4EE] to-[#FDF3E9] text-[#1E293B] font-sans relative overflow-hidden pb-24">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* HEADER HERO */}
        <div className="mb-10 bg-white/60 backdrop-blur-xl p-8 sm:p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white">
          <h1 className="text-[40px] sm:text-[48px] font-extrabold text-[#333333] mb-1 leading-tight tracking-tight">
            ¡Hola, {userName}!
          </h1>
          <p className="text-[#64748B] text-[18px] sm:text-[20px]">
            ¿Cómo se siente tu santuario hoy?
          </p>

          {/* ESTADO DE ÁNIMO (4 TARJETAS) - Colores Fijos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
            <div onClick={() => handleMoodSelect('feliz')} className={`bg-white/80 backdrop-blur-sm rounded-[28px] py-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm border ${todayMood === 'feliz' ? 'border-[#8AD8CB] scale-105 ring-2 ring-[#8AD8CB]/20' : 'border-white hover:shadow-md'}`}>
              <div className="w-[50px] h-[50px] rounded-full bg-[#E5F7F4] flex items-center justify-center mb-3">
                 <Smile className="w-[24px] h-[24px] text-[#55D0B9]" strokeWidth={2.5} />
              </div>
              <p className={`font-bold text-[10px] uppercase tracking-[0.2em] ${todayMood === 'feliz' ? 'text-[#55D0B9]' : 'text-[#94A3B8]'}`}>Feliz</p>
            </div>

            <div onClick={() => handleMoodSelect('neutral')} className={`bg-white/80 backdrop-blur-sm rounded-[28px] py-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm border ${todayMood === 'neutral' ? 'border-[#64748B] scale-105 ring-2 ring-[#64748B]/20' : 'border-white hover:shadow-md'}`}>
              <div className="w-[50px] h-[50px] rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                 <Meh className="w-[24px] h-[24px] text-[#64748B]" strokeWidth={2.5} />
              </div>
              <p className={`font-bold text-[10px] uppercase tracking-[0.2em] ${todayMood === 'neutral' ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Neutral</p>
            </div>

            <div onClick={() => handleMoodSelect('triste')} className={`bg-white/80 backdrop-blur-sm rounded-[28px] py-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm border ${todayMood === 'triste' ? 'border-[#93C5FD] scale-105 ring-2 ring-[#93C5FD]/20' : 'border-white hover:shadow-md'}`}>
              <div className="w-[50px] h-[50px] rounded-full bg-[#EFF6FF] flex items-center justify-center mb-3">
                 <Frown className="w-[24px] h-[24px] text-[#93C5FD]" strokeWidth={2.5} />
              </div>
              <p className={`font-bold text-[10px] uppercase tracking-[0.2em] ${todayMood === 'triste' ? 'text-[#93C5FD]' : 'text-[#94A3B8]'}`}>Triste</p>
            </div>

            <div onClick={() => handleMoodSelect('ansioso')} className={`bg-white/80 backdrop-blur-sm rounded-[28px] py-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm border ${todayMood === 'ansioso' ? 'border-[#FCA5A5] scale-105 ring-2 ring-[#FCA5A5]/20' : 'border-white hover:shadow-md'}`}>
              <div className="w-[50px] h-[50px] rounded-full bg-[#FEF2F2] flex items-center justify-center mb-3">
                 <Brain className="w-[24px] h-[24px] text-[#FCA5A5]" strokeWidth={2.5} />
              </div>
              <p className={`font-bold text-[10px] uppercase tracking-[0.2em] ${todayMood === 'ansioso' ? 'text-[#FCA5A5]' : 'text-[#94A3B8]'}`}>Ansioso</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ======================================= */}
          {/* COLUMNA IZQUIERDA: TAREAS */}
          {/* ======================================= */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-end mb-4 px-2">
              <div>
                <h2 className="font-extrabold text-[22px] text-[#333333]">
                  Tareas Diarias
                </h2>
                {/* Enfoque actual */}
                <p className="text-[14px] text-[#8A95A5] font-medium mt-1">
                  Enfoque actual: <span className="text-[#6C72F1]">{selectedRoute || "Ninguno"}</span>
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#6C72F1] uppercase tracking-widest mb-1">
                {totalCompletadasHoy} / {totalTareasHoy} COMPLETADAS
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {loading ? (
                <p className="text-center text-[#94A3B8] py-10 font-bold">Preparando tu lista diaria...</p>
              ) : tasks.length === 0 && !customTask ? (
                <div className="text-center py-10 bg-white/50 backdrop-blur-sm rounded-[24px] border border-white">
                  <CheckCircle2 className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
                  <p className="text-[#64748B] font-medium">No hay tareas para esta ruta aún.</p>
                </div>
              ) : (
                <>
                  {/* TAREA PERSONALIZADA DEL PSICÓLOGO */}
                  {customTask && (
                    <div onClick={toggleCustomTask} className={`p-4 rounded-[24px] cursor-pointer transition-all duration-300 border group shadow-sm ${completedCustomTask ? 'bg-[#EEF0FF]/80 backdrop-blur-md border-white' : 'bg-white/80 backdrop-blur-xl border-[#FEF3C7] hover:shadow-md hover:-translate-y-0.5'}`}>
                      <div className="flex items-center gap-4 relative z-10 w-full">
                        
                        <div className={`w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors border shadow-sm ${completedCustomTask ? 'bg-white border-[#C7D2FE]' : 'bg-[#FFFBEB] border-[#FEF3C7]'}`}>
                           <Users className={`w-5 h-5 ${completedCustomTask ? 'text-[#6C72F1]' : 'text-[#D97706]'}`} />
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[8px] font-black bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm">Asignada por tu Doc</span>
                            </div>
                            <h4 className={`font-extrabold text-[14px] transition-colors duration-300 ${completedCustomTask ? 'text-[#94A3B8] line-through decoration-1' : 'text-[#333333]'}`}>{customTask.title}</h4>
                            <p className={`text-[12px] font-medium mt-0.5 transition-colors duration-300 line-clamp-1 ${completedCustomTask ? 'text-[#CBD5E1]' : 'text-[#8A95A5]'}`}>{customTask.description}</p>
                        </div>
                        
                        {/* Botón de Check Círculo */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ml-2 ${completedCustomTask ? 'bg-[#6C72F1] border-[#6C72F1]' : 'border-[#CBD5E1] bg-transparent group-hover:border-[#D97706]'}`}>
                          {completedCustomTask && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAREAS DE CATÁLOGO */}
                  {tasks.map((task) => {
                    const isCompleted = completedTasks.includes(task.id);
                    return (
                      <div key={task.id} onClick={() => toggleTask(task.id)} className={`p-4 rounded-[24px] cursor-pointer transition-all duration-300 border group shadow-sm ${isCompleted ? 'bg-[#EEF0FF]/80 backdrop-blur-md border-white' : 'bg-white/80 backdrop-blur-xl border-white hover:shadow-md hover:-translate-y-0.5'}`}>
                        <div className="flex items-center gap-4 relative z-10 w-full">
                          
                          <div className={`w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors border shadow-sm ${isCompleted ? 'bg-white border-[#C7D2FE]' : 'bg-[#F8FAFC] border-[#F1F5F9]'}`}>
                             {getIcon(task.icon)}
                          </div>
                          
                          <div className="flex-1">
                              <h4 className={`font-extrabold text-[14px] transition-colors duration-300 ${isCompleted ? 'text-[#94A3B8] line-through decoration-1' : 'text-[#333333]'}`}>{task.title}</h4>
                              <p className={`text-[12px] font-medium mt-0.5 transition-colors duration-300 line-clamp-1 ${isCompleted ? 'text-[#CBD5E1]' : 'text-[#8A95A5]'}`}>{task.description}</p>
                          </div>
                          
                          {/* Botón de Check Círculo */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ml-2 ${isCompleted ? 'bg-[#6C72F1] border-[#6C72F1]' : 'border-[#CBD5E1] bg-transparent group-hover:border-[#6C72F1]'}`}>
                            {isCompleted && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* ======================================= */}
          {/* COLUMNA DERECHA: WIDGETS */}
          {/* ======================================= */}
          <div className="flex flex-col gap-6">
            
            {/* TARJETA DE RACHAS */}
            <div className="bg-gradient-to-br from-[#6A70F0] to-[#5C61E1] p-6 rounded-[32px] flex flex-col items-start justify-center relative overflow-hidden shadow-lg border border-white/10 h-[160px]">
              <Zap className="absolute -right-8 -bottom-6 w-40 h-40 text-white opacity-[0.08] rotate-12" fill="currentColor" />
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-white/90 mb-1 relative z-10">TU RACHA</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <h3 className="text-[48px] font-black tracking-tight leading-none text-white">{currentStreak}</h3>
                <span className="text-[16px] font-bold text-white">DÍAS</span>
              </div>
              <div className="mt-3 relative z-10 bg-white/10 backdrop-blur-sm rounded-[12px] px-3 py-1.5 w-fit border border-white/10">
                 <p className="text-[11px] font-medium text-white/90">
                    {currentStreak > 0 ? '¡Excelente constancia! Sigue así.' : 'Completa una tarea para empezar.'}
                 </p>
              </div>
            </div>

            {/* TU COMPAÑERO / NABI */}
            {userPlan === 'gratis' ? (
              <Link href="/dashboard/settings/plan" className="bg-white/70 backdrop-blur-xl p-8 rounded-[32px] flex flex-col items-center text-center shadow-sm border border-white relative group cursor-pointer hover:shadow-md transition-all">
                <div className="w-[80px] h-[80px] bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 border border-[#E2E8F0] shadow-inner group-hover:scale-105 transition-transform">
                   <Lock className="w-[20px] h-[20px] text-[#64748B]" />
                </div>
                <h3 className="text-[#333333] font-extrabold text-[20px] mb-2">Tu Compañero</h3>
                <p className="text-[#64748B] text-[13px] leading-relaxed mb-6 font-medium max-w-[200px]">
                  Descubre a tu asistente terapéutico y mira cómo crece.
                </p>
                <div className="w-full py-3 bg-[#FFFBEB] border border-[#FDE047]/80 text-[#D97706] font-bold rounded-2xl text-[13px] transition-all flex items-center justify-center gap-1.5 group-hover:bg-[#FEF3C7]">
                  <Sparkles className="w-[14px] h-[14px]" /> Desbloquear Premium
                </div>
              </Link>
            ) : (
              <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[32px] flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white relative group">
                <div className={`w-[80px] h-[80px] bg-gradient-to-b ${activeSkin.gradient} rounded-full border-4 border-white shadow-md flex items-center justify-center mb-3 relative ring-1 ring-[#E2E8F0]`}>
                   <CompanionVisual stage={companion?.stage || 'huevo'} species={companion?.species || 'comun'} className="w-[50px] h-[50px]" />
                   <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#34D399] rounded-full border-[2px] border-white"></div>
                </div>
                
                <h3 className="text-[#333333] font-extrabold text-[18px] mb-1 flex items-center justify-center gap-2">
                  {companion?.name || 'Compañero Nabi'} 
                  <button 
                    onClick={() => {
                      setNewName(companion?.name || '');
                      setModalTab('skins');
                      setIsModalOpen(true);
                    }} 
                    className="p-1 rounded-full text-[#A0AABF] hover:bg-[#EEF0FF] hover:text-[#6C72F1] transition-colors"
                  >
                    <Edit2 className="w-[12px] h-[12px]" />
                  </button>
                </h3>
                
                <p className="text-[#8A95A5] text-[11px] font-medium mb-4">
                  Nivel {compLevel} • {getStageName(companion?.stage || 'huevo')}
                </p>
                
                <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-3 mb-5 w-full">
                  <p className="text-[12px] text-[#475569] font-medium leading-snug">
                    "{currentMessage}"
                  </p>
                </div>

                <div className="w-full flex items-center justify-center mb-2">
                  <div className="w-[80%] bg-[#EEF0FF] rounded-full h-[5px] overflow-hidden">
                    <div 
                      className="bg-[#6C72F1] h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[9px] font-black text-[#94A3B8] tracking-widest mb-4">
                  {currentLevelXp} / {xpNeededForNextLevel} XP
                </p>

                <button className="w-full py-3 bg-[#6C72F1] hover:bg-[#5C61E1] text-white rounded-2xl font-bold text-[12px] transition-all shadow-md tracking-wide">
                  Hablar con {companion?.name || 'Nabi'}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* MODAL DE SKINS Y NOMBRE */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex border-b border-gray-100 relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#1E293B] transition-colors p-2 z-10 bg-[#FAF8F5] rounded-full">
                  <X className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => setModalTab('name')}
                  className={`flex-1 py-5 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${modalTab === 'name' ? 'text-[#6C72F1] border-b-[3px] border-[#6C72F1] bg-[#EEF0FF]' : 'text-[#94A3B8] hover:bg-gray-50'}`}
                >
                  <Type className="w-4 h-4" /> Nombre
                </button>
                <button 
                  onClick={() => setModalTab('skins')}
                  className={`flex-1 py-5 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${modalTab === 'skins' ? 'text-[#6C72F1] border-b-[3px] border-[#6C72F1] bg-[#EEF0FF]' : 'text-[#94A3B8] hover:bg-gray-50'}`}
                >
                  <Palette className="w-4 h-4" /> Apariencia
                </button>
              </div>

              {modalTab === 'name' && (
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#EEF0FF] rounded-2xl flex items-center justify-center mb-6 border border-white shadow-sm">
                    <Sparkles className="w-8 h-8 text-[#6C72F1]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#333333] mb-2">Renombrar</h3>
                  <p className="text-[#8A95A5] text-sm mb-6 font-medium">
                    Dale un nombre único a tu compañero evolutivo.
                  </p>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej. Mariposita, Navi, Luz..."
                    className="w-full px-5 py-4 bg-[#F8FAFC] border border-transparent rounded-[20px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] transition-all mb-6 text-center text-lg shadow-inner"
                    maxLength={20}
                    autoFocus
                  />
                  <button 
                    onClick={saveCompanionName}
                    disabled={isSaving || !newName.trim()}
                    className="w-full py-4 bg-[#6C72F1] hover:bg-[#5C61E1] text-white rounded-[20px] font-extrabold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar nombre'}
                  </button>
                </div>
              )}

              {modalTab === 'skins' && (
                <div className="p-6 overflow-y-auto bg-[#F8FAFC]">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-extrabold text-[#333333] mb-1">Tu Colección</h3>
                    <p className="text-[#8A95A5] text-xs font-medium">Sube de nivel para desbloquear nuevas especies.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_SKINS.map((skin) => {
                      const isUnlocked = compLevel >= skin.level;
                      const isEquipped = companion?.species === skin.id || (skin.id === 'comun' && !companion?.species);
                      
                      return (
                        <div 
                          key={skin.id}
                          onClick={() => handleEquipSkin(skin.id, skin.level)}
                          className={`relative rounded-[24px] p-5 flex flex-col items-center text-center transition-all ${
                            isUnlocked ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : 'opacity-60 cursor-not-allowed grayscale'
                          } ${isEquipped ? 'bg-white ring-2 ring-[#6C72F1] shadow-md' : 'bg-white border border-gray-100 shadow-sm'}`}
                        >
                          {isEquipped && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#6C72F1] rounded-full flex items-center justify-center z-10 shadow-sm border border-white">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}

                          <div className={`w-20 h-20 bg-gradient-to-b ${skin.gradient} rounded-[20px] flex items-center justify-center mb-4 relative border border-white shadow-inner`}>
                            <CompanionVisual stage="mariposa" species={skin.id} className="w-12 h-12" />
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-slate-900/10 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                                <Lock className="w-5 h-5 text-slate-700" />
                              </div>
                            )}
                          </div>

                          <h4 className="font-extrabold text-[#333333] text-sm leading-tight mb-1.5">{skin.name}</h4>
                          
                          {isUnlocked ? (
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${isEquipped ? 'bg-[#EEF0FF] text-[#6C72F1]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                              {isEquipped ? 'Equipado' : 'Desbloqueado'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-[#D97706] bg-[#FFFBEB] px-3 py-1.5 rounded-xl flex items-center gap-1 uppercase tracking-widest">
                              <Lock className="w-3 h-3" /> Nivel {skin.level}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}