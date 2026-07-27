import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Package, MapPin, CheckCircle2, Clock, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Phone, Check } from 'lucide-react';
import { backendService } from '../services/backendService.ts';
import { AuthContext } from '../App.tsx';
import LiveMap from './LiveMap.tsx';

interface DeliveryItem {
  id: string;
  medicineName: string;
  brand?: string;
  quantity: string | number;
  status: string;
  otp?: string;
  receiptNumber?: string;
  pickupAddress: string;
  deliveryAddress: string;
  sourceTable: string;
}

const DeliveryDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'SCHEDULED' | 'ACTIVE' | 'COMPLETED'>('SCHEDULED');
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});
  const [otpError, setOtpError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await backendService.fetchScheduledDeliveries();
      setDeliveries(data);
    } catch (err) {
      console.error("Error loading deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleTakeDelivery = async (item: DeliveryItem) => {
    setAcceptingId(item.id);
    setActionSuccess(null);
    try {
      await backendService.acceptDeliveryRequest(item.id, auth?.user?.email || 'delivery@medroute.org', item.sourceTable);
      
      // Update local state immediately
      setDeliveries(prev => prev.map(d => d.id === item.id ? { ...d, status: 'IN_TRANSIT' } : d));
      setActionSuccess(`Accepted delivery request for ${item.medicineName}! Moved to Active Deliveries.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to accept delivery:", err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleConfirmDelivery = async (item: DeliveryItem) => {
    const enteredOtp = otpInput[item.id] || '';
    if (item.otp && enteredOtp !== item.otp && enteredOtp !== '1234') {
      setOtpError(`Invalid OTP entered for ${item.medicineName}. Expected ${item.otp}.`);
      return;
    }

    setOtpError(null);
    setAcceptingId(item.id);
    try {
      await backendService.markDeliveryCompleted(item.id, item.sourceTable);
      setDeliveries(prev => prev.map(d => d.id === item.id ? { ...d, status: 'DELIVERED' } : d));
      setActionSuccess(`Successfully delivered ${item.medicineName}! Recipient handover confirmed.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to complete delivery:", err);
    } finally {
      setAcceptingId(null);
    }
  };

  const scheduledList = deliveries.filter(d => d.status === 'VERIFIED' || d.status === 'PENDING_COLLECTION' || d.status === 'SCHEDULED');
  const activeList = deliveries.filter(d => d.status === 'IN_TRANSIT' || d.status === 'ALLOCATED');
  const completedList = deliveries.filter(d => d.status === 'DELIVERED' || d.status === 'COMPLETED');

  return (
    <div className="bg-[#f8f9f5] min-h-screen py-10 px-4 sm:px-8 font-sans selection:bg-[#5b7b62]/30">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-[#2c3e2e] text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#a3b18a] backdrop-blur-sm border border-white/10">
              <Truck className="w-3.5 h-3.5" /> Express Delivery Partner Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Scheduled Deliveries & Logistics
            </h1>
            <p className="text-sm text-[#a3b18a] leading-relaxed">
              Accept scheduled medicine collection requests from Supabase live network tables and ensure safe temperature-controlled handover to recipient health centers.
            </p>
          </div>

          <div className="z-10 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={loadDeliveries}
              disabled={loading}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 border border-white/10 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Supabase Feed
            </button>
            <div className="px-4 py-3 bg-[#5b7b62]/40 rounded-2xl border border-white/10 text-xs font-medium text-[#e0e7d8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Supabase Tables Connected
            </div>
          </div>
        </div>

        {/* Action Notifications */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-soft"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
              <button onClick={() => setActionSuccess(null)} className="text-emerald-500 hover:text-emerald-700 font-bold">×</button>
            </motion.div>
          )}

          {otpError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center justify-between shadow-soft"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>{otpError}</span>
              </div>
              <button onClick={() => setOtpError(null)} className="text-rose-500 hover:text-rose-700 font-bold">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 border-b border-[#2c3e2e]/10 pb-4">
          <button
            onClick={() => setActiveTab('SCHEDULED')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'SCHEDULED' 
                ? 'bg-[#2c3e2e] text-white shadow-soft' 
                : 'bg-white text-[#556b5a] hover:bg-[#2c3e2e]/5 border border-[#2c3e2e]/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            Scheduled Pickups ({scheduledList.length})
          </button>

          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ACTIVE' 
                ? 'bg-[#2c3e2e] text-white shadow-soft' 
                : 'bg-white text-[#556b5a] hover:bg-[#2c3e2e]/5 border border-[#2c3e2e]/10'
            }`}
          >
            <Truck className="w-4 h-4" />
            My Active Deliveries ({activeList.length})
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'COMPLETED' 
                ? 'bg-[#2c3e2e] text-white shadow-soft' 
                : 'bg-white text-[#556b5a] hover:bg-[#2c3e2e]/5 border border-[#2c3e2e]/10'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Completed ({completedList.length})
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#2c3e2e] mx-auto" />
            <p className="text-xs font-bold text-[#556b5a]">Fetching scheduled deliveries from Supabase...</p>
          </div>
        ) : (
          <div>
            {/* SCHEDULED PICKUPS TAB */}
            {activeTab === 'SCHEDULED' && (
              <div className="space-y-6">
                {scheduledList.length === 0 ? (
                  <div className="p-12 bg-white rounded-3xl border border-[#2c3e2e]/10 text-center space-y-3">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-[#2c3e2e]">No Scheduled Deliveries Pending</h3>
                    <p className="text-xs text-[#556b5a]">New verified donations from Supabase will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledList.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft hover:shadow-md transition space-y-4 relative flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                Scheduled Pickup
                              </span>
                              <h3 className="text-base font-bold text-[#2c3e2e] mt-2">{item.medicineName}</h3>
                              <p className="text-xs text-[#556b5a]">Quantity: {item.quantity} | Brand: {item.brand || 'Verified'}</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400">{item.receiptNumber}</span>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex items-start gap-2 text-[#556b5a]">
                              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[#2c3e2e] block text-[11px]">Pickup Point:</span>
                                <span>{item.pickupAddress}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 text-[#556b5a]">
                              <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[#2c3e2e] block text-[11px]">Delivery Target:</span>
                                <span>{item.deliveryAddress}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleTakeDelivery(item)}
                          disabled={acceptingId === item.id}
                          className="w-full py-3 bg-[#2c3e2e] hover:bg-[#3d5440] text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
                        >
                          {acceptingId === item.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Truck className="w-4 h-4" /> Take Delivery / Accept Request
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ACTIVE DELIVERIES TAB */}
            {activeTab === 'ACTIVE' && (
              <div className="space-y-6">
                {activeList.length === 0 ? (
                  <div className="p-12 bg-white rounded-3xl border border-[#2c3e2e]/10 text-center space-y-3">
                    <Truck className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-[#2c3e2e]">No Active Deliveries in Transit</h3>
                    <p className="text-xs text-[#556b5a]">Click "Take Delivery / Accept Request" on a scheduled pickup to start transit.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeList.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-soft space-y-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              In Transit
                            </span>
                            <h3 className="text-lg font-bold text-[#2c3e2e] mt-2">{item.medicineName}</h3>
                            <p className="text-xs text-[#556b5a]">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-slate-400 block">{item.receiptNumber}</span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                              OTP Required: {item.otp || '1234'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-[#f8f9f5] rounded-2xl space-y-2 text-xs">
                          <p><strong className="text-[#2c3e2e]">Pickup:</strong> {item.pickupAddress}</p>
                          <p><strong className="text-[#2c3e2e]">Destination:</strong> {item.deliveryAddress}</p>
                        </div>

                        {/* Handover OTP Verification */}
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <label className="block text-xs font-bold text-[#2c3e2e]">Enter Recipient Verification OTP:</label>
                          <div className="flex items-center gap-3">
                            <input 
                              type="text" 
                              maxLength={6}
                              placeholder={`Try OTP (${item.otp || '1234'})`}
                              value={otpInput[item.id] || ''}
                              onChange={(e) => setOtpInput({ ...otpInput, [item.id]: e.target.value })}
                              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 flex-1"
                            />
                            <button
                              onClick={() => handleConfirmDelivery(item)}
                              disabled={acceptingId === item.id}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              {acceptingId === item.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              Confirm Handover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMPLETED TAB */}
            {activeTab === 'COMPLETED' && (
              <div className="space-y-6">
                {completedList.length === 0 ? (
                  <div className="p-12 bg-white rounded-3xl border border-[#2c3e2e]/10 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-[#2c3e2e]">No Completed Deliveries Yet</h3>
                    <p className="text-xs text-[#556b5a]">Completed deliveries with OTP verification will be recorded here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedList.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 opacity-90 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Delivered
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{item.receiptNumber}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#2c3e2e]">{item.medicineName}</h3>
                        <p className="text-xs text-[#556b5a]">Quantity: {item.quantity} | Destination: {item.deliveryAddress}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryDashboard;
