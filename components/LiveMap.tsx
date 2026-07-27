import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDisasterZoneFacilities } from '../aiService.ts';
import { AlertCircle } from 'lucide-react';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to fix map sizing issues
const MapResizer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Component to handle zoom events
const ZoomHandler: React.FC<{ onZoomChange: (zoom: number) => void }> = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
};

// Component to handle map bounds
const BoundsHandler: React.FC<{ truckPos?: any; userPos?: any; routePath?: any[] }> = ({ truckPos, userPos, routePath }) => {
  const map = useMap();
  
  useEffect(() => {
    const points: [number, number][] = [];
    if (userPos) points.push([userPos.lat, userPos.lng]);
    if (truckPos) points.push([truckPos.lat, truckPos.lng]);
    if (routePath && routePath.length > 0) {
      routePath.forEach(p => points.push([p.lat, p.lng]));
    }
    
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        // Single point or identical points
        map.setView(bounds.getCenter(), 14);
      } else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [truckPos, userPos, routePath, map]);
  
  return null;
};

interface LiveMapProps {
  truckPos?: { lat: number; lng: number };
  userPos?: { lat: number; lng: number };
  routePath?: { lat: number; lng: number }[];
  activeHub?: { lat: number; lng: number; name: string; id: string };
  onlyDropboxes?: boolean;
  showOnlyTracking?: boolean;
  height?: string;
  mapType?: 'default' | 'emergency' | 'gov' | 'gov-emergency';
  isLandingPage?: boolean;
}

