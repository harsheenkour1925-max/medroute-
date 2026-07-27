import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ComposedChart, Area
} from 'recharts';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onBack: () => void;
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const donationData = [
  { name: 'Antibiotics', value: 400 },
  { name: 'Oncology', value: 300 },
  { name: 'Chronic Care', value: 300 },
  { name: 'Emergency', value: 200 },
  { name: 'General', value: 100 },
];

const sourceData = [
  { name: 'Apollo Hosp.', value: 1250 },
  { name: 'Max Health', value: 980 },
  { name: 'Fortis', value: 860 },
  { name: 'NGO SaveLife', value: 720 },
  { name: 'Red Cross', value: 650 },
].sort((a, b) => b.value - a.value);

const demandData = [
  { name: 'Insulin', value: 450 },
  { name: 'Amoxicillin', value: 380 },
  { name: 'Metformin', value: 320 },
  { name: 'Atorvastatin', value: 290 },
  { name: 'Paracetamol', value: 250 },
];

const expiryData = [
  { name: 'Hub North', '30d': 120, '60d': 80, '90d': 40 },
  { name: 'Hub West', '30d': 90, '60d': 110, '90d': 60 },
  { name: 'Hub South', '30d': 140, '60d': 70, '90d': 90 },
  { name: 'Hub East', '30d': 80, '60d': 95, '90d': 110 },
];

const riskTable = [
  { batch: 'BT-9901', med: 'Remdesivir', hub: 'KOL-03', days: 12, risk: 'High', flag: '#ef4444' },
  { batch: 'BT-4422', med: 'Oxaliplatin', hub: 'DEL-01', days: 28, risk: 'Medium', flag: '#f59e0b' },
  { batch: 'BT-1123', med: 'Azithromycin', hub: 'MUM-02', days: 45, risk: 'Low', flag: '#10b981' },
  { batch: 'BT-8871', med: 'Cisplatin', hub: 'CHN-02', days: 8, risk: 'High', flag: '#ef4444' },
];

const transitTable = [
  { id: 'TR-102', from: 'Delhi', to: 'Patna', item: 'Insulin', status: 'In Transit', ETA: '4h' },
  { id: 'TR-105', from: 'Mumbai', to: 'Pune', item: 'IV Fluids', status: 'Near Hub', ETA: '1h' },
  { id: 'TR-109', from: 'Kolkata', to: 'Ranchi', item: 'Antibiotics', status: 'Departed', ETA: '8h' },
];

const requestTable = [
  { id: 'REQ-44', beneficiary: 'Rahul S.', ayushmanId: '5566-xxxx-x123', med: 'Insulin', status: 'Pending Approval' },
  { id: 'REQ-45', beneficiary: 'Anita K.', ayushmanId: '8811-xxxx-x990', med: 'Cisplatin', status: 'Approved' },
  { id: 'REQ-46', beneficiary: 'Sunil V.', ayushmanId: '3321-xxxx-x442', med: 'Metformin', status: 'In Delivery' },
];

const GovReports: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="bg-[#030a1a] text-white min-h-screen p-6 md:p-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-xs mb-4 hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Detailed Analysis</h1>
          <p className="text-slate-500 font-medium mt-2">Comprehensive pharmaceutical redistribution audit for May 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-sky-500/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                <IndianRupee className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md tracking-widest">+12% vs LY</span>
            </div>
            <div className="text-3xl font-black mb-1">₹4.2M</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Cost Savings</div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md tracking-widest">Live Flow</span>
            </div>
            <div className="text-3xl font-black mb-1">12,840</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Beneficiaries Served</div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md tracking-widest">Attention Req.</span>
            </div>
            <div className="text-3xl font-black mb-1">15.4%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unfulfilled Requests</div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md tracking-widest">Risk Index</span>
            </div>
            <div className="text-3xl font-black mb-1">84/100</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Efficiency Score</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 h-[450px]">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              Donation Distribution (May)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-white/5 h-[450px]">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
              Expiry Timeline (Next 90 Days)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expiryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#ffffff05'}} />
                  <Legend verticalAlign="bottom" height={36}/>
                  <Bar dataKey="30d" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="60d" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="90d" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5">
            <h3 className="text-xl font-bold mb-8">Top Donating Sources</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[0, 10, 10, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-white/5">
            <h3 className="text-xl font-bold mb-8">Most Demanded Medicines</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Risk Score & Delivery Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card p-10 rounded-[3rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-rose-500" />
              High Risk Batches
            </h3>
            <div className="space-y-4">
              {riskTable.map((item, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                  <div>
                    <div className="text-xs font-black text-sky-400 uppercase tracking-widest">{item.batch}</div>
                    <div className="text-sm font-bold text-white mt-1">{item.med}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-1">Location: {item.hub}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black" style={{ color: item.flag }}>{item.risk}</div>
                    <div className="text-lg font-black text-white">{item.days}d</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-tighter">Remaining</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              Live Transit Monitor
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transfer ID</th>
                    <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Route</th>
                    <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Item</th>
                    <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transitTable.map((item, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-all">
                      <td className="py-4 text-sky-400 font-bold text-xs">{item.id}</td>
                      <td className="py-4 text-xs font-medium">
                        {item.from} → {item.to}
                      </td>
                      <td className="py-4 text-xs font-medium">{item.item}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black rounded uppercase tracking-tighter">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-bold text-white">{item.ETA}</td>
                    </tr>
                  ))}
                  <tr className="group hover:bg-white/5 transition-all">
                    <td className="py-4 text-emerald-400 font-bold text-xs">DL-882 (Complete)</td>
                    <td className="py-4 text-xs font-medium">Kochi → Chennai</td>
                    <td className="py-4 text-xs font-medium">Vaccines (Batch C)</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded uppercase tracking-tighter">
                        Delivered
                      </span>
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Requests & Ayushman ID Table */}
        <div className="glass-card p-10 rounded-[3rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
              Patient Request Audit
            </h3>
            <div className="text-[10px] font-black text-amber-400 px-3 py-1 bg-amber-400/10 rounded-full uppercase tracking-widest">
              Live Verified Requests
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Request ID</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Receiver</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ayushmaan ID</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Medicine</th>
                  <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requestTable.map((item, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-all">
                    <td className="py-5 text-sky-400 font-bold text-xs">{item.id}</td>
                    <td className="py-5 text-sm font-bold text-white">{item.beneficiary}</td>
                    <td className="py-5 font-mono text-[10px] text-slate-400">{item.ayushmanId}</td>
                    <td className="py-5 text-xs font-medium text-slate-300">{item.med}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        {item.status.includes('Approved') || item.status.includes('Delivery') ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        )}
                        <span className="text-xs font-bold text-white">{item.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donors Table (Month) */}
        <div className="glass-card p-10 rounded-[3rem] border border-white/5">
          <h3 className="text-xl font-bold mb-8">Monthly Donor Recognition (Top 5)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {sourceData.map((donor, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center group hover:bg-sky-500/10 hover:border-sky-500/20 transition-all duration-500">
                <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-400 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Rank #{i+1}</div>
                <div className="text-sm font-bold text-white mb-2">{donor.name}</div>
                <div className="text-lg font-black text-sky-400">{donor.value} Units</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovReports;
