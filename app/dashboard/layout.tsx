"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, CheckSquare, TrendingUp, Sparkles, Users, Settings, Bell, LogOut, Menu, X, Flame, Info, Crown } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("Cargando...");
  const [firstName, setFirstName] = useState("");
  const [initials, setInitials] = useState("");
  const [userPlan, setUserPlan] = useState("gratis");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setUserId(user.id);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, plan')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFullName(profile.full_name || "Usuario");
          setUserPlan(profile.plan || "gratis");
          
          if (profile.full_name) {
            const names = profile.full_name.split(' ');
            setFirstName(names[0]);
            let inits = names[0].charAt(0).toUpperCase();
            if (names.length > 1) inits += names[names.length - 1].charAt(0).toUpperCase();
            setInitials(inits);
          }
        }

        const { data: notifs } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notifs) {
          setNotifications(notifs);
          setUnreadCount(notifs.filter(n => !n.is_read).length);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchUserAndNotifications();
  }, [router]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const deleteNotification = async (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1)); 
    try { await supabase.from('notifications').delete().eq('id', id); } catch (error) {}
  };

  const clearAllNotifications = async () => {
    if (!userId) return;
    setNotifications([]);
    setUnreadCount(0);
    try { await supabase.from('notifications').delete().eq('user_id', userId); } catch (error) {}
  };

  const markAsRead = async () => {
    if (unreadCount === 0 || !userId) return;
    setUnreadCount(0); 
    try { await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false); } catch (error) {}
  };

  const toggleNotifications = () => {
    if (!isNotifOpen) { markAsRead(); setIsMenuOpen(false); }
    setIsNotifOpen(!isNotifOpen);
  };

  const getNotifIcon = (type: string) => {
    switch(type) {
      case 'task': return <CheckSquare className="w-5 h-5 text-[#3EAFA8]" />;
      case 'streak': return <Flame className="w-5 h-5 text-[#FDE047]" />;
      default: return <Info className="w-5 h-5 text-[#6C72F1]" />;
    }
  };

  const menuItems = [
    { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Progreso', path: '/dashboard/progreso', icon: TrendingUp },
    { name: 'Descubrir', path: '/dashboard/recomendaciones', icon: Sparkles },
    { name: 'Mi Doc', path: '/dashboard/psicologo', icon: Users },
  ];

  const getHeaderTexts = () => {
    const saludo = firstName ? `¡Hola, ${firstName}!` : 'Cargando...';
    if (pathname === '/dashboard') return { title: saludo, subtitle: 'Tómate un momento para ti. ¿Cómo te sientes hoy?' };
    if (pathname?.includes('/progreso')) return { title: 'Tu Evolución', subtitle: 'Observa cómo has avanzado paso a paso.' };
    if (pathname?.includes('/recomendaciones')) return { title: 'Para ti hoy', subtitle: 'Recursos seleccionados para tu bienestar mental.' };
    if (pathname?.includes('/psicologo')) return { title: 'Mi Psicólogo', subtitle: 'Mantente conectado con tu profesional de la salud.' };
    if (pathname?.includes('/settings/plan')) return { title: 'Planes en Nabi', subtitle: 'Desbloquea todo el potencial de tu compañero.' }; 
    if (pathname?.includes('/settings')) return { title: 'Ajustes de Perfil', subtitle: 'Personaliza tu experiencia.' };
    return { title: 'Nabi', subtitle: 'Tu espacio seguro' };
  };

  const { title, subtitle } = getHeaderTexts();

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1E293B] bg-transparent">
      
      {/* ======================================================== */}
      {/* NAVEGACIÓN SUPERIOR (FULL WIDTH) */}
      {/* ======================================================== */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center gap-4">
          
          {/* LADO IZQUIERDO: Logo y Texto SIEMPRE VISIBLES */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform duration-300">
               <Image 
                 src="/logo.png" 
                 alt="Logo Nabi" 
                 fill 
                 className="object-contain"
               />
            </div>
            {/* Texto Nabi */}
            <span className="text-[20px] font-black text-[#6C72F1] tracking-tight">Nabi</span>
          </Link>

          {/* CENTRO: Menú de Navegación (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`relative flex items-center h-full px-1 text-[14px] font-bold transition-colors duration-300 ${
                    isActive 
                       ? 'text-[#6C72F1]' 
                       : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {item.name}
                  {/* Línea indicadora de activo en la base del header */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6C72F1] rounded-t-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* LADO DERECHO: Acciones (Notificaciones, Settings, Perfil, Logout) */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">

            {/* Notificaciones */}
            <div className="relative flex items-center h-full" ref={notifRef}>
              <button 
                onClick={toggleNotifications}
                className="text-[#6C72F1] hover:text-[#5C61E1] transition-colors relative p-2 rounded-full hover:bg-[#EEF0FF]"
              >
                <Bell className="w-[22px] h-[22px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-[10px] h-[10px] bg-[#EF4444] rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Menú de Notificaciones */}
              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 md:w-[400px] bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                    <h3 className="font-extrabold text-[#1E293B]">Notificaciones</h3>
                    {notifications.length > 0 && (
                      <button onClick={clearAllNotifications} className="text-[11px] font-bold text-[#94A3B8] hover:text-[#EF4444] transition-colors bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                        Limpiar todo
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 border border-white shadow-sm">
                          <Bell className="w-6 h-6 text-[#94A3B8]" />
                        </div>
                        <p className="text-base font-bold text-[#1E293B] mb-1">Todo al día</p>
                        <p className="text-sm text-[#64748B] max-w-[200px] leading-relaxed">No tienes nuevas notificaciones en este momento.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="px-6 py-4 border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors flex gap-4 relative group">
                          <div className="w-10 h-10 rounded-full bg-[#EEF0FF] border border-white shadow-sm flex items-center justify-center flex-shrink-0">
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="flex-1 pr-4 pt-0.5">
                            <h4 className="text-[13px] font-extrabold text-[#1E293B] mb-0.5">{notif.title}</h4>
                            <p className="text-[12px] text-[#64748B] leading-relaxed font-medium">{notif.message}</p>
                            <p className="text-[9px] font-bold text-[#94A3B8] mt-2 uppercase tracking-wider">
                              {new Date(notif.created_at).toLocaleDateString('es', { weekday: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="absolute top-4 right-4 text-[#CBD5E1] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full p-1.5 shadow-sm border border-gray-100 hover:scale-110"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Ajustes (Settings) */}
            <Link href="/dashboard/settings" className="hidden lg:flex text-[#6C72F1] hover:text-[#5C61E1] transition-colors p-2 rounded-full hover:bg-[#EEF0FF]">
               <Settings className="w-[22px] h-[22px]" />
            </Link>

            {/* Perfil del Usuario (Pastilla con Nombre y Plan) */}
            <Link href="/dashboard/settings" className="hidden lg:flex items-center gap-3 bg-white pl-1.5 pr-5 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group cursor-pointer ml-1">
              <div className="w-9 h-9 bg-[#EEF0FF] rounded-full flex items-center justify-center text-[#6C72F1] font-black text-xs shadow-inner transition-transform group-hover:scale-105">
                 {initials || "👤"}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[13px] font-extrabold text-[#1E293B] truncate max-w-[120px] leading-tight mb-0.5">{firstName}</p>
                {userPlan === 'premium' ? (
                  <span className="text-[9px] font-black text-[#D97706] tracking-widest uppercase flex items-center gap-1 w-fit leading-none">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                ) : (
                  <span className="text-[9px] font-black text-[#8A95A5] tracking-widest uppercase flex items-center gap-1 group-hover:text-[#6C72F1] transition-colors w-fit leading-none">
                    Plan Básico <Sparkles className="w-[10px] h-[10px]" />
                  </span>
                )}
              </div>
            </Link>

            {/* Botón Logout (Círculo visible en Desktop) */}
            <button 
              onClick={handleLogout} 
              className="hidden lg:flex items-center justify-center w-10 h-10 bg-white text-[#EF4444] rounded-full hover:bg-[#FEF2F2] transition shadow-sm border border-[#FCA5A5] ml-1 group" 
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Menu Hamburguesa (Solo Móvil) */}
            <div className="relative lg:hidden flex items-center" ref={menuRef}>
              <button 
                onClick={() => { setIsMenuOpen(!isMenuOpen); if (!isMenuOpen) setIsNotifOpen(false); }}
                className="bg-white text-[#64748B] w-10 h-10 rounded-full hover:bg-[#F8FAFC] transition shadow-sm border border-[#E2E8F0] flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[24px] shadow-2xl border border-[#E2E8F0] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center text-center">
                     <div className="w-12 h-12 bg-[#EEF0FF] rounded-full flex items-center justify-center text-[#6C72F1] font-black text-lg shadow-inner mb-2 border-2 border-white">
                        {initials || "👤"}
                     </div>
                     <p className="text-sm font-extrabold text-[#1E293B]">{fullName}</p>
                     <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-1">Suscripción {userPlan}</p>
                  </div>
                  
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-6 py-4 text-sm transition-colors ${
                          isActive 
                            ? 'bg-[#EEF0FF] text-[#6C72F1] font-extrabold border-l-[3px] border-[#6C72F1]' 
                            : 'text-[#64748B] font-bold hover:bg-[#F8FAFC] hover:text-[#1E293B] border-l-[3px] border-transparent'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  <div className="border-t border-[#E2E8F0] my-1"></div>
                  
                  <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors border-l-[3px] border-transparent">
                    <Settings className="w-4 h-4" /> Ajustes de Perfil
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors border-l-[3px] border-transparent">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* ÁREA PRINCIPAL: Título y Contenido */}
      {/* ======================================================== */}
      <main className="w-full flex-1 flex flex-col">
        
        {/* Títulos condicionales: Ocultos en Home y en Recomendaciones porque ya tienen sus propias cabeceras grandotas */}
        {pathname !== '/dashboard' && pathname !== '/dashboard/recomendaciones' && (
          <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 pt-10 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E293B] tracking-tight">{title}</h1>
            <p className="text-[#64748B] mt-1.5 font-medium">{subtitle}</p>
          </div>
        )}

        {/* Renderizado de páginas hijas */}
        {children}
        
      </main>

    </div>
  );
}