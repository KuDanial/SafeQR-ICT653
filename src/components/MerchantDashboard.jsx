import React, { useState } from 'react';
import {
  Store,
  Bell,
  Volume2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  AlertOctagon,
  Sparkles,
  ArrowDownLeft,
  X,
  FileCheck,
  TrendingUp,
  CreditCard,
  Search
} from 'lucide-react';
import { playMerchantAlertSound, speakConfirmation } from '../utils/audio';

export default function MerchantDashboard({
  transactions,
  onAddTransaction,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('feed'); // feed | qr_stand | verify_receipt
  const [alertPopup, setAlertPopup] = useState(null);
  const [simulatedAmt, setSimulatedAmt] = useState('15.00');
  const [checkRefInput, setCheckRefInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isMerchantNotifOpen, setIsMerchantNotifOpen] = useState(false);
  const [merchantUnread, setMerchantUnread] = useState(2);

  // Trigger Incoming Payment Simulation
  const handleSimulatePayment = (customAmount = null) => {
    const amountVal = customAmount || simulatedAmt;
    const numericAmt = parseFloat(amountVal) || 15.00;

    // 1. Play loud notification alert sound (Web Audio API Synthesizer)
    playMerchantAlertSound();

    // 2. Play audible voice confirmation
    speakConfirmation(`Payment received. Fifteen Ringgit from customer.`);

    // 3. New transaction record
    const newTx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      customerName: 'Ahmad Faiz (Customer)',
      amount: numericAmt,
      time: 'Just now',
      status: 'Real-Time Settled ✅',
      authRef: `SQ-${Date.now().toString().slice(-6)}-MY`,
      method: 'DuitNow QR via SafeQR Guard'
    };

    onAddTransaction(newTx);

    // 4. Pop-up appearance (Anti-Fake Receipt Proof)
    setAlertPopup({
      amount: numericAmt.toFixed(2),
      customer: newTx.customerName,
      ref: newTx.authRef,
      time: new Date().toLocaleTimeString()
    });

    showToast(`🔔 Loud Alert: RM ${numericAmt.toFixed(2)} received from ${newTx.customerName}!`);
  };

  // Verify suspicious screenshot against merchant ledger
  const handleVerifyReceipt = (e) => {
    e.preventDefault();
    if (!checkRefInput.trim()) return;

    const matched = transactions.find(
      t => t.authRef.toLowerCase() === checkRefInput.trim().toLowerCase() ||
           t.id.toLowerCase() === checkRefInput.trim().toLowerCase()
    );

    if (matched) {
      setVerifyResult({
        found: true,
        data: matched
      });
      showToast('✅ Real Payment Confirmed on Merchant Ledger!');
    } else {
      setVerifyResult({
        found: false,
        ref: checkRefInput.trim()
      });
      showToast('🚨 FRAUD ALERT: No transaction found matching this screenshot!');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50/70 text-slate-800">
      <div className="space-y-3.5">
        {/* Merchant Header (Modern Fintech Glass Card) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-[#16205b] to-blue-600 rounded-2xl flex items-center justify-center text-xl text-white shadow-md shadow-blue-900/10">
              🍛
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-slate-900 text-base tracking-tight">Kedai Makan Ali</h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-200 shadow-2xs">
                  SSM Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Bangsar Counter #1 • DuitNow: 012-3456789</p>
            </div>
          </div>

          <button
            onClick={() => setIsMerchantNotifOpen(true)}
            className="relative p-2.5 bg-white rounded-2xl border border-slate-200/90 text-slate-700 shadow-2xs hover:bg-slate-50 transition-all active:scale-95"
            title="Merchant Security Alerts"
          >
            {merchantUnread > 0 && (
              <span className="flex h-2.5 w-2.5 absolute top-1.5 right-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
            )}
            <Bell className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Tab Navigation (Modern Rounded-full Pills) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-2xl border border-slate-300/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-2 rounded-xl transition-all active:scale-95 ${
              activeTab === 'feed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Feed
          </button>
          <button
            onClick={() => setActiveTab('qr_stand')}
            className={`py-2 rounded-xl transition-all active:scale-95 ${
              activeTab === 'qr_stand'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Counter QR
          </button>
          <button
            onClick={() => setActiveTab('verify_receipt')}
            className={`py-2 rounded-xl transition-all active:scale-95 ${
              activeTab === 'verify_receipt'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verify Receipt
          </button>
        </div>

        {/* =============================================================
            SIMULATE INCOMING PAYMENT (Feature #6 - Anti-Fake Receipt)
            ============================================================= */}
        <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 border border-blue-200/80 p-4 rounded-3xl shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#16205b] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Demo: Anti-Fake Receipt Test
            </span>
            <span className="text-[10px] text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
              Feature #6
            </span>
          </div>

          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Trigger a real-time incoming transfer with an audible chime and speech confirmation to expose fake screenshot scams:
          </p>

          <button
            onClick={() => handleSimulatePayment('15.00')}
            className="w-full bg-gradient-to-r from-[#16205b] via-[#1a2b77] to-blue-700 hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
          >
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>Simulate Incoming Payment (RM 15.00)</span>
          </button>
        </div>

        {/* =============================================================
            TAB 1: LIVE TRANSACTION FEED
            ============================================================= */}
        {activeTab === 'feed' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Real-Time Settlement Feed
              </span>
              <span className="text-[11px] text-slate-700 font-black">
                Today: RM {(transactions.reduce((acc, t) => acc + t.amount, 0)).toFixed(2)}
              </span>
            </div>

            <div className="space-y-2 max-h-[310px] overflow-y-auto pr-0.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 p-3 rounded-2xl flex items-center justify-between text-xs transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                      <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{tx.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">
                        {tx.authRef} • {tx.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700 block text-sm">
                      +RM {tx.amount.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      Verified ✅
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 2: COUNTER QR STAND (With Uploaded Logo)
            ============================================================= */}
        {activeTab === 'qr_stand' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 text-center shadow-xs">
            <span className="text-xs font-black text-[#16205b] uppercase tracking-wider block mb-1">
              Official SafeQR Merchant Stand
            </span>
            <p className="text-[11px] text-slate-500 mb-3 font-medium">
              Dynamic Anti-Tamper Frame with cryptographic watermarking
            </p>

            <div className="inline-block p-4 bg-white rounded-3xl shadow-md border-4 border-[#16205b] mb-3">
              <div className="flex justify-center mb-2">
                <img
                  src="/img/logo.png"
                  alt="SafeQR Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <QrCode className="w-32 h-32 text-slate-900 mx-auto" />
              <div className="mt-2 text-slate-900 font-black text-xs">
                Kedai Makan Ali (Counter #1)
              </div>
              <div className="text-[9px] text-slate-600 font-mono font-bold">
                SSM: 202301048821 • DuitNow
              </div>
            </div>

            <div className="text-[10px] bg-emerald-50 p-2.5 rounded-2xl text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Protected against physical sticker fraud overlay
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 3: VERIFY CUSTOMER SCREENSHOT RECEIPT
            ============================================================= */}
        {activeTab === 'verify_receipt' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 space-y-3 shadow-xs">
            <div>
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 mb-1">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Anti-Fake Screenshot Checker
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Customer claims they paid? Check their Reference No. against our live ledger:
              </p>
            </div>

            <form onSubmit={handleVerifyReceipt} className="space-y-2">
              <input
                type="text"
                value={checkRefInput}
                onChange={(e) => setCheckRefInput(e.target.value)}
                placeholder="Enter Ref (e.g. SQ-8849-MY or tx-994)"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-[#16205b] font-mono font-bold"
              />
              <button
                type="submit"
                className="w-full bg-[#16205b] hover:bg-[#1f2d7d] text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
              >
                <span>Verify Against Bank Gateway</span>
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="flex gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => setCheckRefInput('SQ-8849-MY')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl font-bold transition-colors"
              >
                Test Genuine Ref
              </button>
              <button
                type="button"
                onClick={() => setCheckRefInput('FAKE-SCAM-999')}
                className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1.5 rounded-xl font-bold transition-colors"
              >
                Test Fake Screenshot
              </button>
            </div>

            {/* Result display */}
            {verifyResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs animate-in zoom-in-95 duration-200 ${
                  verifyResult.found
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                {verifyResult.found ? (
                  <div>
                    <span className="font-black flex items-center gap-1 text-emerald-800 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AUTHENTIC PAYMENT CONFIRMED
                    </span>
                    <p className="text-[11px] font-medium leading-relaxed">
                      Customer: <strong>{verifyResult.data.customerName}</strong><br />
                      Amount: <strong>RM {verifyResult.data.amount.toFixed(2)}</strong><br />
                      Settlement: Real-time Bank Clearance ✅
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-black flex items-center gap-1 text-red-700 mb-1">
                      <AlertOctagon className="w-4 h-4 text-red-600" /> FAKE PAYMENT RECEIPT DETECTED!
                    </span>
                    <p className="text-[11px] font-medium text-red-800 leading-relaxed">
                      No funds were ever received under ref "{verifyResult.ref}". Do NOT hand over goods!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          POPUP: INCOMING PAYMENT ALERT
          ------------------------------------------------------------- */}
      {alertPopup && (
        <div className="absolute inset-x-4 top-16 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#16205b] text-white p-4 rounded-3xl shadow-2xl border-2 border-emerald-400">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 block">
                    Payment Received!
                  </span>
                  <span className="text-2xl font-black">
                    RM {alertPopup.amount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAlertPopup(null)}
                className="p-1 text-white/80 hover:text-white bg-white/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-white/20 text-xs flex justify-between text-slate-200 font-medium">
              <span>From: <strong>{alertPopup.customer}</strong></span>
              <span className="font-mono text-[11px]">{alertPopup.time}</span>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Security Notifications Modal */}
      {isMerchantNotifOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-xl">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">Merchant Fraud Alerts</h3>
                  <span className="text-[10px] text-slate-500 font-medium">SafeQR Terminal Monitor</span>
                </div>
              </div>
              <button
                onClick={() => setIsMerchantNotifOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-2xl">
                <span className="font-bold text-blue-900 block">📢 Audio Payment Chime Active</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Your terminal plays a loud dual-tone chime on every genuine bank settlement to safeguard against fake customer screenshots.
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl">
                <span className="font-bold text-amber-900 block">⚠️ Fake Screenshot Warning</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Always inspect your live feed or use "Verify Receipt" tab if a customer displays a static screenshot without an audio chime.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setMerchantUnread(0);
                  showToast('Merchant notifications marked as read.');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
              >
                Clear Badge
              </button>
              <button
                onClick={() => setIsMerchantNotifOpen(false)}
                className="flex-1 py-2.5 bg-[#16205b] hover:bg-[#1f2d7d] text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-200/80 font-semibold">
        SafeQR Merchant Shield • Zero Fake Screenshot Exposure
      </div>
    </div>
  );
}
