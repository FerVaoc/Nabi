"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Search, Flame, User, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ListaPacientesPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getLocalDateString = () => {
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const todayDateString = getLocalDateString();

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, full_name, selected_route, current_streak')
          .eq('psychologist_id', user.id);

        if (error) throw error;

        if (profiles) {
          const formattedPatients = await Promise.all(profiles.map(async (p) => {
            const names = p.full_name?.split(' ') || ['U', 'X'];
            let inits = names[0].charAt(0).toUpperCase();
            if (names.length > 1) inits += names[names.length - 1].charAt(0).toUpperCase();

            // LÓGICA DE COLORES ACTUALIZADA A LA PALETA PREMIUM (Sin romper el split)
            let themeColor = "border-white text-[#64748B] bg-[#F8FAFC]"; 
            let accentColor = "text-[#64748B]";
            
            if (p.selected_route === 'Ansiedad') { themeColor = "border-[#6C72F1]/30 text-[#6C72F1] bg-[#EEF0FF]"; accentColor = "text-[#6C72F1]"; }
            if (p.selected_route === 'Depresión') { themeColor = "border-[#FDE047]/50 text-[#D97706] bg-[#FFFBEB]"; accentColor = "text-[#D97706]"; }
            if (p.selected_route === 'Insomnio') { themeColor = "border-[#A68DD9]/40 text-[#A68DD9] bg-[#FAF5FF]"; accentColor = "text-[#A68DD9]"; }
            if (p.selected_route === 'Procrastinación') { themeColor = "border-[#3EAFA8]/40 text-[#0F766E] bg-[#F0FDFA]"; accentColor = "text-[#3EAFA8]"; }
            if (p.selected_route === 'Duelo') { themeColor = "border-[#FCA5A5]/40 text-[#BE123C] bg-[#FEF2F2]"; accentColor = "text-[#FCA5A5]"; }

            let totalTasks = 0;
            let completedTasks = 0;

            if (p.selected_route) {
              const { data: routeObj } = await supabase.from('routes').select('id').eq('name', p.selected_route).single();
              if (routeObj) totalTasks += 5; 
            }

            const { count: completedBaseCount } = await supabase
              .from('patient_tasks')
              .select('*', { count: 'exact', head: true })
              .eq('patient_id', p.id)
              .eq('assigned_date', todayDateString)
              .eq('is_completed', true);
            
            if (completedBaseCount) completedTasks += completedBaseCount;

            const { data: customTask } = await supabase
              .from('custom_tasks')
              .select('is_completed')
              .eq('patient_id', p.id)
              .eq('assigned_date', todayDateString)
              .maybeSingle();

            if (customTask) {
              totalTasks += 1;
              if (customTask.is_completed) completedTasks += 1;
            }

            const taskPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            return {
              id: p.id,
              name: p.full_name || 'Paciente',
              condition: p.selected_route || 'Ruta no definida',
              streak: p.current_streak || 0,
              tasks: taskPercentage,
              themeColor: themeColor,
              accentColor: accentColor,
              initials: inits
            };
          }));

          setPatients(formattedPatients);
        }
      } catch (error) {
        console.error("Error cargando directorio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-12 px-4 sm:px-6 lg:px-8 mt-4">
      
      {/* CABECERA Y BÚSQUEDA (Estilo Premium Glassmorphism) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white mb-10 relative overflow-hidden">
        
        {/* Decoraciones de fondo sutiles */}
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#6C72F1] opacity-[0.03] rounded-full blur-[20px] pointer-events-none"></div>

        <div className="relative w-full md:max-w-2xl z-10">
          <input 
            type="text" 
            placeholder="Buscar por nombre o diagnóstico..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/50 border border-white rounded-[24px] text-[#333333] font-bold focus:outline-none focus:bg-white focus:border-[#6C72F1] focus:ring-4 focus:ring-[#EEF0FF] transition-all placeholder:text-[#CBD5E1] shadow-inner text-[15px]"
          />
          <Search className="w-5 h-5 text-[#6C72F1] absolute left-5 top-4" strokeWidth={2.5} />
        </div>
        
        <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-white/50 backdrop-blur-md rounded-[24px] border border-white shadow-sm z-10">
          <div className="w-10 h-10 rounded-[16px] bg-[#EEF0FF] text-[#6C72F1] flex items-center justify-center shadow-inner border border-white">
             <Users className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
             <p className="text-[10px] font-black text-[#8A95A5] uppercase tracking-[0.15em] leading-none mb-1">Pacientes Totales</p>
             <p className="text-[20px] font-extrabold text-[#333333] leading-none">{patients.length}</p>
          </div>
        </div>
      </div>

      {/* CUADRÍCULA COMPLETA DE PACIENTES */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-xl rounded-[40px] border border-white shadow-sm">
          <div className="w-10 h-10 border-4 border-[#6C72F1]/30 border-t-[#6C72F1] rounded-full animate-spin mb-4"></div>
          <p className="text-[#8A95A5] font-bold">Buscando en tu directorio clínico...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl p-20 rounded-[40px] border border-dashed border-[#CBD5E1] text-center shadow-sm">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white">
             <User className="w-10 h-10 text-[#6C72F1]" strokeWidth={2} />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#333333] mb-2">No se encontraron pacientes</h3>
          <p className="text-[#8A95A5] text-[14px] max-w-md mx-auto leading-relaxed font-medium">
             Prueba escribiendo un nombre diferente o asegúrate de que el paciente ya esté vinculado a tu código.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <Link 
              href={`/psicologo/pacientes/${patient.id}`} 
              key={patient.id} 
              className={`bg-white/80 backdrop-blur-xl rounded-[32px] shadow-sm border-2 ${patient.themeColor.split(' ')[0]} flex flex-col p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
            >
              {/* Efecto de fondo sutil en hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${patient.themeColor.split(' ')[2]}`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                 {/* Avatar */}
                 <div className="relative mb-5">
                   <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center shadow-sm border border-white group-hover:scale-105 transition-transform duration-500 ${patient.themeColor.split(' ')[2]} ${patient.themeColor.split(' ')[1]}`}>
                     <span className="text-[24px] font-black tracking-widest">{patient.initials}</span>
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-white bg-[#3EAFA8] shadow-sm"></div>
                 </div>
                 
                 {/* Nombres */}
                 <h3 className="font-extrabold text-[#333333] text-center text-[16px] leading-tight mb-1.5 px-2">{patient.name}</h3>
                 <p className="text-[12px] font-medium text-[#8A95A5] text-center h-8 leading-tight px-2 line-clamp-2">{patient.condition}</p>

                 {/* Métricas Separadas */}
                 <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-5 border-t border-gray-100/50">
                   
                   <div className="bg-white/60 rounded-[20px] py-3 flex flex-col items-center justify-center shadow-sm border border-white">
                     <p className="text-[9px] font-black text-[#8A95A5] tracking-[0.15em] uppercase mb-1">Racha</p>
                     <p className="font-extrabold text-[#333333] text-[13px] flex items-center justify-center gap-1.5">
                       <Flame className={`w-4 h-4 ${patient.accentColor}`} strokeWidth={2.5} /> {patient.streak}d
                     </p>
                   </div>

                   <div className="bg-white/60 rounded-[20px] py-3 flex flex-col items-center justify-center shadow-sm border border-white">
                     <p className="text-[9px] font-black text-[#8A95A5] tracking-[0.15em] uppercase mb-1">Tareas</p>
                     <p className="font-extrabold text-[#333333] text-[13px] flex items-center justify-center gap-1.5">
                       <CheckCircle2 className={`w-4 h-4 ${patient.tasks === 100 ? 'text-[#3EAFA8]' : 'text-[#8A95A5]'}`} strokeWidth={2.5} /> {patient.tasks}%
                     </p>
                   </div>

                 </div>

                 {/* Pequeño indicador de acción en hover */}
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-full shadow-sm text-[#6C72F1] border border-white">
                    <ChevronRight className="w-4 h-4" strokeWidth={3} />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}