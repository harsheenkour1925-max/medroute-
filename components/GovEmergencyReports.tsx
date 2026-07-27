import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ComposedChart, Line, Area
} from 'recharts';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Clock, 
  Activity, 
  ShieldAlert,
  Thermometer,
  Zap,
  TrendingDown,
  Navigation
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onBack: () => void;
}

const resorceGapData = [
  { name: 'Insulin', required: 500, available: 320 },
  { name: 'Oxygen', required: 800, available: 750 },
  { name: 'Oncology', required: 200, available: 45 },
  { name: 'IV Fluids', required: 1200, available: 1100 },
  { name: 'Antibiotics', required: 600, available: 200 },
];

const riskAlerts = [
  { id: 1, type: 'Stock', msg: 'Batch BT-1123 dropping below 10% threshold in Hub North', severity: 'Critical', time: '12m ago' },
  { id: 2, type: 'Expiry', msg: 'Emergency Kits (500 units) expiring in 48h - prioritized for deployment', severity: 'High', time: '45m ago' },
  { id: 3, type: 'Prediction', msg: 'Kerala Zone B coverage likely to fail in next 6 hours', severity: 'Critical', time: '1h ago' },
  { id: 4, type: 'Delay', msg: 'TR-102 (Oxaliplatin) delayed by 2h due to route block', severity: 'Medium', time: '2h ago' },
];

const GovEmergencyReports: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="bg-[#030a1a] text-white min-h-screen p-6 md:p-12 border-t-8 border-rose-600">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-xs mb-4 hover:text-rose-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Emergency Control
          </button>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-rose-600 rounded-full animate-ping" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Emergency Impact Audit</h1>
          </div>
          <p className="text-rose-500/60 font-bold uppercase tracking-widest text-[10px] mt-2">Classified: Internal Government Use Only</p>
        </div>
        
        <div className="px-6 py-3 bg-rose-600/10 border border-rose-500/20 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Global Status</div>
            <div className="text-xl font-black text-rose-400">CRITICAL</div>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Active Emergency Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-rose-950/20 p-8 rounded-[2rem] border border-rose-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MapPin className="w-16 h-16 text-rose-500" />
            </div>
            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Affected Regions</div>
            <div className="text-4xl font-black mb-1">03</div>
            <div className="text-xs font-bold text-rose-500/60">Kerala, Gujarat, Odisha</div>
          </div>

          <div className="bg-rose-950/20 p-8 rounded-[2rem] border border-rose-500/20">
            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Patients Impacted</div>
            <div className="text-4xl font-black mb-1">~42,500</div>
            <div className="text-[10px] font-black text-rose-600 bg-rose-600/10 px-2 py-1 rounded-md inline-block mt-2">SEVERITY: HIGH</div>
          </div>

          <div className="bg-rose-950/20 p-8 rounded-[2rem] border border-rose-500/20">
            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Meds in Shortage</div>
            <div className="text-4xl font-black mb-1">12</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-rose-500" />
              </div>
              <span className="text-[10px] font-bold text-rose-500">85%</span>
            </div>
          </div>

          <div className="bg-rose-600 p-8 rounded-[2rem] border border-white/20 shadow-xl shadow-rose-900/40">
            <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Response Window</div>
            <div className="text-4xl font-black mb-1 text-white">36 Hours</div>
            <div className="text-xs font-bold text-white/80 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Time-Critical Zone
            </div>
          </div>
        </div>

        {/* Resource Gap chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-[#0f172a]/40">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Available vs Required Resources
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resorceGapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Bar dataKey="required" fill="#334155" radius={[4, 4, 0, 0]} name="Required Units" />
                  <Bar dataKey="available" fill="#e11d48" radius={[4, 4, 0, 0]} name="Available / En Route">
                    {resorceGapData.map((entry, index) => (
                      <Cell key={index} fill={entry.available < entry.required * 0.5 ? '#ef4444' : '#e11d48'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Gap Analysis</div>
                <div className="text-[10px] text-slate-500">Antibiotics and Oncology meds show critical supply gaps (&gt;60% deficit).</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-[#0f172a]/40">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Risk & Failure Alerts
            </h3>
            <div className="space-y-4">
              {riskAlerts.map((alert) => (
                <div key={alert.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-rose-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        alert.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{alert.time}</span>
                    </div>
                    <AlertTriangle className={`w-4 h-4 ${alert.severity === 'Critical' ? 'text-rose-500' : 'text-amber-500'}`} />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{alert.msg}</p>
                </div>
              ))}
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400">
                View All Network Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Time Critical Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-[#0f172a]/40">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <div className="text-3xl font-black mb-1">4.2 Hrs</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Response Time</div>
              <div className="mt-4 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full inline-block">
                -15% Improvement
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border border-white/5 bg-[#0f172a]/40">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-rose-400">
              <Navigation className="w-5 h-5" />
              Emergency Supply Chain Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="text-2xl font-black text-emerald-400 mb-1">18</div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">En Route Deliveries</div>
              </div>
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="text-2xl font-black text-amber-400 mb-1">42</div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pending Dispatches</div>
              </div>
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="text-2xl font-black text-rose-500 mb-1">05</div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Blocked Shipments</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-sky-500/10 rounded-[2rem] border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">AI Rerouting Suggestions</div>
                  <div className="text-[10px] text-slate-400">03 routes optimized to bypass high-risk zones in Kerala.</div>
                </div>
              </div>
              <button className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                Execute Reroute
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovEmergencyReports;
