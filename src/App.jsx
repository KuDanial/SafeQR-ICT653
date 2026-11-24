import React, { useState } from 'react';
import PhoneContainer from './components/PhoneContainer';
import AuthScreen from './components/AuthScreen';
import CustomerDashboard from './components/CustomerDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import AdminDashboard from './components/AdminDashboard';
import {
  initialMerchants,
  initialPendingVerifications,
  initialScamReports,
  initialMerchantTransactions
} from './data/mockData';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('customer'); // 'customer' | 'merchant' | 'admin' | 'login'
  const [activeUser, setActiveUser] = useState({
    name: 'Ahmad Faiz',
    email: 'customer@safeqr.my',
    role: 'customer'
  });

  // Global Mock States (persists interactions across roles!)
  const [merchants, setMerchants] = useState(initialMerchants);
  const [pendingVerifications, setPendingVerifications] = useState(initialPendingVerifications);
  const [scamReports, setScamReports] = useState(initialScamReports);
  const [merchantTransactions, setMerchantTransactions] = useState(initialMerchantTransactions);

  // Elderly Mode state
  const [elderlyMode, setElderlyMode] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimer, setToastTimer] = useState(null);

  const showToast = (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    setToastTimer(timer);
  };

  // Admin Handlers
  const handleApproveMerchant = (id) => {
    setPendingVerifications(prev =>
      prev.map(v => (v.id === id ? { ...v, status: 'Approved' } : v))
    );
  };

  const handleRejectMerchant = (id) => {
    setPendingVerifications(prev =>
      prev.map(v => (v.id === id ? { ...v, status: 'Rejected' } : v))
    );
  };

  const handleResolveScamReport = (id) => {
    setScamReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Resolved' } : r))
    );
  };

  // New merchant registration lands in the admin approval queue
  const handleRegisterMerchant = ({ businessName, identifier, documentsAttached }) => {
    const digits = Date.now().toString().slice(-8);
    setPendingVerifications(prev => [
      {
        id: `pv-${digits}`,
        businessName,
        ownerName: identifier,
        category: 'New Registration',
        ssmNumber: `SSM-2026${digits}`,
        submittedAt: 'Just now',
        location: 'Malaysia',
        status: 'Pending',
        documentsAttached
      },
      ...prev
    ]);
    showToast(`📄 "${businessName}" submitted for SafeQR verification.`);
  };

  // Customer adds new report
  const handleAddScamReport = (newReport) => {
    const reportObj = {
      id: `sr-${Date.now().toString().slice(-4)}`,
      status: 'Investigating',
      reportedAt: 'Just now',
      ...newReport
    };
    setScamReports(prev => [reportObj, ...prev]);
  };

  // Merchant adds transaction
  const handleAddTransaction = (newTx) => {
    setMerchantTransactions(prev => [newTx, ...prev]);
  };

  // Cross-system simulated payment (when customer pays, it lands on merchant ledger!)
  const handleSimulateMerchantPayment = ({ customerName, amount, merchantName }) => {
    const newTx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      customerName: customerName || 'Ahmad Faiz (SafeQR)',
      amount: amount || 15.00,
      time: 'Just now',
      status: 'Real-Time Settled ✅',
      authRef: `SQ-${Date.now().toString().slice(-6)}-MY`,
      method: 'DuitNow QR via SafeQR Guard'
    };
    setMerchantTransactions(prev => [newTx, ...prev]);
  };

  return (
    <PhoneContainer
      role={role}
      onRoleChange={setRole}
      activeUser={activeUser}
      onLogout={() => setRole('login')}
    >
      {/* Dynamic Role Views */}
      {role === 'login' && (
        <AuthScreen
          onSelectRole={(selectedRole) => setRole(selectedRole)}
          onRegisterMerchant={handleRegisterMerchant}
          onLoginSuccess={(user) => {
            setActiveUser(user);
            showToast(`Welcome, ${user.name}! Mode: ${user.role.toUpperCase()}`);
          }}
        />
      )}

      {role === 'customer' && (
        <CustomerDashboard
          merchants={merchants}
          onAddScamReport={handleAddScamReport}
          onSimulateMerchantPayment={handleSimulateMerchantPayment}
          elderlyMode={elderlyMode}
          setElderlyMode={setElderlyMode}
          showToast={showToast}
        />
      )}

      {role === 'merchant' && (
        <MerchantDashboard
          transactions={merchantTransactions}
          onAddTransaction={handleAddTransaction}
          showToast={showToast}
        />
      )}

      {role === 'admin' && (
        <AdminDashboard
          pendingVerifications={pendingVerifications}
          onApproveMerchant={handleApproveMerchant}
          onRejectMerchant={handleRejectMerchant}
          scamReports={scamReports}
          onResolveScamReport={handleResolveScamReport}
          showToast={showToast}
        />
      )}

      {/* Floating System Toast (White Mode) */}
      {toastMessage && (
        <div className="absolute top-12 inset-x-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-bold px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 ring-1 ring-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </div>
      )}
    </PhoneContainer>
  );
}
