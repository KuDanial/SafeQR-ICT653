import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

export default function PhoneContainer({ children, role, onRoleChange, activeUser, onLogout }) {
  const [time, setTime] = useState('12:45');
  const [deviceFrame, setDeviceFrame] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/60 to-slate-200 py-4 px-2 md:py-8 flex flex-col items-center justify-start text-slate-800 font-sans">
      {/* Top Demo Control Ribbon (Light Mode) */}
      <header className="w-full max-w-2xl mb-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 shadow-lg shadow-slate-200/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <img
            src="/img/logo.png"
            alt="SafeQR Logo"
            className="w-8 h-8 object-contain rounded-lg shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-[#16205b]">SafeQR</span>
              <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded text-[10px] border border-emerald-200">
                White Mode
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Third-Party Anti-Fraud Shield
            </span>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onRoleChange('login')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
              role === 'login'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
            title="Switch to Login / Register Screen"
          >
            🔑 Auth
          </button>
          <button
            onClick={() => onRoleChange('customer')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              role === 'customer'
                ? 'bg-[#16205b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            👤 Customer
          </button>
          <button
            onClick={() => onRoleChange('merchant')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              role === 'merchant'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            🏪 Merchant
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              role === 'admin'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrame(!deviceFrame)}
            className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors font-medium"
            title="Toggle Smartphone Bezel Frame"
          >
            {deviceFrame ? <Smartphone className="w-3.5 h-3.5 text-blue-600" /> : <Monitor className="w-3.5 h-3.5 text-slate-600" />}
            <span>{deviceFrame ? 'Phone Frame' : 'Expanded'}</span>
          </button>
        </div>
      </header>

      {/* Main Container - Mobile Centered Shell (White Mode) */}
      <div
        className={`w-full transition-all duration-300 flex flex-col justify-between ${
          deviceFrame
            ? 'max-w-[412px] bg-white border-[10px] border-slate-800 rounded-[48px] shadow-2xl ring-1 ring-slate-300 min-h-[820px] overflow-hidden'
            : 'max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl min-h-[780px] overflow-hidden'
        }`}
      >
        {/* Phone Status Bar (Light / White Mode) */}
        <div className="pt-2.5 px-6 pb-1 bg-white text-slate-800 flex items-center justify-between text-xs select-none border-b border-slate-100">
          <span className="font-bold tracking-tight text-slate-900">{time}</span>
          {/* Dynamic Island Notch */}
          <div className="h-4 w-24 bg-slate-900 rounded-full mx-auto hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Screen Content Body (White / Clean Light Slate) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-800 flex flex-col relative">
          {children}
        </main>

        {/* Phone Home Bar */}
        <div className="py-2.5 bg-white flex justify-center items-center border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* Academic Disclaimer / Presentation Caption */}
      <footer className="mt-4 text-center text-xs text-slate-500 max-w-md font-medium">
        SafeQR Prototype • White Mode • Solving QR Scams, Fake Receipts & Digital Divide
      </footer>
    </div>
  );
}
