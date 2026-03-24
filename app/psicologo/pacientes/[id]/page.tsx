"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Flame, ShieldCheck, CheckCircle, Smile, Activity, ShieldAlert, PlusSquare, ArrowLeft, Lock, X, Wind, Headphones, BookOpen, Sun, Clock, Zap, Users, Edit2, Trash2, UserMinus } from 'lucide-react';

export default function DetallePacientePage() {
  const params = useParams(); 
  const router = useRouter();
  
  const [patient, setPatient] = useState<any>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [latestMood, setLatestMood] = useState<any>(null);
  
  const [routeTasks, setRouteTasks] = useState<any[]>([]);
  const [customTask, setCustomTask] = useState<any>(null); 
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [newTask, setNewTask] = useState({ title: '', description: '', duration: '10' });
  const [assigning, setAssigning] = useState(false);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Wind': return <Wind className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getLocalDateString = () => {
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        if (!params.id) return;
        
        const todayDateString = getLocalDateString();

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setPatient(profile);

        const { data: moods } = await supabase
          .from('mood_logs')
          .select('mood, logged_at, log_date')
          .eq('patient_id', params.id)
          .order('logged_at', { ascending: false })
          .limit(7);

        if (moods && moods.length > 0) {
          setLatestMood(moods[0]); 
          setMoodHistory([...moods].reverse()); 
        }

        if (profile?.selected_route) {
          const { data: routeObj } = await supabase
            .from('routes')
            .select('id')
            .eq('name', profile.selected_route)
            .single();

          if (routeObj) {
            const { data: catalogTasks } = await supabase
              .from('tasks_catalog')
              .select('*')
              .eq('route_id', routeObj.id);

            if (catalogTasks && catalogTasks.length > 0) {
              const dateNumber = parseInt(todayDateString.replace(/-/g, ''));
              let shuffled = [...catalogTasks].sort((a, b) => {
                 const pseudoRandomA = (a.id * dateNumber) % 100;
                 const pseudoRandomB = (b.id * dateNumber) % 100;
                 return pseudoRandomA - pseudoRandomB;
              });
              setRouteTasks(shuffled.slice(0, 5));
            }
          }
        }

        const { data: completedData } = await supabase
          .from('patient_tasks')
          .select('task_catalog_id')
          .eq('patient_id', params.id)
          .eq('assigned_date', todayDateString)
          .eq('is_completed', true);

        if (completedData) {
          setCompletedTasks(completedData.map(pt => pt.task_catalog_id));
        }

        const { data: customData } = await supabase
          .from('custom_tasks')
          .select('*')
          .eq('patient_id', params.id)
          .eq('assigned_date', todayDateString)
          .maybeSingle(); 

        if (customData) {
          setCustomTask(customData);
        }

      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetail();
  }, [params.id]);

  const openCreateModal = () => {
    setNewTask({ title: '', description: '', duration: '10' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!customTask) return;
    setNewTask({
      title: customTask.title,
      description: customTask.description,
      duration: customTask.duration_minutes.toString()
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;
    
    setAssigning(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario logueado");

      const todayDateString = getLocalDateString();

      if (isEditMode && customTask) {
        const { error: updateError } = await supabase
          .from('custom_tasks')
          .update({
            title: newTask.title,
            description: newTask.description,
            duration_minutes: parseInt(newTask.duration)
          })
          .eq('id', customTask.id);

        if (updateError) throw updateError;

      } else {
        const { error: taskError } = await supabase
          .from('custom_tasks')
          .insert([{
            patient_id: params.id,
            psychologist_id: user.id,
            title: newTask.title,
            description: newTask.description,
            duration_minutes: parseInt(newTask.duration),
            assigned_date: todayDateString,
            is_completed: false
          }]);

        if (taskError) throw taskError;

        await supabase.from('notifications').insert([{
          user_id: params.id,
          title: 'Nueva tarea de tu Doc 👨🏽‍⚕️',
          message: `Te han asignado la actividad: "${newTask.title}". ¡Revisa tu plan de hoy!`,
          type: 'task'
        }]);
      }

      setIsModalOpen(false);
      window.location.reload();
      
    } catch (error) {
      console.error("Error al procesar la tarea:", error);
      alert("Hubo un error al guardar la tarea.");
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!customTask) return;
    
    const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar esta tarea? El paciente ya no la verá en su plan de hoy.");
    if (!isConfirmed) return;

    try {
      const { error } = await supabase
        .from('custom_tasks')
        .delete()
        .eq('id', customTask.id);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      alert("Hubo un error al intentar eliminar la tarea.");
    }
  };

  const handleUnlinkPatient = async () => {
    const isConfirmed = window.confirm(`¿Estás seguro de que deseas desvincular a ${patient?.full_name}? Ya no tendrás acceso a su información clínica ni a su progreso.`);
    if (!isConfirmed) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ psychologist_id: null })
        .eq('id', params.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        alert("Ups, no se pudo desvincular. Parece que falta darle un permiso a Supabase (RLS).");
        return; 
      }

      await supabase.from('notifications').insert([{
        user_id: params.id,
        title: 'Vínculo finalizado',
        message: 'Tu psicólogo ha desvinculado tu cuenta de su directorio. Tus datos vuelven a ser 100% privados.',
        type: 'unlink'
      }]);

      window.location.href = '/psicologo/pacientes'; 

    } catch (error) {
      console.error("Error al desvincular:", error);
      alert("Hubo un error al intentar desvincular al paciente.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
       <div className="w-12 h-12 border-4 border-[#6C72F1]/30 border-t-[#6C72F1] rounded-full animate-spin mb-4"></div>
       <p className="text-[#1E293B] font-extrabold text-[15px]">Cargando expediente clínico...</p>
    </div>
  );

  if (!patient) return (
    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
       <div className="w-16 h-16 bg-[#FEF2F2] rounded-[24px] flex items-center justify-center mb-4 border border-white shadow-sm">
         <ShieldAlert className="w-8 h-8 text-[#EF4444]" />
       </div>
       <p className="text-[#333333] font-extrabold text-[18px]">Paciente no encontrado</p>
       <p className="text-[#8A95A5] text-[14px]">El vínculo pudo haber sido revocado.</p>
    </div>
  );

  const names = patient.full_name?.split(' ') || ['U', 'X'];
  const initials = names[0].charAt(0) + (names[names.length - 1]?.charAt(0) || '');

  const allShared = patient.share_tasks && patient.share_streak && patient.share_emotion;
  
  const baseCompletedCount = routeTasks.filter(task => completedTasks.includes(task.id)).length;
  const totalCount = routeTasks.length + (customTask ? 1 : 0);
  const completedCount = baseCompletedCount + (customTask?.is_completed ? 1 : 0);
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const LockedOverlay = ({ message }: { message: string }) => (
    <div className="absolute inset-0 z-20 backdrop-blur-xl bg-white/60 rounded-[inherit] flex flex-col items-center justify-center border border-white transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]">
      <div className="w-12 h-12 bg-white rounded-[20px] flex items-center justify-center mb-3 shadow-sm border border-[#E2E8F0]">
        <Lock className="w-5 h-5 text-[#8A95A5]" />
      </div>
      <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.15em] text-center px-6 leading-relaxed">{message}</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-12 px-4 sm:px-6 lg:px-8">

      {/* ENCABEZADO PRINCIPAL (Glassmorphism) */}
      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden mb-8">
        
        <div className="absolute -left-20 -top-20 w-48 h-48 bg-[#6C72F1] opacity-[0.03] rounded-full blur-[40px] pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 w-full md:w-auto relative z-10 text-center sm:text-left">
          <div className="relative">
            <div className="w-24 h-24 bg-[#F8FAFC] rounded-[32px] flex items-center justify-center shadow-inner border border-white">
              <span className="text-[28px] font-black text-[#6C72F1] tracking-widest">{initials.toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3EAFA8] rounded-full border-[3px] border-white shadow-sm"></div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
              <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#333333] leading-none tracking-tight">{patient.full_name}</h2>
              <span className="bg-[#EEF0FF] border border-white text-[#6C72F1] text-[10px] px-3 py-1.5 rounded-[10px] font-black uppercase tracking-[0.2em] shadow-sm">Activo</span>
            </div>
            <p className="text-[#8A95A5] text-[14px] font-medium mb-3">Ruta clínica: <strong className="text-[#3EAFA8]">{patient.selected_route || 'No definida'}</strong></p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
               {allShared ? (
                 <span className="bg-[#F0FDFA] text-[#0F766E] border border-white text-[10px] font-bold px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 shadow-sm">
                   <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} /> Privacidad: Acceso total
                 </span>
               ) : (
                 <span className="bg-[#FEF2F2] text-[#BE123C] border border-white text-[10px] font-bold px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 shadow-sm">
                   <Lock className="w-3.5 h-3.5" strokeWidth={2.5} /> Privacidad: Datos restringidos
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <button 
            onClick={handleUnlinkPatient}
            className="flex-1 sm:flex-none px-6 py-4 font-extrabold text-[13px] uppercase tracking-wider rounded-[20px] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#FECACA] bg-white hover:bg-[#FEF2F2] text-[#EF4444]"
            title="Finalizar seguimiento"
          >
            <UserMinus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Desvincular</span>
          </button>

          <button 
            onClick={openCreateModal}
            disabled={!!customTask}
            className={`flex-1 sm:flex-none px-8 py-4 font-extrabold text-[13px] uppercase tracking-wider rounded-[20px] transition-all flex items-center justify-center gap-2 shadow-sm border ${customTask ? 'bg-white/50 text-[#CBD5E1] border-white cursor-not-allowed' : 'bg-[#6C72F1] hover:bg-[#5C61E1] text-white border-transparent shadow-[0_4px_15px_rgba(108,114,241,0.2)] hover:-translate-y-0.5'}`}
            title={customTask ? "Ya asignaste una tarea hoy" : "Asignar nueva tarea"}
          >
            <PlusSquare className="w-4 h-4" strokeWidth={2.5} />
            Asignar tarea
          </button>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Racha */}
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group h-[200px] flex flex-col justify-between">
          {!patient.share_streak && <LockedOverlay message="Oculto por el paciente" />}
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.15em]">Racha actual</p>
            <div className="w-12 h-12 rounded-[20px] bg-[#FFFBEB] text-[#D97706] flex items-center justify-center transition-transform group-hover:scale-105 border border-white shadow-sm">
               <Flame className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-[40px] font-black text-[#333333] tracking-tight leading-none mb-1">
              {patient.current_streak || 0} <span className="text-[18px] text-[#94A3B8] font-bold">días</span>
            </h3>
            <p className="text-[12px] font-medium text-[#8A95A5]">Actividad constante</p>
          </div>
        </div>

        {/* Tareas Hoy */}
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group h-[200px] flex flex-col justify-between">
          {!patient.share_tasks && <LockedOverlay message="Oculto por el paciente" />}
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.15em]">Tareas hoy</p>
            <div className="w-12 h-12 rounded-[20px] bg-[#EEF0FF] text-[#6C72F1] flex items-center justify-center transition-transform group-hover:scale-105 border border-white shadow-sm">
               <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-[40px] font-black text-[#333333] tracking-tight leading-none mb-1">{progressPercent}%</h3>
            <p className="text-[12px] font-medium text-[#8A95A5]">{completedCount} de {totalCount} completadas</p>
          </div>
        </div>

        {/* Último Ánimo */}
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group h-[200px] flex flex-col justify-between">
          {!patient.share_emotion && <LockedOverlay message="Oculto por el paciente" />}
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.15em]">Último Ánimo</p>
            <div className="w-12 h-12 rounded-[20px] bg-[#E5F7F4] text-[#3EAFA8] flex items-center justify-center transition-transform group-hover:scale-105 border border-white shadow-sm">
               <Smile className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-[28px] font-black text-[#333333] tracking-tight leading-none mb-2 uppercase">
              {latestMood ? latestMood.mood : 'N/A'}
            </h3>
            <p className={`text-[11px] font-extrabold uppercase tracking-wider ${latestMood && latestMood.log_date === getLocalDateString() ? 'text-[#3EAFA8]' : 'text-[#94A3B8]'}`}>
              {latestMood && latestMood.log_date === getLocalDateString() ? 'Registrado hoy' : 'Registros pasados'}
            </p>
          </div>
        </div>

        {/* Estado Clínico */}
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group h-[200px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.15em]">Estado Clínico</p>
            <div className="w-12 h-12 rounded-[20px] bg-[#F8FAFC] text-[#64748B] flex items-center justify-center transition-transform group-hover:scale-105 border border-white shadow-sm">
               <Activity className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-[28px] font-black text-[#333333] tracking-tight leading-none mb-2">Estable</h3>
            <p className="text-[12px] font-medium text-[#8A95A5]">Sin alertas críticas</p>
          </div>
        </div>
      </div>

      {/* GRÁFICA Y TAREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRÁFICA DE TENDENCIAS */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-sm border border-white relative overflow-hidden flex flex-col min-h-[400px]">
           {!patient.share_emotion && <LockedOverlay message="Visualización de estado emocional restringida" />}
           
           <div className="flex justify-between items-start mb-8">
             <div>
               <h3 className="text-[22px] font-extrabold text-[#333333] mb-1">Tendencias Emocionales</h3>
               <p className="text-[14px] text-[#8A95A5] font-medium">Últimos registros de ánimo del paciente</p>
             </div>
           </div>

           <div className="flex items-end justify-between px-2 sm:px-6 relative flex-1 pt-6">
              
              {/* Líneas Guía */}
              <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between py-6 pointer-events-none opacity-30">
                 <div className="border-b border-dashed border-[#8A95A5] w-full"></div>
                 <div className="border-b border-dashed border-[#8A95A5] w-full"></div>
                 <div className="border-b border-dashed border-[#8A95A5] w-full"></div>
              </div>

              {moodHistory.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center relative z-10">
                  <p className="text-[#64748B] font-bold bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white">Aún no hay registros en la bitácora.</p>
                </div>
              ) : (
                moodHistory.map((m: any, i: number) => {
                  let altura = '20%'; 
                  let color = 'bg-[#CBD5E1]'; // Neutral default
                  let emoji = '😢';
                  let bgSoft = 'bg-[#F8FAFC]';
                  
                  if (m.mood === 'feliz') { altura = '100%'; color = 'bg-[#FDE047]'; emoji = '😊'; bgSoft = 'bg-[#FFFBEB]'; }
                  else if (m.mood === 'ansioso') { altura = '75%'; color = 'bg-[#FCA5A5]'; emoji = '😬'; bgSoft = 'bg-[#FEF2F2]'; }
                  else if (m.mood === 'neutral') { altura = '50%'; color = 'bg-[#6C72F1]'; emoji = '😐'; bgSoft = 'bg-[#EEF0FF]'; }
                  else if (m.mood === 'triste') { altura = '25%'; color = 'bg-[#93C5FD]'; emoji = '😢'; bgSoft = 'bg-[#EFF6FF]'; }
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-4 w-full relative z-10 group">
                      
                      {/* Tooltip Hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E293B] text-white text-[10px] font-bold px-3 py-2 rounded-xl shadow-md pointer-events-none whitespace-nowrap z-20">
                        {m.mood.toUpperCase()}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E293B] rotate-45"></div>
                      </div>

                      {/* Barra Visual */}
                      <div className={`w-8 sm:w-12 h-48 ${bgSoft} rounded-t-[16px] flex items-end justify-center overflow-hidden border-x border-t border-white shadow-inner`}>
                        <div className={`w-full ${color} transition-all duration-1000 ease-out flex justify-center`} style={{ height: altura }}>
                           <span className="mt-2 text-[16px] sm:text-[20px] drop-shadow-sm opacity-80">{emoji}</span>
                        </div>
                      </div>

                      {/* Etiqueta Día */}
                      <span className="text-[10px] sm:text-[11px] text-[#8A95A5] uppercase font-black tracking-wider">
                        {new Date(m.log_date + 'T12:00:00').toLocaleDateString('es', {weekday: 'short'})}
                      </span>
                    </div>
                  );
                })
              )}
           </div>
        </div>

        {/* LISTA DE TAREAS */}
        <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-sm border border-white relative overflow-hidden flex flex-col min-h-[400px]">
          {!patient.share_tasks && <LockedOverlay message="Acceso a tareas restringido" />}
          
          <h3 className="font-extrabold text-[#333333] text-[22px] mb-8">Plan de Hoy</h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {routeTasks.length === 0 && !customTask ? (
              <div className="flex flex-col items-center justify-center h-full pt-10">
                <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 border border-white shadow-sm">
                  <CheckCircle className="w-6 h-6 text-[#CBD5E1]" />
                </div>
                <p className="text-[#8A95A5] text-[14px] font-medium text-center">No hay tareas asignadas para hoy.</p>
              </div>
            ) : (
              <>
                {/* Tarea Personalizada del Psicólogo */}
                {customTask && (
                  <div className={`p-5 rounded-[24px] border transition-all flex items-start gap-4 group relative ${customTask.is_completed ? 'bg-[#EEF0FF]/50 border-white opacity-70' : 'bg-white border-[#FDE047]/50 shadow-md hover:shadow-lg hover:-translate-y-0.5'}`}>
                    
                    <div className={`w-10 h-10 rounded-[16px] flex items-center justify-center flex-shrink-0 shadow-sm border border-white ${customTask.is_completed ? 'bg-[#6C72F1] text-white' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
                      {customTask.is_completed ? <CheckCircle className="w-5 h-5" strokeWidth={2.5} /> : <Users className="w-5 h-5" strokeWidth={2.5} />}
                    </div>
                    
                    <div className="flex-1 pr-10">
                      <h4 className={`text-[15px] font-extrabold mb-1 leading-tight ${customTask.is_completed ? 'text-[#8A95A5] line-through decoration-1' : 'text-[#333333]'}`}>{customTask.title}</h4>
                      <p className={`text-[12px] leading-relaxed mb-3 font-medium line-clamp-2 ${customTask.is_completed ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>{customTask.description}</p>
                      <span className="text-[9px] font-black text-[#D97706] uppercase tracking-[0.15em] bg-[#FFFBEB] px-3 py-1.5 rounded-[10px] border border-[#FDE047]/30 shadow-sm">Asignada por ti</span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md rounded-xl p-1.5 shadow-sm border border-gray-100">
                      <button onClick={openEditModal} className="p-2 text-[#6C72F1] hover:text-[#5C61E1] hover:bg-[#EEF0FF] rounded-lg transition-colors" title="Editar tarea">
                        <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                      <button onClick={handleDeleteTask} className="p-2 text-[#EF4444]/60 hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Eliminar tarea">
                        <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tareas del Catálogo del Paciente */}
                {routeTasks.map((task) => {
                  const isCompleted = completedTasks.includes(task.id);
                  return (
                    <div key={task.id} className={`p-4 md:p-5 rounded-[24px] border transition-all flex items-center gap-4 ${isCompleted ? 'bg-[#EEF0FF]/50 border-white opacity-70' : 'bg-white/60 border-white shadow-sm'}`}>
                      <div className={`w-10 h-10 rounded-[16px] flex items-center justify-center flex-shrink-0 shadow-sm border border-white ${isCompleted ? 'bg-[#6C72F1] text-white' : 'bg-[#F8FAFC] text-[#64748B]'}`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" strokeWidth={2.5} /> : getIcon(task.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-[14px] font-extrabold leading-snug ${isCompleted ? 'text-[#8A95A5] line-through decoration-1' : 'text-[#333333]'}`}>{task.title}</h4>
                        <p className="text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mt-1">{task.duration_minutes} MIN</p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL DE ASIGNACIÓN (Diseño Premium Glassmorphism) */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E293B]/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white/90 backdrop-blur-xl rounded-[40px] w-full max-w-lg p-10 shadow-[0_10px_50px_rgba(0,0,0,0.1)] relative zoom-in-95 animate-in duration-200 border border-white">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-[#8A95A5] hover:text-[#1E293B] transition-colors bg-white p-2.5 rounded-full shadow-sm border border-gray-100 hover:scale-110"
            >
               <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
            
            <div className="w-16 h-16 bg-[#EEF0FF] rounded-[24px] flex items-center justify-center text-[#6C72F1] mb-6 border border-white shadow-sm">
              {isEditMode ? <Edit2 className="w-7 h-7" strokeWidth={2.5} /> : <PlusSquare className="w-7 h-7" strokeWidth={2.5} />}
            </div>
            
            <h2 className="text-[28px] font-extrabold text-[#333333] mb-2 tracking-tight leading-tight">
              {isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
            <p className="text-[14px] text-[#64748B] mb-8 font-medium leading-relaxed">
              {isEditMode ? 'Modifica las instrucciones de la actividad asignada.' : `Diseña un ejercicio específico para el progreso de ${patient.full_name}.`}
            </p>
            
            <form onSubmit={handleAssignTask} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 pl-2">Título de la actividad</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Escribir 3 cosas positivas..."
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all placeholder:text-[#CBD5E1] shadow-inner text-[15px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 pl-2">Instrucciones</label>
                <textarea 
                  required
                  placeholder="Explica brevemente qué debe hacer el paciente..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-medium focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all resize-none h-32 placeholder:text-[#CBD5E1] shadow-inner text-[14px] leading-relaxed custom-scrollbar"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#6C72F1] uppercase tracking-[0.15em] mb-2 pl-2">Duración estimada</label>
                <select 
                  value={newTask.duration}
                  onChange={e => setNewTask({...newTask, duration: e.target.value})}
                  className="w-full px-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all appearance-none cursor-pointer shadow-inner text-[15px]"
                >
                  <option value="5">5 minutos</option>
                  <option value="10">10 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={assigning}
                  className="w-full bg-[#6C72F1] hover:bg-[#5C61E1] text-white font-extrabold py-4 rounded-[20px] transition-all duration-300 shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:scale-100 disabled:hover:translate-y-0 text-[14px] uppercase tracking-wider"
                >
                  {assigning ? 'Guardando...' : (isEditMode ? 'Actualizar tarea' : 'Enviar al paciente')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}