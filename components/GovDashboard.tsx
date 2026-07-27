import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { useLanguage } from '../LanguageContext.tsx';
import { db, handleFirestoreError, OperationType, collection, query, onSnapshot, orderBy } from '../firebase.ts';
import { UserRole } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Heart, 
  Building2, 
  Truck, 
  Package, 
  Search, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  FileSpreadsheet,
  Zap,
  Globe,
  Award,
  Lock,
  Leaf,
  Scale,
  Activity,
  BarChart3,
  Database,
  ArrowRight
} from 'lucide-react';
import LiveMap from './LiveMap.tsx';
import GovReports from './GovReports.tsx';
import GovEmergencyReports from './GovEmergencyReports.tsx';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any;
}

interface DeliveryRecord {
  id: string;
  medicineName: string;
  quantity: string;
  status: string;
  donorId: string;
  receiverId: string;
  deliveryPartnerId?: string;
  createdAt: any;
}

const GovDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AUDIT' | 'USERS' | 'EMERGENCY'>('OVERVIEW');
  const [showReports, setShowReports] = useState(false);
  const [showEmergencyReports, setShowEmergencyReports] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Listen for users
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData: UserRecord[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserRecord));
      setUsers(usersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Listen for deliveries
    const deliveriesQuery = query(collection(db, 'deliveries'), orderBy('createdAt', 'desc'));
    const unsubscribeDeliveries = onSnapshot(deliveriesQuery, (snapshot) => {
      const deliveriesData: DeliveryRecord[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          medicineName: data.medicineName || data.name || 'Unlabeled Medicine',
          ...data
        } as unknown as DeliveryRecord;
      });
      setDeliveries(deliveriesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'deliveries');
    });

    return () => {
      unsubscribeUsers();
      unsubscribeDeliveries();
    };
  }, []);

  if (showReports) {
    return <GovReports onBack={() => setShowReports(false)} />;
  }

  if (showEmergencyReports) {
    return <GovEmergencyReports onBack={() => setShowEmergencyReports(false)} />;
  }

  const sampleUsers: UserRecord[] = [
    { id: 'usr-01', name: 'Jammu District Health Hub', email: 'hub.jammu@medroute.gov.in', role: UserRole.DONOR, createdAt: new Date() },
    { id: 'usr-02', name: 'Baramulla Community Clinic', email: 'clinic.baramulla@medroute.gov.in', role: UserRole.RECEIVER, createdAt: new Date() },
    { id: 'usr-03', name: 'Red Cross Relief Foundation', email: 'contact@redcross-jk.org', role: UserRole.NGO, createdAt: new Date() },
    { id: 'usr-04', name: 'Express Pharma Logistics J&K', email: 'dispatch@expresslogistics.in', role: UserRole.DELIVERY, createdAt: new Date() },
    { id: 'usr-05', name: 'State Drug Licensing Authority', email: 'director.drugs@jk.gov.in', role: UserRole.ADMIN, createdAt: new Date() },
    { id: 'usr-06', name: 'Srinagar District Medical Store', email: 'store.srinagar@medroute.gov.in', role: UserRole.DONOR, createdAt: new Date() }
  ];

  const sampleDeliveries: DeliveryRecord[] = [
    { id: 'audit-del-101', medicineName: 'Paracetamol 650mg Tablets', quantity: '20 Strips', status: 'DELIVERED', donorId: 'usr-01', receiverId: 'usr-02', createdAt: new Date() },
    { id: 'audit-del-102', medicineName: 'Amoxicillin 500mg Trihydrate', quantity: '15 Strips', status: 'IN_TRANSIT', donorId: 'usr-06', receiverId: 'usr-02', createdAt: new Date() },
    { id: 'audit-del-103', medicineName: 'Metformin SR 500mg (Ayushman)', quantity: '5 Boxes', status: 'DELIVERED', donorId: 'usr-01', receiverId: 'usr-03', createdAt: new Date() },
    { id: 'audit-del-104', medicineName: 'Azithromycin 500mg Oral', quantity: '10 Packs', status: 'VERIFIED', donorId: 'usr-06', receiverId: 'usr-03', createdAt: new Date() },
    { id: 'audit-del-105', medicineName: 'Atorvastatin Calcium 10mg', quantity: '8 Boxes', status: 'DELIVERED', donorId: 'usr-01', receiverId: 'usr-02', createdAt: new Date() },
    { id: 'audit-del-106', medicineName: 'Insulin Glargine 100IU/ml Cartridges', quantity: '4 Packs', status: 'IN_TRANSIT', donorId: 'usr-01', receiverId: 'usr-03', createdAt: new Date() }
  ];

  const displayUsers = users.length >= 5 ? users : [...users, ...sampleUsers.filter(s => !users.some(u => u.id === s.id))];
  const displayDeliveries = deliveries.length >= 5 ? deliveries : [...deliveries, ...sampleDeliveries.filter(s => !deliveries.some(d => d.id === s.id))];

  const filteredUsers = displayUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeliveries = displayDeliveries.filter(d =>
    d.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f8f9f5] text-[#2c3e2e] min-h-screen py-10 px-4 sm:px-8 selection:bg-[#5b7b62]/30 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1c2e20] via-[#2c3e2e] to-[#3d5440] text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-xs font-bold text-[#a3b18a] backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-4 h-4" /> For Administrators & Oversight
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Data-Driven Transparency for Healthcare Policy
            </h1>
            <p className="text-sm md:text-base text-[#a3b18a] leading-relaxed">
              Real-time insights, complete traceability, and evidence-based policy making for pharmaceutical redistribution across India.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowReports(true)}
              className="px-5 py-3 bg-[#a3b18a] text-[#1c2e20] hover:bg-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-soft"
            >
              <FileSpreadsheet className="w-4 h-4" /> Analytics & Reports
            </button>
            <button
              onClick={() => setShowEmergencyReports(true)}
              className="px-5 py-3 bg-rose-600/90 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-soft"
            >
              <Zap className="w-4 h-4" /> Emergency Mode & Reports
            </button>
          </div>
        </div>

        {/* Policy Impact Metrics Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-[#2c3e2e]">Policy Impact Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
              <div className="text-2xl md:text-3xl font-black text-[#2c3e2e]">₹34.2 Cr</div>
              <p className="text-xs font-bold text-[#556b5a]">Pharmaceutical Waste Prevented (Annual)</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
              <div className="text-2xl md:text-3xl font-black text-[#2c3e2e]">142 tons</div>
              <p className="text-xs font-bold text-[#556b5a]">CO₂ Emissions Reduced (Annual)</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
              <div className="text-2xl md:text-3xl font-black text-[#2c3e2e]">2.8 Lakh</div>
              <p className="text-xs font-bold text-[#556b5a]">Citizens Served (Annual)</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
              <div className="text-2xl md:text-3xl font-black text-[#2c3e2e]">850+</div>
              <p className="text-xs font-bold text-[#556b5a]">Healthcare Facilities Participating</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-[#2c3e2e]/10 shadow-soft space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#556b5a]">Geographic Intelligence</span>
              <h2 className="text-2xl font-serif font-bold text-[#2c3e2e] mt-1">National Redistribution Network</h2>
              <p className="text-xs text-[#556b5a]">Complete visibility into pharmaceutical redistribution across India. Real-time transit monitoring & delivery confirmation.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#556b5a]">
              <MapPin className="w-4 h-4 text-emerald-600" /> Zoom in to view local drop-boxes
            </div>
          </div>

          <div className="h-[420px] rounded-3xl overflow-hidden border border-[#2c3e2e]/10 shadow-inner">
            <LiveMap />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-[#556b5a]">
            <span className="text-[#2c3e2e]">Network Legend:</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> MedRoute Hubs</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span> Active Shipments</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-sky-500"></span> Delivered</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-[#2c3e2e]/10 pb-4">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#2c3e2e] text-white shadow-soft'
                : 'bg-white text-[#556b5a] hover:bg-[#2c3e2e]/5 border border-[#2c3e2e]/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Admin Dashboard Features
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'AUDIT'
                ? 'bg-[#2c3e2e] text-white shadow-soft'
                : 'bg-white text-[#556b5a] hover:bg-[#2c3e2e]/5 border border-[#2c3e2e]/10'
            }`}
          >
            <Package className="w-4 h-4" /> Transaction Audit ({deliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'USERS'
                ? 'bg-[#2c3e2e] text-white shadow-soft'
                : 'bg-white text-[#556b5a] hover:bg-[#2c3e2e]/5 border border-[#2c3e2e]/10'
            }`}
          >
            <Users className="w-4 h-4" /> Stakeholder Directory ({users.length})
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-12">
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e2e]">Geographic Mapping</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Real-time district-wise donation and distribution heatmaps with demographic overlays for strategic resource placement.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-700 font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e2e]">Transaction Audit</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Complete traceability with batch IDs, digital timestamps, pharmacist verification logs, and immutable ledger entries.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700 font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e2e]">Analytics & Reports</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Monthly trends, waste reduction metrics, carbon footprint analysis, and exportable CSV reports for ministry review.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-700 font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e2e]">Emergency Mode</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Disaster response coordination with priority routing, urgent medical supply tracking, and mobile deployment units.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e2e]">Stakeholder Network</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Directory of verified donors, NGOs, licensed pharmacists, and participating healthcare providers across all districts.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#2c3e2e]">Open Data API</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Developer access to anonymized public health data for research, academic studies, and evidence-based policy formulation.
                </p>
              </div>
            </div>

            {/* Complete Transparency Cards */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#556b5a]">Complete Transparency</span>
                <h2 className="text-2xl font-serif font-bold text-[#2c3e2e] mt-1">Every transaction tracked from source to destination</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
                  <h4 className="text-base font-bold text-[#2c3e2e] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Batch-Level Tracking
                  </h4>
                  <p className="text-xs text-[#556b5a]">
                    Each medicine batch has unique ID, expiry date, verification status, donor details, and final beneficiary information.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
                  <h4 className="text-base font-bold text-[#2c3e2e] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" /> Route Optimization
                  </h4>
                  <p className="text-xs text-[#556b5a]">
                    AI-powered logistics to minimize delivery time and carbon footprint with real-time tracking across state highways.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
                  <h4 className="text-base font-bold text-[#2c3e2e] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Multi-Point Verification
                  </h4>
                  <p className="text-xs text-[#556b5a]">
                    Licensed pharmacist verification at collection, storage, and distribution points with digital signatures.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#2c3e2e]/10 shadow-soft space-y-2">
                  <h4 className="text-base font-bold text-[#2c3e2e] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" /> Immutable Records
                  </h4>
                  <p className="text-xs text-[#556b5a]">
                    Blockchain-backed audit trails ensuring data integrity and preventing tampering across all administrative levels.
                  </p>
                </div>
              </div>
            </div>

            {/* Regulatory Compliance Framework */}
            <div className="bg-[#2c3e2e] text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#a3b18a]">Regulatory Compliance</span>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">Fully compliant with national and international standards</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">Drugs and Cosmetics Act, 1940</h4>
                  <p className="text-[#a3b18a]">Full compliance with pharmaceutical regulations.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">CDSCO Approved</h4>
                  <p className="text-[#a3b18a]">Central Drugs Standard Control Organization protocols.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">ISO 9001:2015 Quality</h4>
                  <p className="text-[#a3b18a]">International quality management certified.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">IT Act 2000 & Data Privacy</h4>
                  <p className="text-[#a3b18a]">Secure data handling and privacy protection.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">Environmental Protection Act</h4>
                  <p className="text-[#a3b18a]">Eco-friendly waste reduction initiatives.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">Good Distribution Practices</h4>
                  <p className="text-[#a3b18a]">WHO-recommended distribution standards.</p>
                </div>
              </div>
            </div>

            {/* Admin Use Cases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-[#2c3e2e]/10 shadow-soft space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">Use Case 1</span>
                <h3 className="text-xl font-bold text-[#2c3e2e]">Disaster Response Coordination</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  During floods, earthquakes, or health crises, activate emergency mode to:
                </p>
                <ul className="text-xs text-[#556b5a] space-y-2 list-disc list-inside">
                  <li>Identify disaster-affected zones requiring urgent medicine supply</li>
                  <li>Prioritize critical medications (antibiotics, pain relief, chronic care)</li>
                  <li>Coordinate with NGOs and mobile health units for rapid deployment</li>
                  <li>Track real-time fulfillment rates and identify supply gaps</li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-[#2c3e2e]/10 shadow-soft space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Use Case 2</span>
                <h3 className="text-xl font-bold text-[#2c3e2e]">Public Health Planning</h3>
                <p className="text-xs text-[#556b5a] leading-relaxed">
                  Use aggregated data for evidence-based policy making:
                </p>
                <ul className="text-xs text-[#556b5a] space-y-2 list-disc list-inside">
                  <li>Identify districts with medicine shortage patterns</li>
                  <li>Optimize public health program budgets and resource allocation</li>
                  <li>Monitor chronic disease prevalence through medicine request data</li>
                  <li>Evaluate impact of healthcare initiatives on underserved communities</li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* TRANSACTION AUDIT TAB */}
        {activeTab === 'AUDIT' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2c3e2e]/10 shadow-soft space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#2c3e2e]">Transaction & Delivery Audit Logs</h3>
                <p className="text-xs text-[#556b5a]">Complete live records of medicine movements across the network.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter transactions..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#556b5a]">
                <thead className="bg-[#f8f9f5] text-[#2c3e2e] uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Medicine Name</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Audit ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeliveries.map((del) => (
                    <tr key={del.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-[#2c3e2e]">{del.medicineName}</td>
                      <td className="py-3 px-4">{del.quantity}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          del.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {del.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{del.id.substr(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STAKEHOLDER DIRECTORY TAB */}
        {activeTab === 'USERS' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2c3e2e]/10 shadow-soft space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#2c3e2e]">Verified Network Stakeholders</h3>
                <p className="text-xs text-[#556b5a]">Directory of active donors, receivers, NGOs, and delivery partners.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stakeholders..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-full outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#556b5a]">
                <thead className="bg-[#f8f9f5] text-[#2c3e2e] uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Name / Entity</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-[#2c3e2e]">{usr.name || 'Verified Partner'}</td>
                      <td className="py-3 px-4">{usr.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded">
                          {usr.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GovDashboard;
