
import React from 'react';

const NGODashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-3xl font-black">NGO Portal: Hope Foundation</h2>
        <p className="text-slate-500">Verification & Redistribution Management Hub</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-12">
        {[
            { label: "Pending Verification", val: "24", color: "text-amber-600" },
            { label: "Inventory Units", val: "1,450", color: "text-blue-600" },
            { label: "Distributed Today", val: "112", color: "text-emerald-600" },
            { label: "Active Requests", val: "45", color: "text-indigo-600" }
        ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className={`text-3xl font-black ${s.color} mb-1`}>{s.val}</div>
                <div className="text-xs font-bold text-slate-400 uppercase">{s.label}</div>
            </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-xl font-bold mb-6">Redistribution Queue</h3>
          <table className="w-full">
            <thead>
                <tr className="text-left text-xs text-slate-400 uppercase">
                    <th className="pb-4">Medicine</th>
                    <th className="pb-4">Target</th>
                    <th className="pb-4">Priority</th>
                    <th className="pb-4">Action</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                <tr className="border-t border-slate-50">
                    <td className="py-4">
                        <div className="font-bold">Atenolol 50mg</div>
                        <div className="text-xs text-slate-500">Batch #9922</div>
                    </td>
                    <td className="py-4 font-medium">Bandra Slum Clinic</td>
                    <td className="py-4"><span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold text-[10px]">CRITICAL</span></td>
                    <td className="py-4"><button className="text-indigo-600 font-bold">Assign Delivery</button></td>
                </tr>
                <tr className="border-t border-slate-50">
                    <td className="py-4">
                        <div className="font-bold">Cough Syrup (Vicks)</div>
                        <div className="text-xs text-slate-500">Batch #9921</div>
                    </td>
                    <td className="py-4 font-medium">Community Care Center</td>
                    <td className="py-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px]">MEDIUM</span></td>
                    <td className="py-4"><button className="text-indigo-600 font-bold">Assign Delivery</button></td>
                </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Inventory Management</h3>
            <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold">Antibiotics</span>
                        <span className="text-xs text-emerald-400">High Stock</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-3/4"></div>
                    </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold">Insulin</span>
                        <span className="text-xs text-red-400">Critical Low</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 w-1/5"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
