import { Heart, Sparkles, Sun, ShieldCheck } from "lucide-react";

export default function Benefits() {
    return (
        <section className="px-6 md:px-16 py-24 bg-[#FAF8F5] relative overflow-hidden">
            
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent opacity-50"></div>
            
            <div className="text-center max-w-3xl mx-auto mb-20 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="text-[#3EAFA8] font-black tracking-[0.2em] uppercase text-[11px] mb-4 block bg-[#E5F7F4] w-fit mx-auto px-4 py-1.5 rounded-full border border-white shadow-sm">Tu proceso, a tu ritmo</span>
                <h2 className="text-[36px] md:text-[48px] font-black text-[#333333] mb-6 tracking-tight leading-tight">
                    ¿Cómo te ayuda Nabi?
                </h2>
                <p className="text-[#8A95A5] text-[16px] md:text-[18px] font-medium leading-relaxed max-w-2xl mx-auto">
                    Pequeños pasos diarios que construyen grandes cambios en tu salud mental. Todo desde la palma de tu mano.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto relative z-10">

                {/* Beneficio 1 */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] group">
                    <div className="w-16 h-16 bg-[#FAF5FF] rounded-[20px] flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500 border border-white">
                        <Heart className="text-[#A68DD9]" size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-extrabold text-[20px] text-[#333333] mb-3">Acompañamiento</h3>
                    <p className="text-[#8A95A5] font-medium leading-relaxed text-[14px]">
                        Tareas simples para cuidar tu bienestar emocional cada día, sin sentirte abrumado.
                    </p>
                </div>

                {/* Beneficio 2 */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] group">
                    <div className="w-16 h-16 bg-[#EEF0FF] rounded-[20px] flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500 border border-white">
                        <Sparkles className="text-[#6C72F1]" size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-extrabold text-[20px] text-[#333333] mb-3">Progreso visual</h3>
                    <p className="text-[#8A95A5] font-medium leading-relaxed text-[14px]">
                        Visualiza tu racha diaria, sube de nivel a tu compañero y celebra cada pequeño logro.
                    </p>
                </div>

                {/* Beneficio 3 */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] group">
                    <div className="w-16 h-16 bg-[#FFFBEB] rounded-[20px] flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500 border border-white">
                        <Sun className="text-[#D97706]" size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-extrabold text-[20px] text-[#333333] mb-3">Contenido vital</h3>
                    <p className="text-[#8A95A5] font-medium leading-relaxed text-[14px]">
                        Meditaciones, podcasts y ejercicios curados específicamente para tu ruta clínica.
                    </p>
                </div>

                {/* Beneficio 4 */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] group">
                    <div className="w-16 h-16 bg-[#E5F7F4] rounded-[20px] flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500 border border-white">
                        <ShieldCheck className="text-[#3EAFA8]" size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-extrabold text-[20px] text-[#333333] mb-3">Conexión segura</h3>
                    <p className="text-[#8A95A5] font-medium leading-relaxed text-[14px]">
                        Comparte tu progreso con tu profesional de la salud de forma 100% privada y encriptada.
                    </p>
                </div>

            </div>
        </section>
    );
}