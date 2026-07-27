import React, { useState } from 'react';
import { Database, Copy, Check, X, Server, Layers, ShieldCheck, Cpu } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- ====================================================================
-- MEDROUTE FULL SUPABASE DATABASE DDL & DIJKSTRA ROUTING SETUP
-- Copy & Paste directly into Supabase SQL Editor (https://supabase.com/dashboard)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Custom Enums
CREATE TYPE user_role AS ENUM ('DONOR', 'RECEIVER', 'NGO', 'ADMIN', 'DELIVERY');
CREATE TYPE medicine_status AS ENUM ('PENDING_COLLECTION', 'VERIFIED', 'IN_TRANSIT', 'DELIVERED', 'SEARCHING', 'ALLOCATED');
CREATE TYPE request_status AS ENUM ('PENDING_VERIFICATION', 'SEARCHING', 'ALLOCATED', 'DELIVERY_SCHEDULED', 'DELIVERED');

-- 3. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'DONOR',
    phone TEXT,
    location_name TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    ayushman_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Hubs Table (Warehouse & Distribution Nodes)
CREATE TABLE IF NOT EXISTS public.hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    capacity_units INT DEFAULT 10000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Donations & Medicines Table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    medicine_name TEXT NOT NULL,
    brand TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    expiry_date DATE NOT NULL,
    status medicine_status DEFAULT 'VERIFIED',
    otp VARCHAR(10),
    receipt_number VARCHAR(50) UNIQUE,
    impact_message TEXT,
    thank_you_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Medicine Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(50) UNIQUE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    ayushman_id TEXT,
    medicine_name TEXT NOT NULL,
    quantity TEXT DEFAULT '30 Tablets',
    prescription_url TEXT,
    status request_status DEFAULT 'PENDING_VERIFICATION',
    assigned_hub_id UUID REFERENCES public.hubs(id),
    allocated_donation_id UUID REFERENCES public.donations(id),
    estimated_arrival VARCHAR(50),
    delivery_otp VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Graph Edges Table for Dijkstra Route Distance Network
CREATE TABLE IF NOT EXISTS public.route_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_node_code VARCHAR(50) NOT NULL,
    to_node_code VARCHAR(50) NOT NULL,
    weight_km DOUBLE PRECISION NOT NULL,
    travel_time_mins INT NOT NULL
);

-- 8. Allocations Audit Log Table
CREATE TABLE IF NOT EXISTS public.allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
    donation_id UUID REFERENCES public.donations(id),
    path_nodes TEXT[] NOT NULL,
    total_distance_km DOUBLE PRECISION NOT NULL,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Row Level Security Policies (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hubs" ON public.hubs FOR SELECT USING (true);
CREATE POLICY "Allow users to read own profile" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow read requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Allow read donations" ON public.donations FOR SELECT USING (true);

-- 10. PL/pgSQL Function: Dijkstra Shortest Path Search
CREATE OR REPLACE FUNCTION public.get_shortest_delivery_route(start_code TEXT, end_code TEXT)
RETURNS TABLE(path TEXT[], total_distance DOUBLE PRECISION) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE graph_paths(path, last_node, total_dist) AS (
        SELECT ARRAY[from_node_code, to_node_code], to_node_code, weight_km
        FROM public.route_edges WHERE from_node_code = start_code
        UNION ALL
        SELECT gp.path || re.to_node_code, re.to_node_code, gp.total_dist + re.weight_km
        FROM graph_paths gp
        JOIN public.route_edges re ON gp.last_node = re.from_node_code
        WHERE NOT (re.to_node_code = ANY(gp.path))
    )
    SELECT path, total_dist FROM graph_paths
    WHERE last_node = end_code
    ORDER BY total_dist ASC LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 11. Initial Seed Data
INSERT INTO public.hubs (code, name, district, latitude, longitude) VALUES
('HUB_SRINAGAR', 'Srinagar Central Hub', 'Srinagar', 34.0837, 74.7973),
('HUB_BUDGAM', 'Budgam District Hub', 'Budgam', 34.0150, 74.7170),
('HUB_ANANTNAG', 'Anantnag South Hub', 'Anantnag', 33.7311, 75.1492),
('HUB_BARAMULLA', 'Baramulla North Hub', 'Baramulla', 34.2018, 74.3436)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.route_edges (from_node_code, to_node_code, weight_km, travel_time_mins) VALUES
('DONOR_LOC', 'HUB_SRINAGAR', 12.5, 25),
('DONOR_LOC', 'HUB_BUDGAM', 18.2, 35),
('HUB_SRINAGAR', 'HUB_BUDGAM', 15.0, 30),
('HUB_SRINAGAR', 'HUB_ANANTNAG', 55.0, 90),
('HUB_BUDGAM', 'RECEIVER_LOC', 22.0, 40),
('HUB_ANANTNAG', 'RECEIVER_LOC', 35.0, 60);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-[#2c3e2e] text-white p-6 md:p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
              <Database className="w-6 h-6 text-[#a3b18a]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif tracking-tight">Supabase Project Configured</h3>
              <p className="text-xs text-white/70">Project Ref: <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-emerald-300 font-bold">efxjxwvfhotdgqaefksa</span> • https://efxjxwvfhotdgqaefksa.supabase.co</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-[#f4f6ef] p-4 px-8 border-b border-[#2c3e2e]/10 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs text-[#2c3e2e] font-semibold">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#5b7b62]" />
            <span>Target: <code className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono">efxjxwvfhotdgqaefksa.supabase.co</code></span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5b7b62]" />
            <span>6 Tables + RLS Policies + Dijkstra Shortest Path Function</span>
          </div>
          <button
            onClick={handleCopy}
            className="ml-auto px-5 py-2.5 bg-[#2c3e2e] text-white hover:bg-[#3a523d] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied SQL!' : 'Copy All SQL Queries'}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed flex-grow">
          <pre className="whitespace-pre-wrap select-all">{sqlSchema}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 px-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs font-medium text-slate-500">
          <span>Copy and run in your Supabase project SQL Editor</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full font-bold uppercase tracking-wider transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
