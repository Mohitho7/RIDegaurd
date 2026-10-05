import React, { useState } from 'react';
import { SensorData, JourneyState, TimelineEvent, JourneyContext } from '../../types/journey';
import { X, Cpu, Activity, Radio, Mic, Eye } from 'lucide-react';

interface TechInspectorViewProps {
  sensor: SensorData;
  state: JourneyState;
  context: JourneyContext;
  timeline: TimelineEvent[];
  onClose: () => void;
}

export const TechInspectorView: React.FC<TechInspectorViewProps> = ({
  sensor,
  state: _state,
  context: _context,
  timeline,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'SENSORS' | 'OFFICE_KIT' | 'PIPELINE'>('SENSORS');

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-6 animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#0D111A] border-2 border-white/20 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-[#00FF87]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] font-black text-lg text-white">
                  TECH INSPECTOR: LIVE TELEMETRY
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  SIMULATED
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Primary Question: "What signals is the system using?"
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest Disclosure Notice */}
        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 space-y-0.5">
          <span className="text-[#00FF87] font-mono font-bold">ARCHITECTURE TRUTH:</span>
          <p className="text-slate-300 leading-relaxed">
            The multimodal reasoning and journey-state transitions run locally in the browser engine. The sensor values below represent structured simulated streams modeled on iQOO smartphone hardware.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 shrink-0 text-xs font-mono">
          <button
            onClick={() => setActiveTab('SENSORS')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'SENSORS'
                ? 'bg-[#00FF87] text-black font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Sensors
          </button>
          <button
            onClick={() => setActiveTab('OFFICE_KIT')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'OFFICE_KIT'
                ? 'bg-sky-400 text-black font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Office Kit Log
          </button>
          <button
            onClick={() => setActiveTab('PIPELINE')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'PIPELINE'
                ? 'bg-amber-400 text-black font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pipeline Flow
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: SENSORS */}
          {activeTab === 'SENSORS' && (
            <div className="space-y-3.5">
              {/* LEVEL 1: HERO PRIMARY HEADER */}
              <div className="p-3.5 rounded-2xl bg-[#00FF87]/10 border border-[#00FF87]/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#00FF87] uppercase font-bold">
                    PRIMARY SIGNAL STREAM
                  </div>
                  <div className="font-['Space_Grotesk'] font-black text-base text-white">
                    SIMULATED SENSOR STREAM
                  </div>
                </div>
                <div className="text-right font-mono text-xs text-slate-300">
                  <span className="text-[#00FF87] font-bold">50 Hz Continuous</span>
                  <div className="text-slate-400 text-[11px]">iQOO Multi-Sensor Target</div>
                </div>
              </div>

              {/* LEVEL 2: 4 SENSOR TILES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. IMU Motion */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-400" />
                      <span>50Hz IMU ACCELEROMETER</span>
                    </span>
                    <span className="text-slate-400">Continuous</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 text-[11px]">ACCEL X</div>
                      <div className="text-white font-bold text-sm">{sensor.accelX.toFixed(2)}</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 text-[11px]">ACCEL Y</div>
                      <div className="text-white font-bold text-sm">{sensor.accelY.toFixed(2)}</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 text-[11px]">ACCEL Z</div>
                      <div className="text-white font-bold text-sm">{sensor.accelZ.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* 2. GNSS Positioning */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-sky-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-sky-400" />
                      <span>GNSS CORRIDOR FIX</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{sensor.gnssAccuracy}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 text-[11px]">FIX QUALITY</div>
                      <div className="text-white font-bold text-sm">{sensor.gnssFix}</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 text-[11px]">GROUND SPEED</div>
                      <div className="text-[#00FF87] font-bold text-sm">{Math.round(sensor.speed)} KM/H</div>
                    </div>
                  </div>
                </div>

                {/* 3. Acoustic */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-purple-400" />
                      <span>ACOUSTIC PATTERN</span>
                    </span>
                    <span className="text-purple-400">Event-Gated</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-white font-bold text-xs">{sensor.audioClass}</div>
                    <div className="text-slate-400 text-xs font-mono">{sensor.audioDecibels} dB Ambient Level</div>
                  </div>
                </div>

                {/* 4. Camera */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-teal-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-teal-400" />
                      <span>CAMERA CONTEXT</span>
                    </span>
                    <span className="text-teal-400">Triggered Cues</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-white font-bold text-xs">{sensor.cameraClass}</div>
                    <div className="text-slate-400 text-xs font-mono">Tilt {sensor.gyroTilt.toFixed(0)}° • {sensor.deviceState}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICE KIT */}
          {activeTab === 'OFFICE_KIT' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold">
                POST-TRIP TIMELINE AUDIT (HYDERABAD → HITAM)
              </div>
              <div className="space-y-2">
                {timeline.map((event) => (
                  <div key={event.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-1">
                      <span className="text-sky-400 font-bold">{event.timeString}</span>
                      <span className="text-[#00FF87] font-bold">{event.state}</span>
                    </div>
                    <div className="font-bold text-white text-sm">{event.title}</div>
                    <p className="text-xs text-slate-300 mt-0.5">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PIPELINE */}
          {activeTab === 'PIPELINE' && (
            <div className="space-y-2.5 text-xs">
              <div className="text-slate-400 font-mono text-xs uppercase font-bold">
                LOCAL INTELLIGENCE ARCHITECTURE BLUEPRINT
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-black text-[#00FF87] font-mono text-sm">1. Local Preprocessing</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  50Hz IMU low-pass filtering, motion gate threshold evaluation, and rolling window buffers.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-black text-cyan-300 font-mono text-sm">2. Context Validation</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Corridor GIS match, acoustic pattern classification, and camera visual horizon cues.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-black text-amber-300 font-mono text-sm">3. Journey State Evaluator</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Determines whether to stay quiet, prompt 1-tap confirmation, or ready emergency assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold cursor-pointer transition-colors shrink-0"
        >
          CLOSE TECHNICAL VIEW
        </button>
      </div>
    </div>
  );
};

