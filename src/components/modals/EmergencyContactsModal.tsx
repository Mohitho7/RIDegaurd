import React, { useState } from 'react';
import { X, Phone, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

interface EmergencyContactsModalProps {
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({ onClose }) => {
  const [contacts] = useState<Contact[]>([
    {
      id: 'c1',
      name: 'Sarah Mohith',
      phone: '+91 98765 43210',
      relation: 'Spouse',
      isPrimary: true,
    },
    {
      id: 'c2',
      name: 'Dr. R. Verma',
      phone: '+91 98450 12345',
      relation: 'Family Physician',
      isPrimary: false,
    },
  ]);

  const [autoTransmit, setAutoTransmit] = useState<boolean>(true);
  const [testAlertSent, setTestAlertSent] = useState<boolean>(false);

  const handleTestSimulatedAlert = () => {
    setTestAlertSent(true);
    setTimeout(() => setTestAlertSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#0E121A] border border-white/20 rounded-3xl p-5 space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-400" />
            <span className="font-['Space_Grotesk'] font-bold text-sm text-white">
              EMERGENCY CONTACTS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice */}
        <p className="text-[11px] text-slate-400 font-mono leading-tight">
          Designated contacts receive preserved journey-state context only if an incident is confirmed.
        </p>

        {/* Contacts List */}
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.name}</span>
                {c.isPrimary && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                    PRIMARY
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-300 font-mono">{c.phone}</div>
              <div className="text-[10px] text-slate-500 font-mono">{c.relation}</div>
            </div>
          ))}
        </div>

        {/* Auto-transmit Toggle */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#00FF87]" />
              <span className="text-xs font-bold text-white">Auto-Package Payload</span>
            </div>
            <button
              onClick={() => setAutoTransmit(!autoTransmit)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoTransmit ? 'bg-[#00FF87]' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${
                  autoTransmit ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Automatically compile location, deceleration severity, and vehicle orientation if ASSIST triggers.
          </p>
        </div>

        {/* Test Alert Simulator Button */}
        <div className="pt-1 space-y-2">
          <button
            onClick={handleTestSimulatedAlert}
            className="w-full py-2.5 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {testAlertSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PAYLOAD BROADCAST SIMULATED (OK)</span>
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5" />
                <span>TEST SIMULATED NOTIFICATION</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
