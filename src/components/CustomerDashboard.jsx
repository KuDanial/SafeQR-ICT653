import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  PhoneCall,
  FileWarning,
  Eye,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Lock,
  ChevronRight,
  X,
  Home,
  Clock,
  User,
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Shield,
  Search,
  Check,
  ExternalLink,
  History
} from 'lucide-react';
import { speakConfirmation } from '../utils/audio';

export default function CustomerDashboard({
  merchants,
  onAddScamReport,
  onSimulateMerchantPayment,
  elderlyMode,
  setElderlyMode,
  showToast
}) {
  // Navigation tabs in Customer Mode
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'reports' | 'profile'

  // Scanner & Payment state
  const [scanStep, setScanStep] = useState('idle'); // idle | scanning | verified_card | tampered_card | processing_pay | payment_success
  const [selectedScenario, setSelectedScenario] = useState('verified'); // verified | tampered
  const [paymentAmount, setPaymentAmount] = useState('15.00');

  // Modals
  const [isReporting, setIsReporting] = useState(false);
  const [isCallingHelp, setIsCallingHelp] = useState(false);
  const [isVerifyMerchantOpen, setIsVerifyMerchantOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [reportedCaseInfo, setReportedCaseInfo] = useState(null);

  // Notifications list
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: '🚨 Community Scam Alert',
      message: 'New syndicate sticker overlay reported in Bangsar food court. SafeQR optical tamper engine is actively intercepting fake QR codes.',
      time: '10 mins ago',
      unread: true
    },
    {
      id: 'n2',
      title: '🛡️ Merchant Certificate Verified',
      message: 'Kedai Makan Ali (Counter #1) renewed its official SSM anti-tamper cryptographic seal.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 'n3',
      title: '📢 Bank Negara Malaysia Advisory',
      message: 'SafeQR guarantees loud dual-party voice confirmation after every legitimate payment. Do not accept static screenshots.',
      time: 'Yesterday',
      unread: true
    }
  ]);

  // Scam report form state
  const [reportType, setReportType] = useState('Fake QR Code');
  const [reportMerchant, setReportMerchant] = useState('Kedai Makan Ali (Counter #2)');
  const [reportDesc, setReportDesc] = useState('');

  // Mock balance
  const [walletBalance, setWalletBalance] = useState(2450.80);

  // Handle Scanning Simulation
  const handleStartScan = (scenario = null) => {
    const scn = scenario || selectedScenario;
    setSelectedScenario(scn);
    setScanStep('scanning');

    setTimeout(() => {
      if (scn === 'verified') {
        setScanStep('verified_card');
      } else {
        setScanStep('tampered_card');
      }
    }, 1800);
  };

  // Handle Payment Execution & Voice Trigger
  const handleExecutePayment = () => {
    setScanStep('processing_pay');

    setTimeout(() => {
      const numericAmt = parseFloat(paymentAmount) || 15.00;
      setWalletBalance(prev => Math.max(0, prev - numericAmt));
      setScanStep('payment_success');

      // Crucial: Web Speech API voice trigger
      const spokenText = "Payment successful. Fifteen Ringgit received by Kedai Makan Ali.";
      speakConfirmation(spokenText);

      if (onSimulateMerchantPayment) {
        onSimulateMerchantPayment({
          customerName: 'Ahmad Faiz (Customer)',
          amount: numericAmt,
          merchantName: 'Kedai Makan Ali'
        });
      }
    }, 1500);
  };

  // Re-play voice explicitly
  const handleReplayVoice = () => {
    const spokenText = "Payment successful. Fifteen Ringgit received by Kedai Makan Ali.";
    speakConfirmation(spokenText);
    showToast('🔊 Speaking: "Payment successful. Fifteen Ringgit received by Kedai Makan Ali."');
  };

  // Submit Scam Report
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportDesc.trim()) {
      showToast('⚠️ Please enter a brief description.');
      return;
    }

    onAddScamReport({
      type: reportType,
      merchantName: reportMerchant,
      description: reportDesc,
      reporter: elderlyMode ? 'Pak Mat (Senior Citizen)' : 'Ahmad Faiz (Customer)',
      severity: reportType === 'Fake QR Code' ? 'High' : 'Medium'
    });

    setIsReporting(false);
    setReportDesc('');
    showToast('✅ Scam report sent to SafeQR Admin for review.');
  };

  // Immediate 1-Click Action for Tampered QR Sticker Scam
  const handleImmediateTamperReport = () => {
    const caseRef = `SQR-CASE-${Math.floor(1000 + Math.random() * 9000)}`;
    const reportData = {
      type: 'Fake QR Code (Sticker Overwrite)',
      merchantName: 'Kedai Makan Ali (Bangsar Stall #4 Sticker)',
      description: 'Physical counterfeit QR sticker pasted over merchant stand. Suspected mule account: SYNDICATE TRADING ENT. Flagged for admin review.',
      reporter: elderlyMode ? 'Pak Mat (Senior Citizen)' : 'Ahmad Faiz (Customer)',
      severity: 'Critical High',
      caseRef: caseRef
    };

    onAddScamReport(reportData);
    setReportedCaseInfo(reportData);
    setScanStep('tamper_reported_success');

    // Trigger audible confirmation
    speakConfirmation("Scam report sent to SafeQR Admin. This sticker has been flagged.");
    showToast(`🚨 Case ${caseRef} sent to SafeQR Admin for review.`);
  };

  // Notification helpers
  const handleMarkNotificationsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('Marked all security notifications as read.');
  };

  // Toggle Elderly Mode
  const handleToggleElderly = () => {
    const nextState = !elderlyMode;
    setElderlyMode(nextState);
    if (nextState) {
      speakConfirmation("Elderly Mode activated. Big buttons and simplified navigation enabled.");
      showToast('👴 Elderly Mode Enabled: High-contrast, large text and simplified layout.');
    } else {
      speakConfirmation("Standard mode enabled.");
      showToast('Standard view restored.');
    }
  };

  /* =====================================================================
     RENDER: PAYMENT SUCCESS VIEW (Modal / Screen)
     ===================================================================== */
  if (scanStep === 'payment_success') {
    return (
      <div className={`flex-1 flex flex-col justify-between p-6 bg-white animate-in fade-in zoom-in-95 duration-200 ${elderlyMode ? 'text-xl' : 'text-sm'}`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Animated Big Green Checkmark */}
          <div className="relative mb-5">
            <div className="w-28 h-28 bg-emerald-100/80 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-white stroke-[2.5]" />
              </div>
            </div>
          </div>

          <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-2 flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SafeQR Verified Anti-Fake Receipt
          </span>

          <h2 className={`font-black text-slate-900 mb-1 tracking-tight ${elderlyMode ? 'text-4xl' : 'text-3xl'}`}>
            RM {paymentAmount}
          </h2>
          <p className="text-slate-700 font-bold text-base mb-1">
            Paid to <strong className="text-[#16205b]">Kedai Makan Ali</strong>
          </p>
          <p className="text-xs text-slate-500 max-w-xs font-medium">
            Confirmed directly with merchant register • Zero screenshot fraud risk
          </p>

          {/* Voice Confirmation Box */}
          <div className="mt-5 w-full bg-slate-50/90 border border-emerald-200/90 rounded-3xl p-4 shadow-sm text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" /> Spoken Voice Confirmation
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Web Speech API
              </span>
            </div>
            <p className="text-xs text-slate-800 italic bg-white p-3 rounded-2xl border border-slate-200 font-medium leading-relaxed">
              "Payment successful. Fifteen Ringgit received by Kedai Makan Ali."
            </p>
            <button
              onClick={handleReplayVoice}
              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
            >
              <Volume2 className="w-4 h-4" />
              <span>Replay Voice Announcement 🔊</span>
            </button>
          </div>

          {/* Transaction Metadata */}
          <div className="mt-4 w-full bg-white rounded-2xl p-3.5 border border-slate-200 text-[11px] text-slate-600 space-y-1.5 text-left font-medium shadow-xs">
            <div className="flex justify-between">
              <span>SafeQR Auth Ref:</span>
              <span className="font-mono text-slate-900 font-bold">SQ-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span>SSM Merchant:</span>
              <span className="text-slate-900 font-semibold">SSM-202301048821</span>
            </div>
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span className="text-slate-900">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setScanStep('idle')}
          className={`w-full bg-[#16205b] hover:bg-[#1f2d7d] text-white font-bold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all ${
            elderlyMode ? 'text-2xl py-5' : 'text-sm'
          }`}
        >
          <span>Done / Back to Home</span>
        </button>
      </div>
    );
  }

  /* =====================================================================
     RENDER: SCANNING SIMULATION (Camera Viewfinder with Slide-Up)
     ===================================================================== */
  if (scanStep === 'scanning') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScanStep('idle')}
            className="p-2.5 bg-slate-800/80 rounded-full border border-slate-700 text-slate-200 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> SafeQR Active Optical Scan
          </span>
          <div className="w-9"></div>
        </div>

        {/* Viewfinder frame */}
        <div className="my-auto flex flex-col items-center">
          <div className="relative w-64 h-64 border-2 border-teal-400/70 rounded-3xl p-3 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs shadow-2xl">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl -mb-1 -mr-1"></div>

            {/* Scanning Laser Sweep */}
            <div className="absolute left-3 right-3 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-lg shadow-teal-400/80 animate-[bounce_2s_infinite]"></div>

            <QrCode className="w-32 h-32 text-slate-400 animate-pulse" />

            <div className="mt-4 flex items-center gap-2 bg-black/70 px-3.5 py-1.5 rounded-full border border-teal-400/40">
              <RefreshCw className="w-3.5 h-3.5 text-teal-300 animate-spin" />
              <span className="text-[11px] font-semibold text-teal-200">
                Verifying Anti-Tamper Signatures...
              </span>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-300 max-w-xs font-medium">
            Cross-referencing DuitNow merchant ID with SSM Registry & optical tamper detector...
          </p>
        </div>

        <div className="text-center text-xs text-slate-400 font-mono">
          Target: {selectedScenario === 'verified' ? 'Kedai Makan Ali (Authentic Stand)' : 'Overlay Sticker Scam'}
        </div>
      </div>
    );
  }

  /* =====================================================================
     RENDER: VERIFIED MERCHANT CARD (Ready to Pay)
     ===================================================================== */
  if (scanStep === 'verified_card') {
    return (
      <div className={`flex-1 flex flex-col justify-between p-5 bg-white animate-in slide-in-from-bottom-8 duration-300 ${elderlyMode ? 'text-lg' : 'text-sm'}`}>
        <div>
          <button
            onClick={() => setScanStep('idle')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 mb-3 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </button>

          {/* Verification Badge */}
          <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-3xl p-4 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-emerald-200/60 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs">
                🍛
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className={`font-black text-slate-900 ${elderlyMode ? 'text-2xl' : 'text-base'}`}>
                    Kedai Makan Ali
                  </h3>
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> Verified Merchant
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">Bangsar, Kuala Lumpur • F&B</p>
              </div>
            </div>

            {/* Anti-Scam Security Audit Info */}
            <div className="mt-3 pt-3 border-t border-emerald-200 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Registered SSM:</span>
                <span className="text-slate-900 font-bold">SSM-202301048821</span>
              </div>
              <div>
                <span className="text-slate-500 block">Bank Account:</span>
                <span className="text-slate-900 font-bold">Maybank • Ali Nasi Lemak</span>
              </div>
              <div>
                <span className="text-slate-500 block">QR Sticker Integrity:</span>
                <span className="text-emerald-700 font-bold">Authentic Original ✅</span>
              </div>
              <div>
                <span className="text-slate-500 block">Risk Score:</span>
                <span className="text-emerald-700 font-bold">Very Low (0.01%)</span>
              </div>
            </div>
          </div>

          {/* Payment Amount Card */}
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Payment Amount (MYR)
            </label>
            <div className="relative flex items-center">
              <span className="text-2xl font-black text-[#16205b] mr-2">RM</span>
              <input
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className={`bg-white border border-slate-300 rounded-2xl px-3 py-2 text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-[#16205b] w-full ${
                  elderlyMode ? 'text-2xl' : 'text-xl'
                }`}
              />
            </div>

            <div className="flex gap-2 mt-2.5">
              {['5.00', '10.00', '15.00', '25.00'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setPaymentAmount(amt)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                    paymentAmount === amt
                      ? 'bg-[#16205b] text-white border-[#16205b] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Prompt Guarantee */}
          <div className="mt-3 bg-blue-50/80 border border-blue-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-blue-950 font-medium">
            <Volume2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              <strong>SafeQR Voice Guarantee:</strong> Once paid, an automated voice will loudly broadcast payment confirmation to both you and the merchant.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleExecutePayment}
            className={`w-full bg-[#16205b] hover:bg-[#1f2d7d] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95 transition-all ${
              elderlyMode ? 'py-5 text-2xl' : 'py-3.5 text-base'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Pay RM {paymentAmount}</span>
          </button>

          <button
            onClick={() => setScanStep('idle')}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1 font-semibold"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================================
     RENDER: TAMPERED QR DETECTED (White Mode Warning)
     ===================================================================== */
  if (scanStep === 'tampered_card') {
    return (
      <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-red-50 via-white to-slate-50 text-slate-900 animate-in slide-in-from-bottom-8 duration-300">
        <div>
          <button
            onClick={() => setScanStep('idle')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 mb-3 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </button>

          {/* Red Alert Banner */}
          <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-4 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0 shadow-xs">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-red-700 text-lg leading-tight">
                  WARNING: QR STICKER TAMPER DETECTED!
                </h3>
                <span className="text-xs text-red-600 font-bold uppercase tracking-wide">
                  DO NOT TRANSFER FUNDS
                </span>
              </div>
            </div>

            <p className="text-xs text-red-900 leading-relaxed bg-white/90 p-3 rounded-2xl border border-red-200 mt-2 font-medium">
              SafeQR optical inspection detected that a <strong>fake sticker</strong> was pasted over the real merchant's QR stand.
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered Merchant Premise:</span>
                <span className="text-slate-900 font-bold">Kedai Makan Ali (Bangsar Stall #4)</span>
              </div>

              <div className="bg-red-100/90 p-2.5 rounded-xl border border-red-300">
                <span className="text-red-700 block text-[10px] uppercase font-black">⚠️ Scammer Mule Account Found in Sticker:</span>
                <span className="text-red-900 font-mono font-black">SYNDICATE TRADING ENT (Mule Bank Account)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Actions */}
        <div className="space-y-2.5 mt-4">
          <button
            onClick={handleImmediateTamperReport}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-sm active:scale-95 transition-all"
          >
            <FileWarning className="w-4 h-4" />
            <span>Report This Fake QR Sticker to SafeQR</span>
          </button>

          <button
            onClick={() => setScanStep('idle')}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-2xl text-xs transition-colors"
          >
            Dismiss & Abort Transaction
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================================
     RENDER: TAMPER SCAM REPORTED TO SAFEQR ADMIN (Instant Action Result)
     ===================================================================== */
  if (scanStep === 'tamper_reported_success') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white animate-in zoom-in-95 duration-200 text-slate-900">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative mb-5">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 text-white">
                <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
              </div>
            </div>
          </div>

          <span className="bg-red-50 border border-red-300 text-red-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 shadow-2xs">
            🚨 Report Sent to SafeQR Admin
          </span>

          <h2 className="text-2xl font-black text-slate-900 mb-1">
            Scam QR Sticker Flagged!
          </h2>
          <p className="text-xs text-slate-600 max-w-xs font-medium">
            Your report was sent to the <strong>SafeQR Admin Console</strong>. Other SafeQR users will be warned before scanning this sticker.
          </p>

          {/* Case Reference Card */}
          <div className="mt-5 w-full bg-slate-50 border border-slate-200 rounded-3xl p-4 text-left space-y-2 text-xs shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-bold">Case Reference:</span>
              <span className="font-mono text-red-700 font-black text-sm">{reportedCaseInfo?.caseRef || 'SQR-CASE-8841'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Merchant Premise:</span>
              <span className="text-slate-900 font-bold">Kedai Makan Ali (Stall #4)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mule Account:</span>
              <span className="text-red-700 font-mono font-bold">SYNDICATE TRADING ENT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Action Status:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Stand Flagged • Under Admin Review
              </span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-600 bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-2xl text-left font-medium">
            💡 <strong>Lost money?</strong> Contact your bank immediately or call the <strong>National Scam Response Centre at 997</strong>.
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <button
            onClick={() => setScanStep('idle')}
            className="w-full bg-[#16205b] hover:bg-[#1f2d7d] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => {
              setScanStep('idle');
              setActiveTab('reports');
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs transition-colors"
          >
            View in Scam Reports Hub
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================================
     RENDER: PROCESSING PAYMENT SPINNER
     ===================================================================== */
  if (scanStep === 'processing_pay') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-[#16205b] rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Processing Safe Payment</h3>
        <p className="text-xs text-slate-500 max-w-xs font-medium">
          Verifying dual-party cryptographic ledger with DuitNow gateway...
        </p>
      </div>
    );
  }

  /* =====================================================================
     RENDER: MAIN DASHBOARD (With Floating Bottom Nav Bar)
     ===================================================================== */
  return (
    <div className={`flex-1 flex flex-col justify-between relative min-h-full ${elderlyMode ? 'bg-amber-50/40' : 'bg-slate-50/60'}`}>
      {/* Scrollable Content Body with padding for Floating Nav */}
      <div className={`p-4 ${elderlyMode ? 'pb-32' : 'pb-24'} space-y-3.5`}>
        {/* =============================================================
            TOP HEADER SECTION (Good Morning + Avatar + Bell + Elderly Toggle)
            ============================================================= */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16205b] to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/10 text-sm">
                AF
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">
                Good morning
              </span>
              <h1 className={`font-black text-slate-900 tracking-tight leading-none ${elderlyMode ? 'text-2xl' : 'text-base'}`}>
                Ahmad Faiz 👋
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Elderly Mode Pill */}
            <button
              onClick={handleToggleElderly}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                elderlyMode
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-bold shadow-2xs'
              }`}
              title="Toggle Elderly Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px]">{elderlyMode ? '👴 Big Text' : 'Elderly Mode'}</span>
            </button>

            {/* Notification Bell (Interactive) */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 bg-white rounded-2xl border border-slate-200/90 text-slate-700 shadow-2xs hover:bg-slate-50 transition-all active:scale-95"
              title="Open Security Alerts & Notifications"
            >
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
              )}
              <Bell className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TAB: HOME VIEW
            ------------------------------------------------------------- */}
        {activeTab === 'home' && (
          <>
            {/* =============================================================
                BALANCE / WALLET CARD (Fintech Revolut/Wise Style Gradient Card)
                ============================================================= */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16205b] via-[#1a2b77] to-blue-700 text-white p-5 shadow-xl shadow-blue-950/15 border border-blue-900/30">
              {/* Background watermark badge */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-bold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                SafeQR Shield Active
              </div>

              <div className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider mb-1">
                DuitNow Linked Account
              </div>

              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-lg font-bold text-blue-200">RM</span>
                <span className={`font-black tracking-tight ${elderlyMode ? 'text-4xl' : 'text-3xl'}`}>
                  {walletBalance.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Security Status Pill */}
              <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-blue-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" /> Anti-Tamper Check On
                </span>
                <span className="text-[10px] text-blue-200/80 font-mono">Maybank •• 4912</span>
              </div>
            </div>

            {/* =============================================================
                SCENARIO SELECTOR (Sleek Horizontal Pill Toggle)
                ============================================================= */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-3 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Presentation Demo Target:
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  Scenario
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedScenario('verified')}
                  className={`p-2.5 rounded-2xl text-left transition-all border ${
                    selectedScenario === 'verified'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs ring-1 ring-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authentic Stall
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                    Kedai Makan Ali (Voice)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScenario('tampered')}
                  className={`p-2.5 rounded-2xl text-left transition-all border ${
                    selectedScenario === 'tampered'
                      ? 'bg-red-50 border-red-400 text-red-950 shadow-xs ring-1 ring-red-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Sticker Scam
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                    Pasted mule overlay
                  </span>
                </button>
              </div>
            </div>

            {/* =============================================================
                QUICK ACTIONS GRID (Modern Fintech 4-Icon Grid)
                ============================================================= */}
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                Quick Security Tools
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* 1. Report Scam */}
                <button
                  onClick={() => setIsReporting(true)}
                  className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-3 rounded-2xl flex flex-col items-center text-center shadow-xs transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <FileWarning className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Report Scam</span>
                </button>

                {/* 2. Scan History */}
                <button
                  onClick={() => setActiveTab('history')}
                  className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-3 rounded-2xl flex flex-col items-center text-center shadow-xs transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">History</span>
                </button>

                {/* 3. Verify Merchant */}
                <button
                  onClick={() => setIsVerifyMerchantOpen(true)}
                  className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-3 rounded-2xl flex flex-col items-center text-center shadow-xs transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Verify SSM</span>
                </button>

                {/* 4. Helpline 997 */}
                <button
                  onClick={() => setIsCallingHelp(true)}
                  className="bg-white hover:bg-slate-50/80 border border-slate-200/90 p-3 rounded-2xl flex flex-col items-center text-center shadow-xs transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Help 997</span>
                </button>
              </div>
            </div>

            {/* =============================================================
                RECENT SECURITY ACTIVITY LIST
                ============================================================= */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Recent Verified Scans
                </span>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-white border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      🍛
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Kedai Makan Ali</span>
                      <span className="text-[10px] text-slate-500 font-medium">Bangsar • DuitNow QR Verified</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">-RM 15.00</span>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      Authentic ✅
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      ☕
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Warung Kopi Tok Wan</span>
                      <span className="text-[10px] text-slate-500 font-medium">Shah Alam • CIMB DuitNow</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">-RM 6.50</span>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      Authentic ✅
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* -------------------------------------------------------------
            TAB: HISTORY VIEW
            ------------------------------------------------------------- */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">Scan & Payment History</h2>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                Anti-Tamper Audited
              </span>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Kedai Makan Ali', cat: 'F&B', amt: '15.00', time: 'Today, 12:30 PM', status: 'Voice Confirmed ✅' },
                { name: 'Warung Kopi Tok Wan', cat: 'Beverage', amt: '6.50', time: 'Yesterday, 3:15 PM', status: 'Voice Confirmed ✅' },
                { name: 'Pasar Raya Ah Boon', cat: 'Groceries', amt: '42.80', time: '12 Nov 2026', status: 'Voice Confirmed ✅' },
                { name: 'Roti Canai Transfer Rd', cat: 'Hawker', amt: '8.00', time: '11 Nov 2026', status: 'Voice Confirmed ✅' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/90 p-3 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-500">{item.time} • {item.cat}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">-RM {item.amt}</span>
                    <span className="text-[9px] text-emerald-700 font-bold">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: REPORTS VIEW
            ------------------------------------------------------------- */}
        {activeTab === 'reports' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">Scam Reports & Alerts</h2>
              <button
                onClick={() => setIsReporting(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs"
              >
                + New Report
              </button>
            </div>

            <div className="space-y-2">
              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-red-700 uppercase block">🚨 Sticker Tamper Alert</span>
                <h4 className="text-xs font-black text-red-950 mt-0.5">Bangsar Stall #4 QR Overlay</h4>
                <p className="text-[11px] text-red-900 mt-1">
                  Mule account "Syndicate Trading" sticker detected pasted over authentic vendor QR.
                </p>
                <div className="mt-2 text-[10px] text-red-600 font-semibold">
                  Status: Flagged & Blocked by SafeQR Network
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Community Advisory</span>
                <h4 className="text-xs font-black text-slate-900 mt-0.5">Fake Maybank Screenshot Scam</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Always rely on SafeQR audio confirmation and merchant terminal verification instead of customer phone screenshots.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: PROFILE VIEW
            ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 text-center shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-[#16205b] text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-md">
                AF
              </div>
              <h3 className="font-black text-slate-900 text-base">Ahmad Faiz</h3>
              <p className="text-xs text-slate-500">MyKad: ••••-••-5821 • Verified SafeQR ID</p>

              <div className="mt-3 pt-3 border-t border-slate-100 text-left text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">DuitNow Linked Bank</span>
                  <span className="text-[#16205b] font-bold">Maybank Active ✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2">
                <span className="font-bold text-slate-800">Elderly Mode Toggle</span>
                <button
                  onClick={handleToggleElderly}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    elderlyMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {elderlyMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =============================================================
          THE FLOATING BOTTOM NAVIGATION BAR (CRITICAL REQUIREMENT #1)
          ============================================================= */}
      <div className="sticky bottom-3 mx-3 z-40">
        <nav
          className={`bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-300/40 rounded-full px-3 py-2 flex items-center justify-between relative ${
            elderlyMode ? 'py-3' : 'py-2'
          }`}
        >
          {elderlyMode ? (
            /* -------------------------------------------------------------
               SIMPLIFIED ELDERLY MODE NAVIGATION
               ------------------------------------------------------------- */
            <>
              {/* Home */}
              <button
                onClick={() => setActiveTab('home')}
                className={`flex-1 flex flex-col items-center justify-center font-black transition-colors ${
                  activeTab === 'home' ? 'text-[#16205b]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Home className="w-7 h-7 stroke-[2.5]" />
                <span className="text-xs mt-0.5">HOME</span>
              </button>

              {/* GIANT CENTER ELEVATED SCAN BUTTON FOR ELDERLY */}
              <div className="relative -top-6 flex justify-center">
                <button
                  onClick={() => handleStartScan()}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/50 border-4 border-white active:scale-95 transition-transform"
                  title="Scan QR Code"
                >
                  <QrCode className="w-10 h-10 stroke-[2.8]" />
                  <span className="text-[10px] font-black uppercase tracking-tight">SCAN</span>
                </button>
              </div>

              {/* Call Help 997 */}
              <button
                onClick={() => setIsCallingHelp(true)}
                className="flex-1 flex flex-col items-center justify-center font-black text-red-600 hover:text-red-700 transition-colors"
              >
                <PhoneCall className="w-7 h-7 stroke-[2.5]" />
                <span className="text-xs mt-0.5">HELP 997</span>
              </button>
            </>
          ) : (
            /* -------------------------------------------------------------
               STANDARD MODERN FINTECH 5-BUTTON FLOATING NAVIGATION BAR
               ------------------------------------------------------------- */
            <>
              {/* 1. Home */}
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
                  activeTab === 'home' ? 'text-[#16205b]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-bold mt-0.5">Home</span>
              </button>

              {/* 2. History */}
              <button
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
                  activeTab === 'history' ? 'text-[#16205b]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Clock className={`w-5 h-5 ${activeTab === 'history' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-bold mt-0.5">History</span>
              </button>

              {/* 3. CENTER ELEVATED SCAN BUTTON (PAYPAL / DUITNOW STYLE) */}
              <div className="relative -top-5 flex justify-center">
                <button
                  onClick={() => handleStartScan()}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#16205b] to-blue-600 text-white flex flex-col items-center justify-center shadow-xl shadow-blue-900/30 border-4 border-white active:scale-95 transition-transform"
                  title="Simulate Scan QR Code"
                >
                  <QrCode className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-[8px] font-black uppercase tracking-wider -mt-0.5">SCAN</span>
                </button>
              </div>

              {/* 4. Reports */}
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
                  activeTab === 'reports' ? 'text-[#16205b]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <FileWarning className={`w-5 h-5 ${activeTab === 'reports' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-bold mt-0.5">Reports</span>
              </button>

              {/* 5. Profile */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
                  activeTab === 'profile' ? 'text-[#16205b]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-bold mt-0.5">Profile</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* =============================================================
          MODAL: REPORT SCAM (Slide-Up Modern Modal)
          ============================================================= */}
      {isReporting && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <FileWarning className="w-4 h-4" />
                <span>Submit Scam Incident Report</span>
              </div>
              <button
                onClick={() => setIsReporting(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Incident Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#16205b]"
                >
                  <option value="Fake QR Code">Fake QR Code (Sticker Overwrite)</option>
                  <option value="Fake Payment">Fake Payment (Customer Screenshot Fraud)</option>
                  <option value="Mule Account">Suspicious Mule Account / Bank Mismatch</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Merchant or Location Name</label>
                <input
                  type="text"
                  value={reportMerchant}
                  onChange={(e) => setReportMerchant(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-[#16205b]"
                  placeholder="e.g. Kedai Makan Ali Bangsar"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Incident Description</label>
                <textarea
                  rows="3"
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe what happened (e.g. Scanned QR sticker over real stand, account name changed to stranger)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#16205b]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReporting(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-md transition-all active:scale-98"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL: EMERGENCY & ELDERLY ASSISTANCE
          ============================================================= */}
      {isCallingHelp && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-red-600 font-black text-sm">
                <PhoneCall className="w-4 h-4" />
                <span>Emergency Help & Scam Helpline</span>
              </div>
              <button
                onClick={() => setIsCallingHelp(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              If you feel confused, suspicious, or someone is pressuring you to scan, tap below immediately:
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:997"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('📞 Dialing National Scam Response Centre (NSRC): 997');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-md transition-all active:scale-98"
              >
                <span>🚨 NSRC Hotline (Malaysia)</span>
                <span className="font-mono text-base font-black">997</span>
              </a>

              <button
                onClick={() => {
                  showToast('📞 Calling Registered Guardian / Family: 012-3456789');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-3 rounded-2xl flex items-center justify-between text-xs border border-slate-200"
              >
                <span>👨‍👩‍👧 Call Family / Guardian</span>
                <span className="text-slate-500 font-bold">012-345 6789</span>
              </button>

              <button
                onClick={() => {
                  speakConfirmation("Do not transfer money if you are unsure. Call 997 National Scam Response Centre for advice.");
                  showToast('🔊 Audio guide playing...');
                }}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold p-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs border border-blue-200"
              >
                <Volume2 className="w-4 h-4 text-blue-700" />
                <span>Listen to Spoken Voice Advice</span>
              </button>
            </div>

            <button
              onClick={() => setIsCallingHelp(false)}
              className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL: QUICK VERIFY MERCHANT SSM LOOKUP
          ============================================================= */}
      {isVerifyMerchantOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Merchant SSM Authenticity</span>
              </div>
              <button
                onClick={() => setIsVerifyMerchantOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Every merchant in SafeQR is cross-referenced against the Companies Commission of Malaysia (SSM) and Bank Negara DuitNow registry:
            </p>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-emerald-950 block">Kedai Makan Ali (Verified)</span>
              <span className="text-slate-600 block text-[11px]">SSM: SSM-202301048821 • Maybank</span>
              <span className="text-emerald-700 font-bold block text-[10px]">Registry Status: Legitimate Active Business ✅</span>
            </div>

            <button
              onClick={() => setIsVerifyMerchantOpen(false)}
              className="w-full py-2.5 bg-[#16205b] text-white rounded-2xl text-xs font-bold"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL: NOTIFICATION & SECURITY ALERTS DRAWER
          ============================================================= */}
      {isNotificationsOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-6 duration-300 max-h-[85%] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-xl">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">Security & Network Alerts</h3>
                  <span className="text-[10px] text-slate-500 font-medium">SafeQR Real-Time Threat Center</span>
                </div>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification items */}
            <div className="space-y-2 overflow-y-auto pr-0.5 flex-1 max-h-[300px]">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border text-xs transition-all ${
                    n.unread
                      ? 'bg-blue-50/50 border-blue-200/90 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-black text-slate-900 text-xs">{n.title}</span>
                    <span className="text-[9px] text-slate-400 font-medium shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleMarkNotificationsRead}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
              >
                Mark All as Read
              </button>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="flex-1 py-2.5 bg-[#16205b] hover:bg-[#1f2d7d] text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-98"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
