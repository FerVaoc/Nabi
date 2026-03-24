import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative flex items-center px-6 md:px-16 py-16 md:py-24 bg-gradient-to-br from-[#F3E7FC] via-[#E2F4EE] to-[#FDF3E9] min-h-[calc(100vh-80px)] overflow-hidden">

            <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-2 gap-10 items-center relative z-10">
                
                {/* CONTENIDO (Textos y Botones) */}
                <div className="max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Etiqueta Flotante */}
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-md border border-white rounded-full shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3EAFA8] animate-pulse"></span>
                        <span className="text-[10px] font-black text-[#6C72F1] tracking-[0.2em] uppercase">Tu espacio seguro</span>
                    </div>
                    
                    <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-black text-[#333333] leading-[1.05] tracking-tight">
                        Tu compañero digital para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C72F1] to-[#3EAFA8]">bienestar emocional</span>
                    </h1>

                    <p className="mt-6 text-[#8A95A5] text-[16px] md:text-[18px] font-medium leading-relaxed max-w-lg">
                        Nabi te acompaña en tu camino hacia una vida más equilibrada
                        con tareas diarias, seguimiento de progreso y contenido diseñado a tu medida.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <Link
                            href="/register"
                            className="px-8 py-4 rounded-[24px] bg-[#6C72F1] hover:bg-[#5C61E1] text-white font-extrabold text-[15px] uppercase tracking-wider text-center transition-all transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(108,114,241,0.3)] hover:shadow-lg flex items-center justify-center gap-2 group"
                        >
                            Comenzar gratis
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>

                        <Link
                            href="/login"
                            className="px-8 py-4 rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-md text-[#6C72F1] font-extrabold text-[15px] uppercase tracking-wider text-center transition-all hover:bg-white shadow-sm hover:shadow-md"
                        >
                            Ya tengo cuenta
                        </Link>
                    </div>
                </div>

                {/* ILUSTRACIÓN Y EFECTOS DE LUZ */}
                <div className="flex justify-center md:justify-end relative mt-10 md:mt-0 animate-in fade-in zoom-in-95 duration-1000 delay-200">
                    
                    {/* Elementos decorativos detrás de la imagen */}
                    <div className="absolute w-80 h-80 bg-[#6C72F1] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob pointer-events-none"></div>
                    <div className="absolute w-80 h-80 bg-[#3EAFA8] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000 right-10 top-20 pointer-events-none"></div>
                    <div className="absolute w-64 h-64 bg-[#FDE047] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-4000 left-10 bottom-10 pointer-events-none"></div>
                    
                    <img
                        src="/hero.svg"
                        alt="Bienestar emocional con Nabi"
                        className="w-full max-w-[550px] relative z-10 drop-shadow-[0_20px_50px_rgba(108,114,241,0.15)] hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>

        </section>
    );
}