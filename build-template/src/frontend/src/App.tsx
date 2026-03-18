import { Stethoscope, CalendarDays, Activity, Users } from 'lucide-react';

export default function App() {
    return (
        <div className="min-h-screen mesh-bg relative overflow-hidden font-sans text-slate-800">

            {/* Abstract Animated Glows */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-glow mix-blend-multiply pointer-events-none" style={{ animationDelay: '1.5s' }} />

            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 w-full border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white shadow-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">MediCare</span>
                    </div>
                    <div className="flex space-x-4">
                        <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">SignIn</button>
                        <button className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 shadow-md transition-all active:scale-95">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center justify-center animate-fade-in-up">

                <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/40 mb-8 mt-12">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-600">Smart Healthcare Platform</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight mb-8 text-slate-900 leading-[1.1]">
                    Modern Healthcare <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Made Simple</span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-center text-slate-600 mb-12 font-light leading-relaxed">
                    Manage your health records, track metrics, and take control of your wellness with our beautiful, intuitive platform.
                </p>

                {/* Removed Action Cards Grid */}
            </main>

        </div>
    );
}
