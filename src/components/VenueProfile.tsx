import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Lightbulb, 
  CalendarCheck, 
  Wallet, 
  Clock, 
  X, 
  MapPin, 
  ChevronLeft, 
  Users, 
  Building2, 
  History, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Info,
  LineChart,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Cell, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { venues, trafficData } from '../data/mockData';

export function VenueProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('venue');
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const venue = venues.find(v => v.id === id) || venues[0];

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFabExpanded) {
      timer = setTimeout(() => {
        setIsFabExpanded(false);
      }, 3200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFabExpanded]);

  const tabs = [
    { id: 'venue', label: 'Venue Info', icon: Building2 },
    { id: 'vendor', label: 'Vendor Profile', icon: Users },
    { id: 'crm', label: 'CRM Insights', icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Premium Header */}
      <div className="relative h-[250px] md:h-[350px] overflow-hidden">
        <img 
          src={venue.image} 
          alt={venue.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full text-white transition-all z-20 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
               <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">ID: {venue.id}</span>
               <span className={cn(
                 "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                 venue.status === 'Verified' ? "bg-tertiary text-white" : "bg-primary-container text-white"
               )}>{venue.status}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">{venue.name}</h1>
            <p className="text-white/80 flex items-center gap-2 font-medium">
              <MapPin className="w-5 h-5 text-primary" />
              {venue.location}
            </p>
          </div>
          
          <div className="hidden md:flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Total Leads</p>
              <p className="text-2xl font-black text-white">{venue.crmDetails.totalLeads}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Conversion</p>
              <p className="text-2xl font-black text-white">{venue.crmDetails.conversionRate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-12 md:-mt-16 relative z-20">
        {/* Left Column - Navigation & Stats */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Section Selector */}
          <div className="bg-surface-container-lowest rounded-3xl shadow-xl p-4 flex lg:flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-on-surface-variant hover:bg-surface-container-low"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-primary" /> Performance
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Suggested', value: venue.suggested, icon: Lightbulb },
                { label: 'Booked', value: venue.booked, icon: CalendarCheck },
                { label: 'Commission', value: `₹${venue.commCollected}K`, icon: Wallet },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-4 h-4 text-on-surface-variant/40" />
                    <span className="text-sm font-bold text-on-surface-variant">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black text-on-surface">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'venue' && (
              <motion.div
                key="venue"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-surface-container-lowest rounded-3xl shadow-xl p-8 space-y-10"
              >
                {/* Venue Description */}
                <div>
                  <h3 className="text-xl font-black text-on-surface mb-4">About the Property</h3>
                  <p className="text-on-surface-variant leading-relaxed text-lg font-medium opacity-80">
                    {venue.description}
                  </p>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
                     <Users className="w-8 h-8 text-primary mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Capacity</p>
                     <p className="text-xl font-bold mt-1">1000+</p>
                   </div>
                   <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
                     <Clock className="w-8 h-8 text-tertiary mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Best Time</p>
                     <p className="text-xl font-bold mt-1">Evening</p>
                   </div>
                   <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
                     <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Parking</p>
                     <p className="text-xl font-bold mt-1">Available</p>
                   </div>
                   <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
                     <TrendingUp className="w-8 h-8 text-secondary mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Traffic</p>
                     <p className="text-xl font-bold mt-1">{venue.traffic}</p>
                   </div>
                </div>

                {/* Traffic Trend Chart */}
                <div className="pt-6 border-t border-outline-variant/10">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-on-surface">Weekly Traffic Intensity</h3>
                     <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">Last 7 Days</span>
                   </div>
                   <div className="h-64 md:h-72">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="var(--md-sys-color-primary)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            interval={0}
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--md-sys-color-on-surface-variant)', opacity: 0.5 }} 
                          />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '20px', 
                              border: 'none', 
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', 
                              background: 'var(--md-sys-color-surface-container-highest)',
                              backdropFilter: 'blur(8px)',
                              padding: '12px 16px'
                            }}
                            itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '12px', color: 'var(--md-sys-color-primary)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="traffic" 
                            stroke="var(--md-sys-color-primary)" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorTraffic)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--md-sys-color-primary)' }}
                          />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vendor' && (
              <motion.div
                key="vendor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-surface-container-lowest rounded-3xl shadow-xl p-8 space-y-10"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                   <div className="w-24 h-24 bg-primary-container rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shrink-0">
                     {venue.vendor.name[0]}
                   </div>
                   <div className="flex-1">
                     <h3 className="text-3xl font-black text-on-surface mb-2">{venue.vendor.name}</h3>
                     <p className="text-on-surface-variant font-medium flex items-center gap-2">
                       <MapPin className="w-5 h-5 text-primary" /> {venue.vendor.address}
                     </p>
                     <div className="flex flex-wrap gap-4 mt-6">
                        <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold">{venue.vendor.phone}</span>
                        </div>
                        <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-3 min-w-0 flex-1 sm:flex-none">
                          <Mail className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm font-bold truncate">{venue.vendor.email}</span>
                        </div>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant/10">
                   <div className="p-6 bg-surface-container-low/50 rounded-2xl text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Business Since</p>
                     <p className="text-xl font-black text-tertiary">{venue.vendor.businessSince}</p>
                   </div>
                   <div className="p-6 bg-surface-container-low/50 rounded-2xl text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Total Properties</p>
                     <p className="text-xl font-black text-primary">{venue.vendor.totalProperties}</p>
                   </div>
                   <div className="p-6 bg-surface-container-low/50 rounded-2xl text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Owner</p>
                     <p className="text-xl font-black text-on-surface">{venue.vendor.owner}</p>
                   </div>
                </div>

                <div className="bg-primary/5 rounded-3xl p-6 flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                     <Info className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-on-surface mb-1">Vendor Reputation</h4>
                     <p className="text-sm text-on-surface-variant/80 font-medium leading-relaxed">
                       This vendor has been a top performer in the hub for over {new Date().getFullYear() - parseInt(venue.vendor.businessSince)} years. They maintain a high standard of property management and have a consistent record with commission collections.
                     </p>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'crm' && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-surface-container-lowest rounded-3xl shadow-xl p-8 space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Visit History */}
                   <div className="space-y-6">
                     <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                       <History className="w-6 h-6 text-primary" /> Recent Visits
                     </h3>
                     <div className="space-y-4">
                       {venue.crmDetails.visitHistory.map((visit, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface">{visit.date}</span>
                              <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">{visit.purpose}</span>
                            </div>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              visit.status === 'Success' ? "bg-tertiary/10 text-tertiary" : "bg-primary-container/10 text-primary-container"
                            )}>{visit.status}</span>
                         </div>
                       ))}
                     </div>
                     <button className="w-full py-4 border-2 border-dashed border-outline-variant/30 text-on-surface-variant rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all">
                       Log New Activity
                     </button>
                   </div>

                   {/* Intelligence Notes */}
                   <div className="space-y-6">
                     <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                       <MessageSquare className="w-6 h-6 text-secondary" /> CRM Notes
                     </h3>
                     <div className="space-y-4">
                        {venue.crmDetails.notes.map((note, i) => (
                          <div key={i} className="p-4 bg-secondary/5 rounded-2xl border-l-4 border-secondary">
                            <p className="text-sm font-medium text-on-surface-variant">{note}</p>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>

                {/* KPI Card */}
                <div className="bg-surface-container-low rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 border border-outline-variant/10">
                   <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" className="text-surface-container-highest" />
                        <motion.circle 
                          cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" 
                          strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * 0.85)} 
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black leading-none">85%</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">Health</span>
                      </div>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-2xl font-black text-on-surface mb-2">Platform IQ Score</h4>
                      <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                        Based on visit frequency, commission punctuality, and lead conversion, this property holds a <strong>Platinum Rank</strong>. Focus on upgrading them to the 'BWG Gold' partnership tier.
                      </p>
                      <button className="mt-4 text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0">
                        View Detailed Audit <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[110] pb-28 p-6 md:p-10 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-end">
           <motion.div 
             initial={{ y: 100 }} 
             animate={{ y: 0 }} 
             className="flex gap-4 pointer-events-auto"
           >
              <button 
                onClick={() => {
                  if (windowWidth < 768 && !isFabExpanded) {
                    setIsFabExpanded(true);
                  } else {
                    navigate('/general-visit');
                  }
                }}
                className={cn(
                  "bg-on-surface text-surface py-5 px-8 rounded-2xl font-black shadow-2xl flex items-center gap-3 transition-all active:scale-95",
                  windowWidth < 768 && !isFabExpanded ? "px-5" : "px-8"
                )}
              >
                <CalendarCheck className="w-5 h-5 text-primary" />
                <AnimatePresence mode="wait">
                  {(isFabExpanded || windowWidth >= 768) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      Log General Visit
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
