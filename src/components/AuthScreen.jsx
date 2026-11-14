import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Store, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthScreen({ onSelectRole, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer'); // customer | merchant | admin
  const [identifier, setIdentifier] = useState('ahmad.faiz@uitm.edu.my');
  const [password, setPassword] = useState('••••••••');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      email: identifier,
      role: selectedRole,
      name: selectedRole === 'merchant' ? 'Ali bin Hassan' : selectedRole === 'admin' ? 'Officer Kamal (Admin)' : 'Ahmad Faiz',
    });
    onSelectRole(selectedRole);
  };

  const handleQuickPreset = (role, email, name) => {
    setSelectedRole(role);
    setIdentifier(email);
    onLoginSuccess({ email, role, name });
    onSelectRole(role);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Brand Header with New Uploaded Logo */}
      <div className="pt-2 text-center flex flex-col items-center">
        <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-200/80 mb-2">
          <img
            src="/img/logo.png"
            alt="SafeQR Secure Scanner Logo"
            className="w-24 h-24 object-contain mx-auto"
          />
        </div>
        <p className="text-xs text-slate-600 max-w-xs mx-auto font-medium">
          Malaysia's Anti-Fraud QR Verification & Payment Confirmation Shield
        </p>
      </div>

      {/* Role Selector Tabs (White Mode) */}
      <div className="my-3">
        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 text-center uppercase tracking-wider">
          Select Your Persona / Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1.5 rounded-xl border border-slate-300">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('customer');
              setIdentifier('customer@safeqr.my');
            }}
            className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
              selectedRole === 'customer'
                ? 'bg-[#16205b] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-1" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('merchant');
              setIdentifier('ali@kedaimakan.com.my');
            }}
            className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
              selectedRole === 'merchant'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Store className="w-4 h-4 mb-1" />
            <span>Merchant</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setIdentifier('kamal@cybersecurity.gov.my');
            }}
            className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
              selectedRole === 'admin'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-1" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Login Form (White Mode) */}
      <form onSubmit={handleFormSubmit} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            {isRegister ? 'Create SafeQR Account' : 'Sign In with SafeQR ID'}
          </h2>
          <span className="text-[10px] text-blue-700 font-bold uppercase bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            {selectedRole}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email or MyKad / SSM Reg
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16205b] focus:bg-white transition-all font-medium"
            placeholder={selectedRole === 'merchant' ? 'e.g. ssm@kedaimakan.my' : 'e.g. yourname@gmail.com'}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Passcode / PIN
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16205b] focus:bg-white transition-all font-medium"
            placeholder="Enter 6-digit PIN"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-[#16205b] hover:bg-[#1f2d7d] text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <span>{isRegister ? 'Register & Enter Dashboard' : 'Enter Prototype Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-0.5">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-500 hover:text-blue-700 underline font-medium"
          >
            {isRegister ? 'Already registered? Sign in' : "Don't have an account? Mock Register"}
          </button>
        </div>
      </form>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 py-3 font-medium">
        <Lock className="w-3 h-3 text-emerald-600" />
        <span>End-to-End Cryptographic DuitNow QR Hash Verification</span>
      </div>
    </div>
  );
}
