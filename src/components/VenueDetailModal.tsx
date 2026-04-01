import React from 'react';
import { TrendingUp, Lightbulb, CalendarCheck, Wallet, Clock, X, MapPin, ExternalLink, History, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

const trafficData = [
  { name: 'MON', traffic: 4200 }, { name: 'TUE', traffic: 5100 },
  { name: 'WED', traffic: 3800 }, { name: 'THU', traffic: 7200 },
  { name: 'FRI', traffic: 5900 }, { name: 'SAT', traffic: 3100 },
  { name: 'SUN', traffic: 6800 },
];

export function VenueDetailModal({ venue, onClose }: { venue: any, onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {venue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              <div className="w-full md:w-2/5 bg-primary-container p-4 md:p-8 text-white relative overflow-hidden flex flex-col">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <button onClick={onClose} className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors md:hidden"><X className="w-5 h-5" /></button>
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <img src={venue.image} alt={venue.name} className="w-24 h-24 rounded-2xl object-cover shadow-2xl border-4 border-white/20 mb-6" referrerPolicy="no-referrer" />
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">Venue ID: {venue.id}</span>
                    <h2 className="text-3xl font-black mt-4 leading-tight">{venue.name}</h2>
                    <p className="text-white/70 text-sm mt-2 flex items-center gap-2"><MapPin className="w-4 h-4" />{venue.location}</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><History className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Last Visit</p>
                        <p className="font-bold">{venue.lastVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Status</p>
                        <p className="font-bold">{venue.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-8">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Traffic Trend</p>
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                          <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="traffic" stroke="#ffffff" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar bg-surface-container-lowest">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-on-surface tracking-tight">Venue Intelligence</h3>
                  <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors hidden md:block"><X className="w-6 h-6 text-on-surface-variant" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Suggested', value: venue.suggested, icon: Lightbulb, color: 'text-primary' },
                    { label: 'Booked', value: venue.booked, icon: CalendarCheck, color: 'text-primary' },
                    { label: 'Collected', value: venue.commCollected, icon: Wallet, color: 'text-tertiary' },
                    { label: 'Pending', value: venue.pendingComm, icon: Clock, color: venue.pendingComm > 0 ? 'text-error' : 'text-on-surface-variant' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                      <div className="flex items-center gap-2 mb-1"><stat.icon className={cn("w-3 h-3", stat.color)} /><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span></div>
                      <p className="text-2xl font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-6 mb-10">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Venue Description</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{venue.description}</p>
                  </div>
                  <div className="flex gap-4 md:gap-8">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Manager</h4>
                      <p className="text-sm font-bold">{venue.manager}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Contact</h4>
                      <p className="text-sm font-bold">{venue.contact}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={() => navigate('/general-visit')} className="flex items-center justify-center gap-2 py-4 bg-primary-container text-white rounded-xl font-black text-sm shadow-lg hover:shadow-primary-container/20 transition-all active:scale-95"><CalendarCheck className="w-4 h-4" />Log Visit</button>
                  <button onClick={() => navigate('/commission')} className="flex items-center justify-center gap-2 py-4 bg-surface-container-high text-on-surface rounded-xl font-black text-sm hover:bg-surface-container-highest transition-all active:scale-95"><Wallet className="w-4 h-4" />Collect Comm.</button>
                  <button onClick={() => navigate('/bwg')} className="flex items-center justify-center gap-2 py-4 border-2 border-primary-container text-primary-container rounded-xl font-black text-sm hover:bg-primary-container/5 transition-all active:scale-95"><TrendingUp className="w-4 h-4" />Upgrade BWG</button>
                  <button className="flex items-center justify-center gap-2 py-4 bg-on-surface text-surface-container-lowest rounded-xl font-black text-sm hover:opacity-90 transition-all active:scale-95"><ExternalLink className="w-4 h-4" />View Details</button>
                </div>
              </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
