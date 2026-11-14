import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  UserCheck,
  Check,
  X,
  Search,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminDashboard({
  pendingVerifications,
  onApproveMerchant,
  onRejectMerchant,
  scamReports,
  onResolveScamReport,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('verifications'); // verifications | reports
  const [filterText, setFilterText] = useState('');

  const filteredVerifications = pendingVerifications.filter(v =>
    v.businessName.toLowerCase().includes(filterText.toLowerCase()) ||
    v.ssmNumber.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredReports = scamReports.filter(r =>
    r.merchantName.toLowerCase().includes(filterText.toLowerCase()) ||
    r.type.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50/70 text-slate-800">
      <div className="space-y-3.5">
        {/* Admin Header (Modern Card) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-900/10">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-base tracking-tight">SafeQR Admin Console</h1>
              <p className="text-[11px] text-slate-500 font-medium">National QR Verification & Anti-Fraud Hub</p>
            </div>
          </div>

          <span className="bg-purple-100 text-purple-800 text-[10px] font-mono border border-purple-200 px-2.5 py-1 rounded-full font-bold">
            Officer Kamal
          </span>
        </div>

        {/* Metric Badges (Modern Glassmorphic Cards) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Pending</span>
            <span className="text-xl font-black text-amber-600">
              {pendingVerifications.filter(v => v.status === 'Pending').length}
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Active</span>
            <span className="text-xl font-black text-rose-600">
              {scamReports.filter(r => r.status !== 'Resolved').length}
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Resolved</span>
            <span className="text-xl font-black text-emerald-600">
              {scamReports.filter(r => r.status === 'Resolved').length}
            </span>
          </div>
        </div>

        {/* Tab Controls (Rounded-full Pills) */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-2xl border border-slate-300/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              activeTab === 'verifications'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Merchants ({pendingVerifications.filter(v => v.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              activeTab === 'reports'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reports ({scamReports.filter(r => r.status !== 'Resolved').length})</span>
          </button>
        </div>

        {/* Search input with modern rounded border */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={activeTab === 'verifications' ? "Filter business name / SSM..." : "Filter scam reports..."}
            className="w-full bg-white border border-slate-200/90 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium shadow-2xs"
          />
        </div>

        {/* =============================================================
            TAB 1: PENDING MERCHANT VERIFICATIONS
            ============================================================= */}
        {activeTab === 'verifications' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
            {filteredVerifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No pending merchant verifications found.
              </div>
            ) : (
              filteredVerifications.map((merchant) => (
                <div
                  key={merchant.id}
                  className={`bg-white border rounded-3xl p-3.5 text-xs shadow-2xs transition-all ${
                    merchant.status === 'Approved'
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : merchant.status === 'Rejected'
                      ? 'border-red-300 bg-red-50/40 opacity-70'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">
                        {merchant.businessName}
                      </h3>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Owner: {merchant.ownerName} • {merchant.category}
                      </p>
                      <p className="text-[10px] text-purple-700 font-mono font-bold mt-0.5">
                        {merchant.ssmNumber} • {merchant.location}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        merchant.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : merchant.status === 'Rejected'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {merchant.status}
                    </span>
                  </div>

                  {/* Documents & Submission time */}
                  <div className="mt-2 text-[10px] text-slate-500 flex flex-wrap items-center gap-1.5 font-medium">
                    <span>Docs:</span>
                    {merchant.documentsAttached.map((doc, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold border border-slate-200">
                        📄 {doc}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  {merchant.status === 'Pending' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          onApproveMerchant(merchant.id);
                          showToast(`✅ Approved "${merchant.businessName}" as Official Verified Merchant!`);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => {
                          onRejectMerchant(merchant.id);
                          showToast(`❌ Rejected "${merchant.businessName}" verification.`);
                        }}
                        className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-xs active:scale-95 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* =============================================================
            TAB 2: SCAM REPORTS
            ============================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No scam reports found.
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white border rounded-3xl p-3.5 text-xs shadow-2xs ${
                    report.status === 'Resolved'
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-red-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-wide block">
                        🚨 {report.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {report.merchantName}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 mb-2 font-medium leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Reported by: <strong>{report.reporter}</strong></span>
                    <span>{report.reportedAt}</span>
                  </div>

                  {report.status !== 'Resolved' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => {
                          onResolveScamReport(report.id);
                          showToast(`🛡️ Resolved Scam Report for "${report.merchantName}"! QR Blacklisted & PDRM notified.`);
                        }}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Resolved & Blacklist Mule</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Admin Safety Footer */}
      <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-200/80 font-semibold">
        SafeQR Admin • Connected to National Scam Response Centre (NSRC 997)
      </div>
    </div>
  );
}
