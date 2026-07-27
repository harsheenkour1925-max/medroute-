
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLanguage } from '../LanguageContext.tsx';
import { backendService } from '../services/backendService.ts';
import { Shield, CheckCircle, Clock, Truck, FileText, UserCheck, AlertCircle, Upload, ArrowRight, X, Package } from 'lucide-react';
import { AuthContext } from '../App.tsx';
import { db, handleFirestoreError, OperationType, collection, query, where, onSnapshot, orderBy } from '../firebase.ts';

import { dijkstra, medRouteMap } from '../utils/dijkstra.ts';

const ReceiverDashboard: React.FC = () => {
  const { t } = useLanguage();
  const auth = useContext(AuthContext);
  const [step, setStep] = useState<'IDLE' | 'VALIDATE_AYUSHMAN' | 'UPLOAD_PRESCRIPTION' | 'VERIFYING_PRESCRIPTION' | 'PRESCRIPTION_VERIFIED' | 'SCHEDULE_DELIVERY' | 'SCHEDULING' | 'DELIVERY_SCHEDULED' | 'LIVE_TRACKING'>('IDLE');
  const [ayushmanId, setAyushmanId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prescription, setPrescription] = useState<File | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [optimizedPath, setOptimizedPath] = useState<string[]>([]); // Store node IDs
  const [trackingStatus, setTrackingStatus] = useState<string>('Order Placed');
  const [riderProgress, setRiderProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth?.user?.id) return;

    // Listen for requests
    const q = query(
      collection(db, 'requests'),
      where('receiverId', '==', auth.user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
      setRequests(docsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'requests');
    });
    
    // Calculate optimized path using Dijkstra's for simulation
    const result = dijkstra(medRouteMap.nodes, medRouteMap.edges, 'DONOR_LOC', 'RECEIVER_LOC');
    setOptimizedPath(result.path);

    return () => unsubscribe();
  }, [auth?.user?.id]);

  const startTrackingSimulation = () => {
    setStep('LIVE_TRACKING');
    const statuses = [
      { status: 'Order Placed', delay: 0 },
      { status: 'Order Accepted & Prepared', delay: 2000 },
      { status: 'Delivery Partner Assigned', delay: 4000 },
      { status: 'Pickup from Hub', delay: 6000 },
      { status: 'On the Way', delay: 8000 },
      { status: 'Arriving in 5 mins', delay: 12000 },
      { status: 'Delivered', delay: 16000 }
    ];

    statuses.forEach((s, i) => {
      setTimeout(() => {
        setTrackingStatus(s.status);
        if (s.status === 'On the Way') {
          // Animate rider progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += 1;
            setRiderProgress(progress);
            if (progress >= 100) clearInterval(interval);
          }, 80);
        }
      }, s.delay);
    });
  };

  const handleValidateAyushman = () => {
    if (ayushmanId === 'ABC') {
      setError(null);
      setStep('UPLOAD_PRESCRIPTION');
    } else {
      setError(t('receiver.invalidId'));
    }
  };

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescription(file);
      setStep('VERIFYING_PRESCRIPTION');
      
      // Simulate verification
      setTimeout(async () => {
        if (!auth?.user?.id) return;
        const newReq = await backendService.addRequest({
          ayushmanId,
          prescriptionName: file.name,
          status: 'Prescription Uploaded'
        }, auth.user.id);
        
        if (newReq) {
          setCurrentRequest(newReq);
          
          setTimeout(async () => {
            await backendService.updateRequestStatus(newReq.id, 'Verified Prescription');
            setStep('PRESCRIPTION_VERIFIED');
          }, 2000);
        }
      }, 1500);
    }
  };

  const handleScheduleDelivery = async () => {
    setStep('SCHEDULING');
    setTimeout(async () => {
      if (currentRequest) {
        await backendService.updateRequestStatus(currentRequest.id, 'Delivery Scheduled', {
          estimatedArrival: '12:45 PM',
          deliveryDate: 'Today'
        });
        // We don't need to manually update state here since onSnapshot will handle it
        setStep('DELIVERY_SCHEDULED');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-500 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h2 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter uppercase drop-shadow-sm">{t('receiver.title')}</h2>
            <p className="text-slate-500 text-lg font-medium">{t('receiver.subtitle')}</p>
          </div>
          {step === 'IDLE' && (
            <button 
              onClick={() => setStep('VALIDATE_AYUSHMAN')}
              className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center gap-4 group uppercase tracking-widest text-xs"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              {t('receiver.newRequest')}
            </button>
          )}
        </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{t('receiver.log')}</h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">{t('receiver.db.liveSync')}</span>
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-bounce">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {step === 'VALIDATE_AYUSHMAN' && (
                <div className="max-w-md mx-auto w-full animate-in zoom-in duration-300">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <UserCheck className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{t('receiver.ayushman')}</h4>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      value={ayushmanId}
                      onChange={(e) => setAyushmanId(e.target.value)}
                      placeholder={t('receiver.ayushmanPlaceholder')}
                      className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg outline-none focus:border-indigo-600 transition-all text-center text-slate-900"
                    />
                    <button 
                      onClick={handleValidateAyushman}
                      className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm"
                    >
                      {t('receiver.validate')}
                    </button>
                    <button 
                      onClick={() => setStep('IDLE')}
                      className="w-full py-4 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
                    >
                      {t('receiver.db.cancel')}
                    </button>
                  </div>
                </div>
              )}

              {step === 'UPLOAD_PRESCRIPTION' && (
                <div className="text-center animate-in fade-in duration-300 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{t('receiver.uploadPrescription')}</h4>
                  <p className="text-slate-500 font-medium text-xs mb-8">{t('receiver.prescriptionDesc')}</p>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePrescriptionUpload} 
                    className="hidden" 
                    accept="image/*,.pdf" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-bold shadow-2xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs flex items-center gap-3 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    {t('receiver.db.selectFile')}
                  </button>
                </div>
              )}

              {step === 'VERIFYING_PRESCRIPTION' && (
                <div className="text-center py-8 animate-in fade-in duration-300 max-w-lg mx-auto">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Reviewing Prescription</h4>
                  <p className="text-slate-500 font-medium text-xs mt-2">Connecting to medical team for verification...</p>
                </div>
              )}

              {step === 'PRESCRIPTION_VERIFIED' && (
                <div className="text-center py-6 animate-in zoom-in duration-500 max-w-xl mx-auto bg-slate-50/80 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  {/* Requested Calming Medical Tone Notice */}
                  <h4 className="text-2xl font-bold font-serif text-slate-900 mb-3 tracking-tight">
                    Prescription Received Successfully
                  </h4>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4 max-w-md mx-auto">
                    Our licensed medical verification team will carefully review your prescription and validate the request. You will receive a confirmation call within approximately one hour for final verification.
                  </p>
                  <p className="text-xs italic text-slate-500 mb-8 max-w-md mx-auto bg-white/80 p-3.5 rounded-xl border border-slate-100">
                    Please be patient with us while we ensure every medicine reaches the right patient safely.
                  </p>
                  
                  {/* Requested "Add Request" Button */}
                  <button 
                    onClick={async () => {
                      if (!auth?.user?.id) return;
                      // Generate request MR-20481
                      const reqId = 'MR-' + Math.floor(10000 + Math.random() * 90000);
                      const newReq = await backendService.addRequest({
                        requestId: reqId,
                        medicineName: 'Metformin 500mg',
                        quantity: '30 Tablets',
                        ayushmanId: ayushmanId || 'ABC-9021',
                        status: 'Pending Verification',
                        estimatedArrival: 'In 2-3 Days'
                      }, auth.user.id);
                      
                      setCurrentRequest(newReq);
                      setStep('IDLE');
                    }}
                    className="px-10 py-4.5 bg-[#2c3e2e] text-white rounded-full font-bold shadow-xl hover:bg-[#3a523d] transition-all uppercase tracking-widest text-xs flex items-center gap-2.5 mx-auto active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Add Request
                  </button>
                </div>
              )}

              {step === 'SCHEDULING' && (
                <div className="text-center py-10 animate-in fade-in duration-300">
                  <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <Truck className="w-16 h-16 text-indigo-600 animate-bounce" />
                    <div className="absolute inset-0 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t('receiver.scheduling')}</h4>
                </div>
              )}

              {step === 'DELIVERY_SCHEDULED' && currentRequest && (
                <div className="text-center py-10 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-3xl shadow-indigo-100">
                    <Truck className="w-12 h-12" />
                  </div>
                  <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">{t('receiver.scheduled')}</h4>
                  <p className="text-slate-500 font-bold text-sm mb-8">{t('receiver.arrival')}: <span className="text-indigo-600">{currentRequest.estimatedArrival}</span></p>
                  
                  <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 inline-block mb-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">{t('receiver.otp')}</p>
                    <div className="text-6xl font-black text-indigo-600 tracking-widest">{currentRequest.otp}</div>
                    <p className="text-[10px] font-bold text-indigo-500 mt-4 max-w-[200px] mx-auto leading-relaxed">{t('receiver.otpDesc')}</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={startTrackingSimulation}
                      className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl uppercase tracking-widest text-xs mx-auto flex items-center gap-3"
                    >
                      <Truck className="w-5 h-5" />
                      {t('receiver.db.trackLive')}
                    </button>
                    <button 
                      onClick={() => setStep('IDLE')}
                      className="px-10 py-3 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors mx-auto"
                    >
                      {t('receiver.db.backDashboard')}
                    </button>
                  </div>
                </div>
              )}

              {step === 'LIVE_TRACKING' && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{trackingStatus}</h4>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">
                        {trackingStatus === 'Delivered' ? t('receiver.db.enjoyHealth') : t('receiver.db.movingTowards')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('receiver.arrival')}</p>
                      <p className="text-xl font-black text-slate-900">
                        {trackingStatus === 'Delivered' ? '--' : '12:45 PM'}
                      </p>
                    </div>
                  </div>

                  {/* Map Visualization */}
                  <div className="relative w-full aspect-video bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 overflow-hidden mb-8 shadow-2xl">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                      {/* Draw Edges */}
                      {medRouteMap.edges.map((edge, i) => {
                        const from = medRouteMap.nodes.find(n => n.id === edge.from)!;
                        const to = medRouteMap.nodes.find(n => n.id === edge.to)!;
                        
                        // Check if this edge is part of the optimized path
                        let isOptimized = false;
                        for (let j = 0; j < optimizedPath.length - 1; j++) {
                          if ((optimizedPath[j] === edge.from && optimizedPath[j+1] === edge.to) ||
                              (optimizedPath[j] === edge.to && optimizedPath[j+1] === edge.from)) {
                            isOptimized = true;
                            break;
                          }
                        }

                        return (
                          <line 
                            key={i} 
                            x1={from.x} y1={from.y} 
                            x2={to.x} y2={to.y} 
                            stroke={isOptimized ? '#10B981' : '#475569'} 
                            strokeWidth={isOptimized ? 2 : 0.8}
                            strokeDasharray={isOptimized ? '0' : '2'}
                            opacity={isOptimized ? 1 : 0.4}
                          />
                        );
                      })}

                      {/* Draw Nodes */}
                      {medRouteMap.nodes.map((node, i) => (
                        <g key={i}>
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r="2.5" 
                            fill={optimizedPath.includes(node.id) ? '#10B981' : '#334155'} 
                            stroke="#1e293b"
                            strokeWidth="0.5"
                          />
                          <text 
                            x={node.x} 
                            y={node.y - 5} 
                            textAnchor="middle" 
                            fontSize="2.5" 
                            fontWeight="900" 
                            fill="white"
                            className="uppercase tracking-tighter"
                          >
                            {node.name}
                          </text>
                        </g>
                      ))}

                      {/* Rider Icon */}
                      {trackingStatus !== 'Delivered' && optimizedPath.length > 0 && (
                        <g transform={`translate(${
                          (() => {
                            const segmentCount = optimizedPath.length - 1;
                            const segmentIndex = Math.min(Math.floor((riderProgress / 100) * segmentCount), segmentCount - 1);
                            const segmentProgress = ((riderProgress / 100) * segmentCount) % 1;
                            
                            const fromNode = medRouteMap.nodes.find(n => n.id === optimizedPath[segmentIndex])!;
                            const toNode = medRouteMap.nodes.find(n => n.id === optimizedPath[segmentIndex + 1])!;
                            
                            return fromNode.x + (toNode.x - fromNode.x) * segmentProgress;
                          })()
                        }, ${
                          (() => {
                            const segmentCount = optimizedPath.length - 1;
                            const segmentIndex = Math.min(Math.floor((riderProgress / 100) * segmentCount), segmentCount - 1);
                            const segmentProgress = ((riderProgress / 100) * segmentCount) % 1;
                            
                            const fromNode = medRouteMap.nodes.find(n => n.id === optimizedPath[segmentIndex])!;
                            const toNode = medRouteMap.nodes.find(n => n.id === optimizedPath[segmentIndex + 1])!;
                            
                            return fromNode.y + (toNode.y - fromNode.y) * segmentProgress;
                          })()
                        })`}>
                          <circle r="3.5" fill="#10B981" className="animate-pulse" />
                          <circle r="6" fill="#10B981" opacity="0.3" className="animate-ping" />
                          <path d="M-1 -1 L1 1 M-1 1 L1 -1" stroke="white" strokeWidth="0.5" />
                        </g>
                      )}
                    </svg>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{t('receiver.db.rider')}: Sameer Ahmed</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('receiver.db.verifiedPartner')} • 4.9 ★</p>
                      </div>
                      <button className="ml-auto px-4 py-2 bg-white text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-50 transition">{t('receiver.db.call')}</button>
                    </div>

                    {trackingStatus === 'Delivered' && (
                      <button 
                        onClick={() => setStep('IDLE')}
                        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition uppercase tracking-widest text-xs"
                      >
                        {t('receiver.db.orderReceived')}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 'IDLE' && (
                <div className="space-y-6">
                  {requests.length > 0 ? (
                    requests.map((req, i) => (
                      <div key={i} className="p-7 bg-slate-50/90 rounded-[2rem] border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:bg-white hover:shadow-xl duration-300">
                        <div className="flex gap-5 items-start">
                          <div className="w-14 h-14 bg-amber-500/10 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200/50 mt-1">
                            <Clock className="w-7 h-7" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 font-serif">Pending Verification</span>
                              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                {req.status || 'Pending Verification'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                              <span>🕒 Prescription under medical review</span>
                            </p>
                            
                            <div className="pt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-semibold text-slate-700">
                              <div><span className="text-slate-400 font-normal">Request ID:</span> {req.requestId || req.id || 'MR-20481'}</div>
                              <div><span className="text-slate-400 font-normal">Medicine:</span> {req.medicineName || req.prescriptionName || 'Metformin 500mg'}</div>
                              <div><span className="text-slate-400 font-normal">Quantity:</span> {req.quantity || '30 Tablets'}</div>
                              <div><span className="text-slate-400 font-normal">Status:</span> <span className="text-amber-700 font-bold">{req.status || 'Pending Verification'}</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                          <button
                            onClick={() => {
                              setCurrentRequest(req);
                              startTrackingSimulation();
                            }}
                            className="px-5 py-2.5 bg-[#2c3e2e] text-white hover:bg-[#3a523d] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                          >
                            <Truck className="w-3.5 h-3.5 text-emerald-400" />
                            Track Allocation
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-16 text-center bg-indigo-50/30 border-3 border-dashed border-indigo-100 rounded-[3rem]">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-xl">
                        <FileText className="w-10 h-10" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">{t('receiver.db.noRequests')}</h4>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium leading-relaxed">{t('receiver.db.historyDesc')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-black mb-6 tracking-tight uppercase">{t('receiver.db.networkLogistics')}</h3>
            <p className="text-indigo-100 font-medium mb-10 leading-relaxed">{t('receiver.db.verificationNotice')}</p>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <div className="text-[10px] uppercase font-black tracking-widest text-indigo-200 mb-2">{t('receiver.db.systemStatus')}</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="font-bold text-xs">{t('receiver.db.operational')}</span>
                </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500" />
              {t('receiver.db.optimization')}
            </h4>
            <div className="space-y-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                {t('receiver.db.dijkstraDesc')}
              </p>
              <div className="space-y-2">
                {optimizedPath.map((nodeId, i) => {
                  const node = medRouteMap.nodes.find(n => n.id === nodeId);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{node?.name || nodeId}</span>
                      {i < optimizedPath.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              {t('receiver.db.safetyAssurance')}
            </h4>
            <div className="space-y-6">
                {[
                  { title: t('receiver.db.aiVerification'), desc: t('receiver.db.aiVerificationDesc') },
                  { title: t('receiver.db.physicalCheck'), desc: t('receiver.db.physicalCheckDesc') },
                  { title: t('receiver.db.secureLogistics'), desc: t('receiver.db.secureLogisticsDesc') }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ReceiverDashboard;
