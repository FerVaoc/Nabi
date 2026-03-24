import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 py-16 bg-[#FAF8F5] text-center border-t border-[#E2E8F0] relative overflow-hidden">
      
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center mb-12 relative z-10">
        
        {/* Tu logo Real */}
        <Link href="/" className="flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.png" 
              alt="Logo Nabi" 
              className="w-full h-full object-contain" 
            />
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Nabi</span>
        </Link>
        
        <p className="text-sm text-[#475569] max-w-xl mx-auto font-medium leading-relaxed">
          Nabi es tu acompañante emocional digital diseñado para apoyar el bienestar
          mental a través de hábitos diarios. 
          <br className="hidden md:block"/> 
          <span className="text-[#94A3B8] italic mt-2 block">No sustituye la atención de un profesional de la salud mental.</span>
        </p>
      </div>

      <div className="border-t border-[#E2E8F0] pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-black text-[#94A3B8] max-w-[1400px] mx-auto relative z-10 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} Nabi. Todos los derechos reservados.</p>
        <p>Desarrollado por <span className="text-[#0F172A]">FV</span></p>
      </div>

    </footer>
  );
}