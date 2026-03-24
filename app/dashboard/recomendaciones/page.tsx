"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BrainCircuit, Headphones, Mic2, BookOpen, Activity, PlayCircle, ExternalLink, Video } from 'lucide-react';

export default function RecomendacionesPage() {
  const [selectedRoute, setSelectedRoute] = useState("General");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Saber la ruta del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('selected_route')
          .eq('id', user.id)
          .single();

        const userRoute = profile?.selected_route || "General";
        setSelectedRoute(userRoute);

        // 2. Traer el contenido REAL desde Supabase para esa ruta
        let { data: content } = await supabase
          .from('content_catalog')
          .select('*')
          .eq('route', userRoute)
          .order('created_at', { ascending: false });

        // Si por alguna razón la ruta está vacía, le damos el contenido General
        if (!content || content.length === 0) {
          const fallback = await supabase.from('content_catalog').select('*').eq('route', 'General');
          content = fallback.data;
        }

        setRecommendations(content || []);

      } catch (error) {
        console.error("Error al cargar contenido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Función para abrir el contenido en una nueva pestaña
  const openContent = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Función mágica para dar colores e íconos dependiendo de la categoría
  const getVisuals = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('video')) return { icon: <Video className="w-8 h-8" />, topBg: 'bg-[#FFFBEB]', color: 'text-[#D97706]' };
    if (cat.includes('podcast') || cat.includes('audio')) return { icon: <Mic2 className="w-8 h-8" />, topBg: 'bg-[#E5F7F4]', color: 'text-[#3EAFA8]' };
    if (cat.includes('meditación') || cat.includes('meditacion')) return { icon: <Headphones className="w-8 h-8" />, topBg: 'bg-[#EEF0FF]', color: 'text-[#6C72F1]' };
    if (cat.includes('lectura')) return { icon: <BookOpen className="w-8 h-8" />, topBg: 'bg-[#FAF5FF]', color: 'text-[#A68DD9]' };
    return { icon: <Activity className="w-8 h-8" />, topBg: 'bg-[#F8FAFC]', color: 'text-[#64748B]' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
         <div className="w-12 h-12 border-4 border-[#6C72F1]/30 border-t-[#6C72F1] rounded-full animate-spin mb-4"></div>
         <p className="text-[#1E293B] font-extrabold text-[15px]">Preparando tu biblioteca mental...</p>
      </div>
    );
  }

  return (
    // AQUÍ ESTÁ LA CORRECCIÓN: Agregué px-4 (o px-6) para los bordes laterales y mt-8 para separarlo de la barra superior.
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-12 px-4 sm:px-6 lg:px-8 mt-8">
      
      {/* HEADER DINÁMICO (ESTILO PREMIUM GLASSMORPHISM) */}
      <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-white mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Decoraciones de fondo sutiles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#6C72F1] opacity-[0.05] rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#3EAFA8] opacity-[0.05] rounded-full blur-[40px] pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#333333] flex items-center gap-3 mb-1 leading-tight tracking-tight">
            Descubrir
          </h2>
          <p className="text-[#8A95A5] text-[15px] font-medium">
            Contenido seleccionado específicamente para tu ruta: <span className="text-[#6C72F1] font-black uppercase tracking-widest ml-1">{selectedRoute}</span>
          </p>
        </div>
        
        <div className="w-16 h-16 bg-[#EEF0FF] rounded-2xl flex items-center justify-center text-[#6C72F1] shadow-inner border border-white relative z-10 flex-shrink-0">
          <BrainCircuit className="w-8 h-8" strokeWidth={2.5} />
        </div>
      </div>

      {/* CUADRÍCULA DE CONTENIDO REAL */}
      {recommendations.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[32px] border border-dashed border-[#CBD5E1] shadow-sm">
          <p className="text-[#64748B] font-bold text-[15px]">Próximamente agregaremos contenido para esta ruta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 relative z-10">
          
          {recommendations.map((item: any) => {
            const visuals = getVisuals(item.category);
            
            return (
              <div 
                key={item.id} 
                className="bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-sm border border-white flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                onClick={() => openContent(item.url)}
              >
                {/* Mitad superior (Fondo pastel suave + Icono limpio) */}
                <div className={`${visuals.topBg} h-40 flex items-center justify-center relative overflow-hidden`}>
                  <div className={`absolute inset-0 opacity-[0.02] bg-gradient-to-tr from-black to-transparent`}></div>
                  <div className={`w-16 h-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center ${visuals.color} group-hover:scale-110 transition-transform duration-500 relative z-10 border border-white/50`}>
                    {visuals.icon}
                  </div>
                  {/* Etiqueta de Tipo flotante */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-[12px] shadow-sm border border-white flex items-center gap-1.5">
                    <span className="text-[9px] font-black tracking-widest uppercase text-[#333333]">{item.category}</span>
                  </div>
                </div>

                {/* Mitad inferior (Contenido) */}
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
                  
                  {/* Duración */}
                  <div className="mb-3">
                    <span className="text-[10px] font-extrabold text-[#6C72F1] bg-[#EEF0FF] border border-white px-3 py-1.5 rounded-xl shadow-sm inline-block">
                      ⏱ {item.duration_minutes} MIN
                    </span>
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-[16px] font-extrabold text-[#333333] mb-6 leading-snug group-hover:text-[#6C72F1] transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  
                  {/* Botón Acción */}
                  <button className={`mt-auto w-full flex items-center justify-center gap-2 bg-[#F8FAFC] group-hover:bg-[#6C72F1] text-[#64748B] group-hover:text-white font-extrabold py-3.5 rounded-[20px] transition-colors duration-300 shadow-sm text-[13px] tracking-wide border border-[#E2E8F0] group-hover:border-[#6C72F1]`}>
                    {item.category.toLowerCase().includes('lectura') ? <ExternalLink className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />} 
                    {item.category.toLowerCase().includes('lectura') ? 'Leer artículo' : 'Reproducir'}
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}