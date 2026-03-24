import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-4 bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
      
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        {/* Logo Nabi */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 bg-white rounded-[12px] shadow-sm border border-[#E2E8F0] p-1">
             <img 
               src="/logo.png" 
               alt="Logo Nabi" 
               className="w-full h-full object-contain"
             />
          </div>
          <div className="flex items-center">
             <span className="text-[22px] font-black text-[#6C72F1] tracking-tight">Nabi</span>
             <span className="ml-2 text-[9px] font-black bg-[#EEF0FF] text-[#6C72F1] px-2.5 py-1 rounded-[8px] uppercase tracking-widest border border-white shadow-sm hidden sm:inline-block">V1</span>
          </div>
        </Link>

        {/* Enlaces y Botones */}
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/login" className="hidden sm:block text-[13px] font-extrabold text-[#8A95A5] hover:text-[#6C72F1] transition-colors uppercase tracking-wider">
            Iniciar sesión
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 rounded-[20px] bg-[#6C72F1] hover:bg-[#5C61E1] text-white text-[13px] font-extrabold uppercase tracking-wider shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}