const LiveMap: React.FC<LiveMapProps> = ({ 
  truckPos, 
  userPos, 
  routePath, 
  activeHub,
  onlyDropboxes, 
  showOnlyTracking,
  height = "h-[600px]", 
  mapType = 'default',
  isLandingPage = false
}) => {
  const center: [number, number] = userPos ? [userPos.lat, userPos.lng] : [20.5937, 78.9629];
  const [groundedFacilities, setGroundedFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(userPos ? 12 : 5);
  
  const warehouseIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const hubPinIcon = L.divIcon({
    html: `<div class="flex items-center justify-center">
             <div class="w-3 h-3 bg-[#5b7b62] rounded-full border-2 border-white shadow-[0_0_15px_rgba(91,123,98,0.4)] relative">
               <div class="absolute inset-0 bg-[#5b7b62] rounded-full animate-ping opacity-25"></div>
             </div>
           </div>`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  const dropboxCircleIcon = L.divIcon({
    html: `<div class="w-1.5 h-1.5 bg-[#436d4d] rounded-full border border-white/50"></div>`,
    className: '',
    iconSize: [6, 6],
    iconAnchor: [3, 3]
  });

  const truckIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const dropboxIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const alertIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', // Warning icon
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const disasterZones = [
    { id: 1, pos: [9.2648, 76.7870] as [number, number], name: "Kerala Flood Zone", color: "#ef4444", priority: "Critical" },
    { id: 2, pos: [23.2420, 69.6669] as [number, number], name: "Gujarat Earthquake Zone", color: "#f59e0b", priority: "High Priority" },
    { id: 3, pos: [19.8135, 85.8312] as [number, number], name: "Odisha Cyclone Zone", color: "#ef4444", priority: "Critical" }
  ];

  // Dense network of dropboxes across India
  const staticDropboxes = [
    // Delhi
    { name: "MedRoute Drop-box: Connaught Place", lat: 28.6328, lng: 77.2197, type: 'dropbox' },
    { name: "MedRoute Drop-box: Chandni Chowk", lat: 28.6506, lng: 77.2303, type: 'dropbox' },
    { name: "MedRoute Drop-box: Karol Bagh", lat: 28.6448, lng: 77.1888, type: 'dropbox' },
    { name: "MedRoute Drop-box: Saket", lat: 28.5244, lng: 77.2100, type: 'dropbox' },
    { name: "MedRoute Drop-box: Dwarka", lat: 28.5823, lng: 77.0500, type: 'dropbox' },
    { name: "MedRoute Drop-box: Rohini", lat: 28.7041, lng: 77.1025, type: 'dropbox' },
    { name: "MedRoute Drop-box: Hauz Khas", lat: 28.5494, lng: 77.2001, type: 'dropbox' },
    { name: "MedRoute Drop-box: Lajpat Nagar", lat: 28.5677, lng: 77.2433, type: 'dropbox' },
    // Mumbai
    { name: "MedRoute Drop-box: Bandra", lat: 19.0596, lng: 72.8295, type: 'dropbox' },
    { name: "MedRoute Drop-box: Andheri", lat: 19.1136, lng: 72.8697, type: 'dropbox' },
    { name: "MedRoute Drop-box: Colaba", lat: 18.9067, lng: 72.8147, type: 'dropbox' },
    { name: "MedRoute Drop-box: Borivali", lat: 19.2307, lng: 72.8567, type: 'dropbox' },
    { name: "MedRoute Drop-box: Powai", lat: 19.1176, lng: 72.9060, type: 'dropbox' },
    { name: "MedRoute Drop-box: Dadar", lat: 19.0178, lng: 72.8478, type: 'dropbox' },
    { name: "MedRoute Drop-box: Juhu", lat: 19.1075, lng: 72.8263, type: 'dropbox' },
    // Bangalore
    { name: "MedRoute Drop-box: Indiranagar", lat: 12.9784, lng: 77.6408, type: 'dropbox' },
    { name: "MedRoute Drop-box: Koramangala", lat: 12.9352, lng: 77.6245, type: 'dropbox' },
    { name: "MedRoute Drop-box: Whitefield", lat: 12.9698, lng: 77.7500, type: 'dropbox' },
    { name: "MedRoute Drop-box: Jayanagar", lat: 12.9250, lng: 77.5938, type: 'dropbox' },
    { name: "MedRoute Drop-box: Hebbal", lat: 13.0354, lng: 77.5988, type: 'dropbox' },
    { name: "MedRoute Drop-box: Electronic City", lat: 12.8452, lng: 77.6632, type: 'dropbox' },
    { name: "MedRoute Drop-box: Malleshwaram", lat: 12.9917, lng: 77.5712, type: 'dropbox' },
    // Chennai
    { name: "MedRoute Drop-box: Adyar", lat: 13.0033, lng: 80.2550, type: 'dropbox' },
    { name: "MedRoute Drop-box: T. Nagar", lat: 13.0418, lng: 80.2341, type: 'dropbox' },
    { name: "MedRoute Drop-box: Anna Nagar", lat: 13.0850, lng: 80.2101, type: 'dropbox' },
    { name: "MedRoute Drop-box: Velachery", lat: 12.9792, lng: 80.2184, type: 'dropbox' },
    { name: "MedRoute Drop-box: Mylapore", lat: 13.0333, lng: 80.2667, type: 'dropbox' },
    // Kolkata
    { name: "MedRoute Drop-box: Salt Lake", lat: 22.5868, lng: 88.4171, type: 'dropbox' },
    { name: "MedRoute Drop-box: Park Street", lat: 22.5529, lng: 88.3534, type: 'dropbox' },
    { name: "MedRoute Drop-box: Gariahat", lat: 22.5194, lng: 88.3653, type: 'dropbox' },
    { name: "MedRoute Drop-box: New Town", lat: 22.5867, lng: 88.4754, type: 'dropbox' },
    { name: "MedRoute Drop-box: Howrah", lat: 22.5851, lng: 88.3191, type: 'dropbox' },
    // Hyderabad
    { name: "MedRoute Drop-box: Gachibowli", lat: 17.4401, lng: 78.3489, type: 'dropbox' },
    { name: "MedRoute Drop-box: Jubilee Hills", lat: 17.4299, lng: 78.4077, type: 'dropbox' },
    { name: "MedRoute Drop-box: Banjara Hills", lat: 17.4156, lng: 78.4347, type: 'dropbox' },
    { name: "MedRoute Drop-box: Secunderabad", lat: 17.4399, lng: 78.4983, type: 'dropbox' },
    { name: "MedRoute Drop-box: Kukatpally", lat: 17.4875, lng: 78.3953, type: 'dropbox' },
    // Ahmedabad
    { name: "MedRoute Drop-box: Satellite", lat: 23.0300, lng: 72.5176, type: 'dropbox' },
    { name: "MedRoute Drop-box: Vastrapur", lat: 23.0350, lng: 72.5293, type: 'dropbox' },
    { name: "MedRoute Drop-box: Navrangpura", lat: 23.0373, lng: 72.5613, type: 'dropbox' },
    { name: "MedRoute Drop-box: Maninagar", lat: 22.9968, lng: 72.6019, type: 'dropbox' },
    // Pune
    { name: "MedRoute Drop-box: Kothrud", lat: 18.5074, lng: 73.8077, type: 'dropbox' },
    { name: "MedRoute Drop-box: Hinjewadi", lat: 18.5913, lng: 73.7389, type: 'dropbox' },
    { name: "MedRoute Drop-box: Viman Nagar", lat: 18.5679, lng: 73.9143, type: 'dropbox' },
    { name: "MedRoute Drop-box: Baner", lat: 18.5597, lng: 73.7799, type: 'dropbox' },
    // Jaipur
    { name: "MedRoute Drop-box: Malviya Nagar", lat: 26.8549, lng: 75.8243, type: 'dropbox' },
    { name: "MedRoute Drop-box: Vaishali Nagar", lat: 26.9075, lng: 75.7396, type: 'dropbox' },
    { name: "MedRoute Drop-box: Mansarovar", lat: 26.8531, lng: 75.7600, type: 'dropbox' },
    // Lucknow
    { name: "MedRoute Drop-box: Gomti Nagar", lat: 26.8467, lng: 80.9462, type: 'dropbox' },
    { name: "MedRoute Drop-box: Hazratganj", lat: 26.8467, lng: 80.9462, type: 'dropbox' },
    { name: "MedRoute Drop-box: Aliganj", lat: 26.8920, lng: 80.9360, type: 'dropbox' },
  ];

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        // Fetch near user if available, else fallback to disaster zone
        const query = userPos ? "Delhi Medicine Drop-box" : "Kerala Pathanamthitta Hospital";
        const facilities = await getDisasterZoneFacilities(query);
        
        setGroundedFacilities(
          [...facilities, ...staticDropboxes].filter(f => !onlyDropboxes || f.type === 'dropbox')
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [userPos]);

  const routes = [
    { 
      id: 1, 
      path: [[12.9716, 77.5946], [9.2648, 76.7870]] as [number, number][], 
      color: "#38bdf8", 
      label: "Bangalore to Kerala",
      source: "Central Supply Hub (ID: BNG-04)",
      dest: "Emergency Relief Center (ID: KRL-12)",
      cargo: "Antibiotics & IV Fluids",
      status: "In Transit"
    },
    { 
      id: 2, 
      path: [[23.0225, 72.5714], [23.2420, 69.6669]] as [number, number][], 
      color: "#fbbf24", 
      label: "Ahmedabad to Bhuj",
      source: "Regional Depot (ID: AMD-09)",
      dest: "Community Clinic (ID: BHJ-02)",
      cargo: "First Aid & Pain Relief",
      status: "Dispatched"
    },
    {
      id: 3,
      path: [[19.0760, 72.8777], [28.6139, 77.2090]] as [number, number][],
      color: "#10b981",
      label: "Mumbai to Delhi",
      source: "Western Logistics Hub (ID: MUM-01)",
      dest: "Northern Distribution Center (ID: DEL-05)",
      cargo: "Critical Care Medicines",
      status: "In Transit"
    },
    {
      id: 4,
      path: [[22.5726, 88.3639], [28.6139, 77.2090]] as [number, number][],
      color: "#6366f1",
      label: "Kolkata to Delhi",
      source: "Eastern Hub (ID: KOL-03)",
      dest: "Northern Distribution Center (ID: DEL-05)",
      cargo: "Vaccines",
      status: "Scheduled"
    },
    {
      id: 5,
      path: [[13.0827, 80.2707], [17.3850, 78.4867]] as [number, number][],
      color: "#ec4899",
      label: "Chennai to Hyderabad",
      source: "Southern Hub (ID: CHN-02)",
      dest: "Deccan Depot (ID: HYD-07)",
      cargo: "Insulin Batches",
      status: "In Transit"
    },
    {
      id: 6,
      path: [[28.6139, 77.2090], [23.0225, 72.5714]] as [number, number][],
      color: "#8b5cf6",
      label: "Delhi to Ahmedabad",
      source: "Northern Distribution Center (ID: DEL-05)",
      dest: "Regional Depot (ID: AMD-09)",
      cargo: "General Medical Supplies",
      status: "Dispatched"
    },
    {
      id: 7,
      path: [[28.6139, 77.2090], [32.7266, 74.8570]] as [number, number][],
      color: "#06b6d4",
      label: "Delhi to Jammu",
      source: "Northern Distribution Center (ID: DEL-05)",
      dest: "Northern Frontier Hub (ID: JAM-01)",
      cargo: "High Altitude Meds",
      status: "In Transit"
    },
    {
      id: 8,
      path: [[19.0760, 72.8777], [23.0225, 72.5714]] as [number, number][],
      color: "#f43f5e",
      label: "Mumbai to Ahmedabad",
      source: "Western Logistics Hub (ID: MUM-01)",
      dest: "Regional Depot (ID: AMD-09)",
      cargo: "Surgical Equipment",
      status: "In Transit"
    },
    {
      id: 9,
      path: [[12.9716, 77.5946], [13.0827, 80.2707]] as [number, number][],
      color: "#10b981",
      label: "Bangalore to Chennai",
      source: "Central Supply Hub (ID: BNG-04)",
      dest: "Southern Hub (ID: CHN-02)",
      cargo: "Emergency Kits",
      status: "In Transit"
    },
    {
      id: 10,
      path: [[17.3850, 78.4867], [12.9716, 77.5946]] as [number, number][],
      color: "#f97316",
      label: "Hyderabad to Bangalore",
      source: "Deccan Depot (ID: HYD-07)",
      dest: "Central Supply Hub (ID: BNG-04)",
      cargo: "Lab Reagents",
      status: "Dispatched"
    },
    {
      id: 11,
      path: [[22.5726, 88.3639], [17.3850, 78.4867]] as [number, number][],
      color: "#a855f7",
      label: "Kolkata to Hyderabad",
      source: "Eastern Hub (ID: KOL-03)",
      dest: "Deccan Depot (ID: HYD-07)",
      cargo: "Blood Plasma",
      status: "Scheduled"
    },
    {
      id: 12,
      path: [[23.2599, 77.4126], [28.6139, 77.2090]] as [number, number][],
      color: "#eab308",
      label: "MP to Delhi",
      source: "Central India Depot (ID: MP-01)",
      dest: "Northern Distribution Center (ID: DEL-05)",
      cargo: "Ayurvedic Supplements",
      status: "In Transit"
    },
    {
      id: 13,
      path: [[23.2599, 77.4126], [19.0760, 72.8777]] as [number, number][],
      color: "#6366f1",
      label: "MP to Mumbai",
      source: "Central India Depot (ID: MP-01)",
      dest: "Western Logistics Hub (ID: MUM-01)",
      cargo: "Generic Medicines",
      status: "In Transit"
    },
    {
      id: 14,
      path: [[22.5726, 88.3639], [13.0827, 80.2707]] as [number, number][],
      color: "#f43f5e",
      label: "Kolkata to Chennai",
      source: "Eastern Hub (ID: KOL-03)",
      dest: "Southern Hub (ID: CHN-02)",
      cargo: "Dialysis Kits",
      status: "In Transit"
    },
    {
      id: 15,
      path: [[17.3850, 78.4867], [23.0225, 72.5714]] as [number, number][],
      color: "#10b981",
      label: "Hyderabad to Ahmedabad",
      source: "Deccan Depot (ID: HYD-07)",
      dest: "Regional Depot (ID: AMD-09)",
      cargo: "Cardiac Meds",
      status: "Scheduled"
    },
    {
      id: 16,
      path: [[12.9716, 77.5946], [19.0760, 72.8777]] as [number, number][],
      color: "#38bdf8",
      label: "Bangalore to Mumbai",
      source: "Central Supply Hub (ID: BNG-04)",
      dest: "Western Logistics Hub (ID: MUM-01)",
      cargo: "Ortho Implants",
      status: "In Transit"
    },
    {
      id: 17,
      path: [[28.6139, 77.2090], [22.5726, 88.3639]] as [number, number][],
      color: "#fbbf24",
      label: "Delhi to Kolkata",
      source: "Northern Distribution Center (ID: DEL-05)",
      dest: "Eastern Hub (ID: KOL-03)",
      cargo: "Oncology Drugs",
      status: "Dispatched"
    },
    { id: 18, path: [[26.8467, 80.9462], [28.6139, 77.2090]] as [number, number][], color: "#fbbf24", label: "Lucknow to Delhi", cargo: "Insulin", status: "In Transit" },
    { id: 19, path: [[18.5204, 73.8567], [19.0760, 72.8777]] as [number, number][], color: "#10b981", label: "Pune to Mumbai", cargo: "IV Fluids", status: "Delivered" },
    { id: 20, path: [[26.1445, 91.7362], [22.5726, 88.3639]] as [number, number][], color: "#fbbf24", label: "Guwahati to Kolkata", cargo: "Vaccines", status: "In Transit" },
    { id: 21, path: [[9.9312, 76.2673], [13.0827, 80.2707]] as [number, number][], color: "#10b981", label: "Kochi to Chennai", cargo: "Medical Kits", status: "Delivered" },
    { id: 22, path: [[17.6868, 83.2185], [17.3850, 78.4867]] as [number, number][], color: "#fbbf24", label: "Vizag to Hyderabad", cargo: "Oxygen Concentrators", status: "In Transit" },
    { id: 23, path: [[30.7333, 76.7794], [28.6139, 77.2090]] as [number, number][], color: "#10b981", label: "Chandigarh to Delhi", cargo: "Antibiotics", status: "Delivered" },
    { id: 24, path: [[22.7196, 75.8577], [23.2599, 77.4126]] as [number, number][], color: "#fbbf24", label: "Indore to Bhopal", cargo: "Generics", status: "In Transit" },
    { id: 25, path: [[21.1458, 79.0882], [19.0760, 72.8777]] as [number, number][], color: "#fbbf24", label: "Nagpur to Mumbai", cargo: "Surgical Tools", status: "In Transit" },
    { id: 26, path: [[21.1702, 72.8311], [23.0225, 72.5714]] as [number, number][], color: "#10b981", label: "Surat to Ahmedabad", cargo: "Blood Plasma", status: "Delivered" },
    { id: 27, path: [[11.0168, 76.9558], [12.9716, 77.5946]] as [number, number][], color: "#fbbf24", label: "Coimbatore to Bangalore", cargo: "Vaccines", status: "In Transit" },
    { id: 28, path: [[20.2961, 85.8245], [22.5726, 88.3639]] as [number, number][], color: "#10b981", label: "Bhubaneswar to Kolkata", cargo: "First Aid Kits", status: "Delivered" },
    { id: 29, path: [[21.2514, 81.6296], [23.2599, 77.4126]] as [number, number][], color: "#fbbf24", label: "Raipur to Bhopal", cargo: "Pain Relief", status: "In Transit" },
    { id: 30, path: [[23.3441, 85.3096], [22.5726, 88.3639]] as [number, number][], color: "#10b981", label: "Ranchi to Kolkata", cargo: "Generics", status: "Delivered" },
    { id: 31, path: [[25.5788, 91.8933], [26.1445, 91.7362]] as [number, number][], color: "#fbbf24", label: "Shillong to Guwahati", cargo: "Essential Meds", status: "In Transit" },
    { id: 32, path: [[30.3165, 78.0322], [28.6139, 77.2090]] as [number, number][], color: "#10b981", label: "Dehradun to Delhi", cargo: "Antibiotics", status: "Delivered" },
    { id: 33, path: [[27.1767, 78.0081], [26.8467, 80.9462]] as [number, number][], color: "#fbbf24", label: "Agra to Lucknow", cargo: "Critical Care", status: "In Transit" },
    { id: 34, path: [[25.3176, 82.9739], [25.5941, 85.1376]] as [number, number][], color: "#10b981", label: "Varanasi to Patna", cargo: "Generics", status: "Delivered" },
    { id: 35, path: [[9.9252, 78.1198], [13.0827, 80.2707]] as [number, number][], color: "#fbbf24", label: "Madurai to Chennai", cargo: "Surgical Supplies", status: "In Transit" },
    { id: 36, path: [[8.5241, 76.9366], [9.9312, 76.2673]] as [number, number][], color: "#10b981", label: "Trivandrum to Kochi", cargo: "Vaccines", status: "Delivered" },
    { id: 37, path: [[28.6139, 77.2090], [12.9716, 77.5946]] as [number, number][], color: "#fbbf24", label: "Delhi to Bangalore", cargo: "Emergency Devices", status: "In Transit" },
    { id: 38, path: [[19.0760, 72.8777], [13.0827, 80.2707]] as [number, number][], color: "#10b981", label: "Mumbai to Chennai", cargo: "Cardiac Meds", status: "Delivered" },
    { id: 39, path: [[17.3850, 78.4867], [22.5726, 88.3639]] as [number, number][], color: "#fbbf24", label: "Hyderabad to Kolkata", cargo: "Life Support", status: "In Transit" },
    { id: 40, path: [[23.0225, 72.5714], [28.6139, 77.2090]] as [number, number][], color: "#10b981", label: "Ahmedabad to Delhi", cargo: "Generics", status: "Delivered" },
    { id: 41, path: [[28.6139, 77.2090], [21.1458, 79.0882]] as [number, number][], color: "#fbbf24", label: "Delhi to Nagpur", cargo: "Critical Care", status: "In Transit" }
  ];

  const hubs = [
    { id: 'BNG-04', name: "Central Supply Hub", pos: [12.9716, 77.5946] as [number, number], city: "Bangalore" },
    { id: 'AMD-09', name: "Regional Depot", pos: [23.0225, 72.5714] as [number, number], city: "Ahmedabad" },
    { id: 'MUM-01', name: "Western Logistics Hub", pos: [19.0760, 72.8777] as [number, number], city: "Mumbai" },
    { id: 'DEL-05', name: "Northern Distribution Center", pos: [28.6139, 77.2090] as [number, number], city: "Delhi" },
    { id: 'DEL-06', name: "Okhla Logistics Point", pos: [28.5450, 77.2732] as [number, number], city: "Delhi" },
    { id: 'KOL-03', name: "Eastern Hub", pos: [22.5726, 88.3639] as [number, number], city: "Kolkata" },
    { id: 'CHN-02', name: "Southern Hub", pos: [13.0827, 80.2707] as [number, number], city: "Chennai" },
    { id: 'HYD-07', name: "Deccan Depot", pos: [17.3850, 78.4867] as [number, number], city: "Hyderabad" },
    { id: 'JAM-01', name: "Northern Frontier Hub", pos: [32.7266, 74.8570] as [number, number], city: "Jammu" },
    { id: 'MP-01', name: "Central India Depot", pos: [23.2599, 77.4126] as [number, number], city: "Madhya Pradesh" },
    { id: 'PNQ-11', name: "Pune Logistics Hub", pos: [18.5204, 73.8567] as [number, number], city: "Pune" },
    { id: 'JAI-08', name: "Rajasthan Depot", pos: [26.9124, 75.7873] as [number, number], city: "Jaipur" },
    { id: 'LKO-14', name: "UP Central Hub", pos: [26.8467, 80.9462] as [number, number], city: "Lucknow" },
    { id: 'PAT-05', name: "Bihar Regional Hub", pos: [25.5941, 85.1376] as [number, number], city: "Patna" },
    { id: 'GUW-02', name: "NE Frontier Depot", pos: [26.1445, 91.7362] as [number, number], city: "Guwahati" },
    { id: 'KOC-19', name: "Kerala South Hub", pos: [9.9312, 76.2673] as [number, number], city: "Kochi" },
    { id: 'VIZ-07', name: "Vizag Coastal Hub", pos: [17.6868, 83.2185] as [number, number], city: "Visakhapatnam" },
    { id: 'CHG-03', name: "Chandigarh Depot", pos: [30.7333, 76.7794] as [number, number], city: "Chandigarh" },
    { id: 'IDR-09', name: "MP Western Depot", pos: [22.7196, 75.8577] as [number, number], city: "Indore" },
    { id: 'NAG-12', name: "Maharashtra Central Hub", pos: [21.1458, 79.0882] as [number, number], city: "Nagpur" },
    { id: 'BHO-04', name: "MP Capital Depot", pos: [23.2599, 77.4126] as [number, number], city: "Bhopal" },
    { id: 'SUR-08', name: "South Gujarat Hub", pos: [21.1702, 72.8311] as [number, number], city: "Surat" },
    { id: 'COI-06', name: "Tamil Nadu West Depot", pos: [11.0168, 76.9558] as [number, number], city: "Coimbatore" },
    { id: 'BBH-15', name: "Odisha Central Hub", pos: [20.2961, 85.8245] as [number, number], city: "Bhubaneswar" },
    { id: 'RAI-02', name: "Chhattisgarh Depot", pos: [21.2514, 81.6296] as [number, number], city: "Raipur" },
    { id: 'RAN-07', name: "Jharkhand Hub", pos: [23.3441, 85.3096] as [number, number], city: "Ranchi" },
    { id: 'SHI-04', name: "Meghalaya Depot", pos: [25.5788, 91.8933] as [number, number], city: "Shillong" },
    { id: 'DEH-09', name: "Uttarakhand Hub", pos: [30.3165, 78.0322] as [number, number], city: "Dehradun" },
    { id: 'AGR-11', name: "UP West Depot", pos: [27.1767, 78.0081] as [number, number], city: "Agra" },
    { id: 'VAR-05', name: "UP East Hub", pos: [25.3176, 82.9739] as [number, number], city: "Varanasi" },
    { id: 'MAD-03', name: "Tamil Nadu South Depot", pos: [9.9252, 78.1198] as [number, number], city: "Madurai" },
    { id: 'TIR-10', name: "Kerala Capital Hub", pos: [8.5241, 76.9366] as [number, number], city: "Thiruvananthapuram" }
  ];

  // Show dropboxes only when zoomed in (zoom > 9)
  const showDropboxes = zoomLevel > 9;

  return (
    <div className={`w-full ${height} rounded-[2.5rem] overflow-hidden border border-[#2c3e2e]/5 shadow-soft relative bg-white`}>
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-white/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#5b7b62] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#2c3e2e] font-bold text-[10px] uppercase tracking-widest">Grounding Map Data...</span>
          </div>
        </div>
      )}
      {!showDropboxes && !onlyDropboxes && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-[#5b7b62]/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white">Zoom in to view local drop-boxes</p>
        </div>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#2c3e2e]/5 shadow-soft min-w-[200px]">
        <h4 className="text-[10px] font-bold text-[#5b7b62] uppercase tracking-widest mb-3">Network Legend</h4>
        <div className="space-y-2">
          {mapType === 'gov' || mapType === 'gov-emergency' ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#5b7b62] rounded-full border border-white shadow-[0_0_8px_rgba(91,123,98,0.5)]" />
                <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">MedRoute Hubs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-1 bg-amber-500 rounded-full" />
                <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Active Shipments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-1 bg-emerald-600 rounded-full" />
                <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Delivered</span>
              </div>
              {mapType === 'gov-emergency' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-1 bg-rose-600/50 border border-rose-500 rounded-full" />
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">Emergency Routes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-500/20 border border-rose-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">Critical Zones</span>
                  </div>
                </>
              )}
            </>
          ) : isLandingPage ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#5b7b62] rounded-full border-2 border-white shadow-md" />
              <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">MedRoute Hubs</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#5b7b62] rounded-full border border-white shadow-sm" />
                <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Hub / Hub Agent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-4 bg-sky-600 rounded-sm" />
                <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Logistics Node</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-4 bg-[#a3b18a] rounded-sm" />
                <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Drop-box Point</span>
              </div>
              {!showOnlyTracking && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-4 bg-indigo-500 rounded-sm" />
                    <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Medical Site</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-1 bg-[#5b7b62] rounded-full" />
                    <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Transit Network</span>
                  </div>
                </>
              )}
            </>
          )}
          {showOnlyTracking && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 bg-[#5b7b62] rounded-full" />
              <span className="text-[10px] font-bold text-[#2c3e2e] uppercase tracking-tight">Pickup Route (Green)</span>
            </div>
          )}
        </div>
        
        {!showOnlyTracking && !isLandingPage && mapType !== 'gov' && mapType !== 'gov-emergency' && (
          <>
            <div className="mt-4 pt-3 border-t border-white/5">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Route Categories</h4>
              <div className="grid grid-cols-1 gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Surgical & Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Routine & General</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Cold Chain & Vaccines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Generics & Bulk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Specialized (Insulin/Blood)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[9px] font-medium text-slate-400 leading-tight">
                * Zoom onto a hub to see drop boxes in the city
              </p>
            </div>
          </>
        )}
      </div>
      <MapContainer 
        center={center} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%', background: '#f8f9f5' }}
        zoomControl={true}
      >
        <MapResizer />
        <ZoomHandler onZoomChange={setZoomLevel} />
        <BoundsHandler truckPos={truckPos} userPos={userPos} routePath={routePath} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {!showOnlyTracking && hubs.map(hub => (
          <Marker key={hub.id} position={hub.pos} icon={(isLandingPage || mapType === 'gov' || mapType === 'gov-emergency') ? hubPinIcon : warehouseIcon}>
            <Popup>
              <div className="p-1">
                <div className="text-[10px] font-black text-[#5b7b62] uppercase tracking-widest mb-1">MedRoute Hub: {hub.id}</div>
                <div className="font-bold text-slate-900 text-xs">{hub.name}</div>
                <div className="text-[9px] text-slate-500 mt-1">{hub.city} Operations Center</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {showOnlyTracking && activeHub && (
          <Marker position={[activeHub.lat, activeHub.lng]} icon={(isLandingPage || mapType === 'gov' || mapType === 'gov-emergency') ? hubPinIcon : warehouseIcon}>
            <Popup>
              <div className="p-1">
                <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">MedRoute Hub: {activeHub.id}</div>
                <div className="font-bold text-slate-900 text-xs">{activeHub.name}</div>
                <div className="text-[9px] text-slate-500 mt-1">Starting Point</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {routePath && routePath.length > 0 && !isLandingPage && (
          <Polyline 
            positions={routePath.map(p => [p.lat, p.lng] as [number, number])} 
            pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.8, lineJoin: 'round' }} 
          />
        )}

        {truckPos && (mapType === 'default' || showOnlyTracking) && !isLandingPage && (
          <Marker position={[truckPos.lat, truckPos.lng]} icon={truckIcon}>
            <Popup>
              <div className="font-bold text-indigo-600">MedRoute Logistics Truck</div>
              <div className="text-[10px] text-slate-500">En route to pickup</div>
            </Popup>
          </Marker>
        )}

        {userPos && (mapType === 'default' || showOnlyTracking) && !isLandingPage && (
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold text-slate-900">Your Location</div>
              <div className="text-[10px] text-slate-500">Pickup Destination</div>
            </Popup>
          </Marker>
        )}
        {!showOnlyTracking && !isLandingPage && mapType !== 'gov' && mapType !== 'gov-emergency' && disasterZones.map(zone => (
          <React.Fragment key={zone.id}>
            <Circle 
              center={zone.pos} 
              radius={60000} 
              pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.15, weight: 1 }} 
            />
            <Marker position={zone.pos} icon={isLandingPage ? hubPinIcon : alertIcon}>
              <Popup className="dark-popup">
                <div className="p-2">
                  <div className="font-black text-slate-900 uppercase tracking-tight text-xs mb-1">{zone.name}</div>
                  <div className={`text-[9px] font-black uppercase tracking-widest ${zone.priority === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>
                    {zone.priority} Zone
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {!showOnlyTracking && (showDropboxes || onlyDropboxes) && groundedFacilities.map((fac, i) => (
          <Marker 
            key={`fac-${i}`}
            position={[fac.lat, fac.lng]}
            icon={fac.type === 'dropbox' ? ((isLandingPage || mapType === 'gov' || mapType === 'gov-emergency') ? dropboxCircleIcon : dropboxIcon) : DefaultIcon}
          >
            <Popup>
              <div className="p-1 min-w-[120px]">
                <div className="font-bold text-[#5b7b62] text-xs">{fac.name}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                  {fac.type === 'dropbox' ? 'Verified Drop-box' : 'Medical Facility'}
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`, '_blank')}
                  className="mt-2 w-full bg-[#5b7b62] hover:bg-[#4a6350] text-white text-[10px] font-bold py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Gov Specific Routes (Normal & Emergency) */}
        {!showOnlyTracking && (mapType === 'gov' || mapType === 'gov-emergency') && routes.map(route => {
          const isDelivered = route.id % 3 === 0;
          let govColor = isDelivered ? '#10b981' : '#fbbf24';
          
          const isEmergencyRoute = mapType === 'gov-emergency' && route.id % 5 === 0;
          if (isEmergencyRoute) govColor = '#e11d48';

          return (
            <React.Fragment key={route.id}>
              <Polyline 
                positions={route.path} 
                pathOptions={{ color: govColor, weight: 6, opacity: 0.15, blur: 10 }} 
              />
              <Polyline 
                positions={route.path} 
                pathOptions={{ 
                  color: govColor, 
                  weight: isEmergencyRoute ? 4 : 3, 
                  dashArray: isEmergencyRoute ? undefined : '10, 10', 
                  opacity: 0.8 
                }} 
              >
                <Tooltip sticky direction="top" className="route-tooltip">
                  <div className="px-2 py-1 bg-slate-900/90 backdrop-blur-sm text-white rounded-md text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl flex flex-col gap-1">
                    <span className={isEmergencyRoute ? 'text-rose-400' : 'text-sky-400'}>
                      {isEmergencyRoute ? '🚨 PRIORITY EMERGENCY: ' : ''}{route.label}
                    </span>
                    <span className="text-white">Transporting: {route.cargo}</span>
                    <span className={isEmergencyRoute ? 'text-rose-400 font-black' : (isDelivered ? 'text-emerald-400' : 'text-amber-400')}>
                      Status: {isEmergencyRoute ? 'EMERGENCY DISPATCH' : (isDelivered ? 'Delivered' : 'In Transit')}
                    </span>
                  </div>
                </Tooltip>
              </Polyline>
            </React.Fragment>
          );
        })}

        {/* Gov Emergency Specific Zones Overlay */}
        {mapType === 'gov-emergency' && disasterZones.map(zone => (
          <React.Fragment key={`gov-zone-${zone.id}`}>
            <Circle 
              center={zone.pos} 
              radius={70000} 
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }} 
            />
            <Marker position={zone.pos} icon={alertIcon}>
              <Tooltip sticky>
                <div className="p-1 px-2">
                  <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Critical Zone
                  </div>
                  <div className="text-xs font-bold text-slate-800">{zone.name}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">Status: Restricted Access</div>
                </div>
              </Tooltip>
            </Marker>
          </React.Fragment>
        ))}

        {!showOnlyTracking && !isLandingPage && mapType !== 'gov' && mapType !== 'gov-emergency' && routes.map(route => (
          <React.Fragment key={route.id}>
            {/* Start Point - Only show if not emergency or if we want to show centers */}
            {mapType === 'default' && (
              <Marker position={route.path[0]} icon={warehouseIcon}>
                <Popup>
                  <div className="p-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source (Anonymized)</div>
                    <div className="font-bold text-slate-900 text-xs">{route.source}</div>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* End Point - Only show if not emergency or if we want to show centers */}
            {mapType === 'default' && (
              <Marker position={route.path[1]} icon={warehouseIcon}>
                <Popup>
                  <div className="p-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination (Anonymized)</div>
                    <div className="font-bold text-slate-900 text-xs">{route.dest}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            <Polyline 
              positions={route.path} 
              pathOptions={{ color: route.color, weight: 6, opacity: 0.15, blur: 10 }} 
            />
            <Polyline 
              positions={route.path} 
              pathOptions={{ color: route.color, weight: 3, dashArray: '10, 10', opacity: 0.8 }} 
            >
              <Tooltip sticky direction="top" className="route-tooltip">
                <div className="px-2 py-1 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                  {route.label}
                </div>
              </Tooltip>
              <Popup>
                <div className="p-2 min-w-[150px]">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shipment Details</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Cargo:</span>
                      <span className="font-bold text-slate-900">{route.cargo}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Status:</span>
                      <span className={`font-bold ${route.status === 'In Transit' ? 'text-emerald-600' : 'text-amber-600'}`}>{route.status}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 italic mt-2 border-t pt-2">
                      Privacy Shield Active: PII Redacted
                    </div>
                  </div>
                </div>
              </Popup>
            </Polyline>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
