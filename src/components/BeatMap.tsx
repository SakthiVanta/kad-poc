import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Navigation, Store, MapPin, ChevronRight, Filter, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

// Fix for default marker icon
const getMarkerIcon = (status?: string) => {
  let colorClass = 'text-primary';
  if (status === 'visited') colorClass = 'text-tertiary';
  else if (status === 'pending') colorClass = 'text-amber-500';
  else if (status === 'priority') colorClass = 'text-primary';

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${colorClass} drop-shadow-md">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15.006 4 10a8 8 0 0 1 16 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white" stroke="white"></circle>
        </svg>
      </div>
    `,
    className: 'bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

L.Marker.prototype.options.icon = getMarkerIcon();

interface Venue {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  status: 'visited' | 'pending' | 'priority';
}

interface Beat {
  id: string;
  name: string;
  center: [number, number];
  radius: number; // in meters
  venues: Venue[];
}

const mockBeats: Beat[] = [
  {
    id: 'B1',
    name: 'T Nagar',
    center: [13.0418, 80.2341],
    radius: 1500,
    venues: [
      { id: 'V1', name: 'Retail Hub Main', lat: 13.0390, lng: 80.2320, type: 'Premium', status: 'visited' },
      { id: 'V2', name: 'Textile Street Center', lat: 13.0430, lng: 80.2360, type: 'Premium', status: 'pending' },
      { id: 'V3', name: 'Usman Road Plaza', lat: 13.0400, lng: 80.2330, type: 'Standard', status: 'priority' },
      { id: 'V4', name: 'Pondy Bazaar Outlet', lat: 13.0440, lng: 80.2370, type: 'Standard', status: 'pending' },
      { id: 'V5', name: 'Jewelry Mart', lat: 13.0450, lng: 80.2380, type: 'Premium', status: 'visited' },
    ]
  },
  {
    id: 'B2',
    name: 'Adyar',
    center: [13.0012, 80.2565],
    radius: 1200,
    venues: [
      { id: 'V6', name: 'Corner Bakery', lat: 13.0030, lng: 80.2540, type: 'Premium', status: 'visited' },
      { id: 'V7', name: 'River View Cafe', lat: 13.0000, lng: 80.2580, type: 'Standard', status: 'priority' },
      { id: 'V8', name: 'Adyar Signal Plaza', lat: 12.9990, lng: 80.2550, type: 'Standard', status: 'pending' },
      { id: 'V9', name: 'Lifestyle Point', lat: 13.0040, lng: 80.2570, type: 'Premium', status: 'visited' },
    ]
  },
  {
    id: 'B3',
    name: 'Anna Nagar',
    center: [13.0850, 80.2101],
    radius: 1800,
    venues: [
      { id: 'V10', name: 'Second Avenue Retail', lat: 13.0830, lng: 80.2120, type: 'Premium', status: 'visited' },
      { id: 'V11', name: 'Tower Park Shops', lat: 13.0870, lng: 80.2080, type: 'Standard', status: 'pending' },
      { id: 'V12', name: 'Roundtana Central', lat: 13.0860, lng: 80.2090, type: 'Standard', status: 'priority' },
      { id: 'V13', name: 'Boulevard Hub', lat: 13.0890, lng: 80.2130, type: 'Premium', status: 'pending' },
    ]
  },
  {
    id: 'B4',
    name: 'Velachery',
    center: [12.9815, 80.2230],
    radius: 1400,
    venues: [
      { id: 'V14', name: 'Mall Entrance Plaza', lat: 12.9825, lng: 80.2210, type: 'Premium', status: 'visited' },
      { id: 'V15', name: 'Bypass Road Outlet', lat: 12.9800, lng: 80.2240, type: 'Premium', status: 'priority' },
      { id: 'V16', name: '100ft Road Station', lat: 12.9830, lng: 80.2250, type: 'Standard', status: 'pending' },
      { id: 'V17', name: 'Tech Park Zone', lat: 12.9780, lng: 80.2270, type: 'Standard', status: 'visited' },
    ]
  },
  {
    id: 'B5',
    name: 'Mylapore',
    center: [13.0335, 80.2675],
    radius: 1100,
    venues: [
      { id: 'V18', name: 'Cultural Hub Point', lat: 13.0330, lng: 80.2680, type: 'Premium', status: 'visited' },
      { id: 'V19', name: 'Heritage Square', lat: 13.0350, lng: 80.2660, type: 'Standard', status: 'pending' },
      { id: 'V20', name: 'Temple Street Retail', lat: 13.0320, lng: 80.2690, type: 'Standard', status: 'priority' },
      { id: 'V21', name: 'Kutchery Road Shops', lat: 13.0340, lng: 80.2670, type: 'Premium', status: 'visited' },
    ]
  },
  {
    id: 'B6',
    name: 'Nungambakkam',
    center: [13.0604, 80.2464],
    radius: 1300,
    venues: [
      { id: 'V22', name: 'High Road Plaza', lat: 13.0580, lng: 80.2480, type: 'Premium', status: 'priority' },
      { id: 'V23', name: 'KNK Premier', lat: 13.0620, lng: 80.2440, type: 'Premium', status: 'visited' },
      { id: 'V24', name: 'College Road Hub', lat: 13.0610, lng: 80.2450, type: 'Standard', status: 'pending' },
      { id: 'V25', name: 'Sterling Junction', lat: 13.0630, lng: 80.2430, type: 'Standard', status: 'pending' },
    ]
  }
];

// Component to handle map view changes and fix size issues
function MapController({ center, zoom, isOpen }: { center: [number, number], zoom: number, isOpen: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        map.invalidateSize();
      }, 400); // Wait for modal animation
    }
  }, [isOpen, map]);

  return null;
}

export function BeatMap({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [selectedBeat, setSelectedBeat] = useState<Beat>(mockBeats[0]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
  const [clickedVenue, setClickedVenue] = useState<Venue | null>(null);
  const [filter, setFilter] = useState<'all' | 'visited' | 'pending' | 'priority'>('all');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  const filteredVenues = selectedBeat.venues.filter(v => 
    filter === 'all' || v.status === filter
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full h-full md:h-[90vh] max-w-6xl bg-surface-container-lowest md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Beat Intelligence Map</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Beat:</span>
                  <div className="relative">
                    <select
                      value={selectedBeat.id}
                      onChange={(e) => setSelectedBeat(mockBeats.find(b => b.id === e.target.value) || mockBeats[0])}
                      className="appearance-none bg-primary/10 hover:bg-primary/20 transition-colors border-none py-1.5 pl-3 pr-8 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest focus:ring-0 cursor-pointer outline-none"
                    >
                      {mockBeats.map(beat => (
                        <option key={beat.id} value={beat.id} className="bg-surface-container-lowest text-on-surface font-bold">
                          {beat.name} ({beat.id})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-surface-container-low p-1 rounded-xl">
                {(['all', 'visited', 'pending', 'priority'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      filter === f ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-surface-container-low hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative">
            <MapContainer 
              center={selectedBeat.center} 
              zoom={14} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController center={selectedBeat.center} zoom={14} isOpen={isOpen} />

              {/* Global Primary Wash Overlay */}
              <Circle 
                center={selectedBeat.center} 
                radius={100000} // Very large to cover visible area
                pathOptions={{ 
                  fillColor: 'var(--primary)', 
                  fillOpacity: 0.03, 
                  color: 'transparent',
                  interactive: false
                }}
              />

              {/* Beat Region Overlay (The "Rounded Region") */}
              <Circle 
                center={selectedBeat.center} 
                radius={selectedBeat.radius}
                pathOptions={{ 
                  fillColor: 'var(--primary)', 
                  fillOpacity: 0.15, 
                  color: 'var(--primary)', 
                  weight: 3,
                  dashArray: '10, 10',
                  lineCap: 'round'
                }}
              />
              
              {/* Inner Focus Circle */}
              <Circle 
                center={selectedBeat.center} 
                radius={selectedBeat.radius * 0.95}
                pathOptions={{ 
                  fillColor: 'transparent',
                  color: 'var(--primary)', 
                  weight: 1,
                  opacity: 0.3
                }}
              />

              {/* User Location */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center p-1">
                      <p className="font-bold text-xs">Your Location</p>
                      <p className="text-[10px] text-on-surface-variant">Active Syncing...</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Venue Markers */}
              {filteredVenues.map((venue) => (
                <Marker 
                  key={venue.id} 
                  position={[venue.lat, venue.lng]}
                  icon={getMarkerIcon(venue.status)}
                  eventHandlers={{
                    mouseover: () => setHoveredVenue(venue),
                    mouseout: () => setHoveredVenue(null),
                    click: () => setClickedVenue(venue)
                  }}
                >
                  <Popup>
                    <div className="w-48 p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                          venue.status === 'visited' ? "bg-tertiary" : venue.status === 'priority' ? "bg-primary" : "bg-amber-500"
                        )}>
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{venue.name}</p>
                          <p className="text-[9px] text-on-surface-variant uppercase font-black">{venue.type}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setClickedVenue(venue)}
                        className="w-full py-2 bg-primary text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1"
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating Controls */}
            <div className="absolute bottom-8 left-8 z-[100] flex flex-col gap-3">
              <button className="p-4 bg-surface-container-lowest rounded-2xl shadow-xl text-primary hover:scale-105 transition-transform">
                <Navigation className="w-6 h-6" />
              </button>
              <button className="p-4 bg-surface-container-lowest rounded-2xl shadow-xl text-on-surface-variant hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </button>
            </div>

            {/* Hover/Click Info Card */}
            <AnimatePresence>
              {(hoveredVenue || clickedVenue) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={cn(
                    "absolute bottom-8 right-8 z-[100] w-80 bg-surface-container-lowest rounded-[32px] shadow-2xl border border-outline-variant/10 overflow-hidden",
                    clickedVenue ? "ring-2 ring-primary/20" : ""
                  )}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        (clickedVenue || hoveredVenue)?.status === 'visited' ? "bg-tertiary/10 text-tertiary" :
                          (clickedVenue || hoveredVenue)?.status === 'priority' ? "bg-primary/10 text-primary" :
                            "bg-amber-500/10 text-amber-500"
                      )}>
                        {(clickedVenue || hoveredVenue)?.status}
                      </div>
                      <button 
                        onClick={() => { setHoveredVenue(null); setClickedVenue(null); }} 
                        className="p-1 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h4 className="text-xl font-black text-on-surface leading-tight">{(clickedVenue || hoveredVenue)?.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-1.5 font-medium">ID: {(clickedVenue || hoveredVenue)?.id} • {(clickedVenue || hoveredVenue)?.type} Venue</p>
                    
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 py-3.5 bg-primary text-white font-black text-xs rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        Log Visit
                      </button>
                      <button className="px-5 py-3.5 bg-surface-container-low text-on-surface font-bold text-xs rounded-2xl hover:bg-surface-container-high transition-all">
                        Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Stats */}
          <div className="p-4 bg-surface-container-low flex items-center justify-center gap-4 md:gap-8 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-tertiary rounded-full"></div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Visited: 12</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pending: 25</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Priority: 5</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
