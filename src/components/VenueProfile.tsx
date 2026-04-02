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
  ArrowRight,
  Award,
  Activity,
  DollarSign,
  FileText,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  BarChart2,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Cell, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { venues, trafficData } from '../data/mockData';

// ─── Audit Modal ─────────────────────────────────────────────────────────────
function AuditModal({ venue, onClose }: { venue: (typeof venues)[0]; onClose: () => void }) {
  const [tab, setTab] = useState<'summary' | 'visits' | 'commission' | 'leads'>('summary');
  const { audit } = venue;
  const iq = audit.platformIQ;
  const s = audit.summary;

  const rankColors: Record<string, string> = {
    Diamond: 'text-sky-400',
    Platinum: 'text-violet-400',
    Gold: 'text-amber-400',
    Silver: 'text-slate-400',
  };

  const visitTypeColor: Record<string, string> = {
    'Commission': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    'P1 Visit': 'bg-primary/10 text-primary border-primary/20',
    'General Visit': 'bg-sky-500/10 text-sky-600 border-sky-200',
    'BWG Upgrade': 'bg-violet-500/10 text-violet-600 border-violet-200',
    'Lead Capture': 'bg-amber-500/10 text-amber-600 border-amber-200',
  };

  const outcomeIcon = (outcome: string) => {
    if (outcome === 'Success' || outcome === 'Collected' || outcome === 'Completed') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (outcome === 'Declined') return <XCircle className="w-4 h-4 text-error" />;
    return <AlertCircle className="w-4 h-4 text-amber-500" />;
  };

  const formatCurrency = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (circumference * iq.score) / 100;

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BarChart2 },
    { id: 'visits', label: 'Visit Log', icon: History },
    { id: 'commission', label: 'Commission', icon: DollarSign },
    { id: 'leads', label: 'Lead Pipeline', icon: Activity },
  ] as const;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative bg-surface w-full sm:max-w-4xl max-h-[94vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/15 shrink-0 bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Platform Audit Report</p>
              <h2 className="text-base font-black text-on-surface leading-tight">{venue.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* IQ Score Hero */}
        <div className="px-6 py-5 bg-gradient-to-r from-primary/5 to-tertiary/5 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-6">
            {/* Ring Chart */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-container-high" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black leading-none">{iq.score}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">IQ</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={cn('text-lg font-black', rankColors[iq.rank] ?? 'text-primary')}>{iq.rank} Rank</span>
                <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                  ID: {venue.id}
                </span>
                <span className="bg-tertiary/10 text-tertiary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                  {s.bwgStatus}
                </span>
              </div>
              {/* Score Bars */}
              <div className="space-y-1.5">
                {iq.breakdown.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-on-surface-variant w-36 shrink-0 hidden sm:block">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        className={cn('h-full rounded-full', item.score >= 85 ? 'bg-tertiary' : 'bg-primary')}
                      />
                    </div>
                    <span className="text-[9px] font-black text-on-surface-variant w-7 text-right">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:grid grid-cols-2 gap-3 shrink-0">
              {[
                { label: 'Total Visits', value: s.totalVisits, color: 'text-primary' },
                { label: 'Avg Score', value: `${s.avgVisitScore}/5`, color: 'text-tertiary' },
                { label: 'Comm. Collected', value: formatCurrency(s.commissionCollected), color: 'text-emerald-600' },
                { label: 'Comm. Pending', value: formatCurrency(s.commissionPending), color: s.commissionPending > 0 ? 'text-error' : 'text-tertiary' },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-low rounded-2xl px-4 py-3 min-w-[110px]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">{stat.label}</p>
                  <p className={cn('text-base font-black', stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-0 shrink-0 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-black whitespace-nowrap transition-all',
                tab === t.id
                  ? 'bg-surface-container-lowest text-primary border border-b-0 border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-surface-container-lowest border-t border-outline-variant/20">
          <AnimatePresence mode="wait">
            {/* ── SUMMARY TAB ── */}
            {tab === 'summary' && (
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
                {/* Mobile quick stats */}
                <div className="grid grid-cols-2 gap-3 md:hidden">
                  {[
                    { label: 'Total Visits', value: s.totalVisits, icon: History, color: 'text-primary' },
                    { label: 'Avg Score', value: `${s.avgVisitScore}/5`, icon: Star, color: 'text-amber-500' },
                    { label: 'Comm. Collected', value: formatCurrency(s.commissionCollected), icon: Wallet, color: 'text-emerald-600' },
                    { label: 'Pending', value: formatCurrency(s.commissionPending), icon: AlertCircle, color: 'text-error' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-surface-container-low rounded-2xl p-4">
                      <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
                      <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
                      <p className={cn('text-lg font-black mt-0.5', stat.color)}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Lead Funnel */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Lead Pipeline Overview
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Leads', value: s.totalLeads, bg: 'bg-primary/5', text: 'text-primary', bar: 'bg-primary' },
                      { label: 'Converted', value: s.convertedLeads, bg: 'bg-emerald-500/5', text: 'text-emerald-600', bar: 'bg-emerald-500' },
                      { label: 'Pending', value: s.pendingLeads, bg: 'bg-amber-500/5', text: 'text-amber-600', bar: 'bg-amber-500' },
                      { label: 'Lost', value: s.lostLeads, bg: 'bg-error/5', text: 'text-error', bar: 'bg-error' },
                    ].map((item) => (
                      <div key={item.label} className={cn('rounded-2xl p-4', item.bg)}>
                        <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{item.label}</p>
                        <p className={cn('text-2xl font-black mt-1', item.text)}>{item.value}</p>
                        <div className="mt-2 h-1 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full', item.bar)} style={{ width: `${(item.value / s.totalLeads) * 100}%` }} />
                        </div>
                        <p className="text-[8px] font-bold text-on-surface-variant mt-1">{Math.round((item.value / s.totalLeads) * 100)}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visit Stats */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" /> Visit Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Total Visits', value: s.totalVisits },
                      { label: 'This Month', value: s.visitsThisMonth },
                      { label: 'Last Visit', value: venue.lastVisit },
                    ].map((item) => (
                      <div key={item.label} className="bg-surface-container-low rounded-2xl px-4 py-4 border border-outline-variant/10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{item.label}</p>
                        <p className="text-xl font-black text-on-surface">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── VISITS TAB ── */}
            {tab === 'visits' && (
              <motion.div key="visits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <div className="space-y-3">
                  {audit.visitLog.map((v, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        {outcomeIcon(v.outcome)}
                        {i < audit.visitLog.length - 1 && <div className="w-px h-full min-h-[1.5rem] bg-outline-variant/20" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border', visitTypeColor[v.type] ?? 'bg-surface-container text-on-surface-variant border-outline-variant/20')}>
                            {v.type}
                          </span>
                          <span className="text-[9px] font-bold text-on-surface-variant">{v.date}</span>
                          <span className="text-[9px] font-bold text-on-surface-variant ml-auto">{v.executive}</span>
                        </div>
                        <p className="text-sm font-medium text-on-surface-variant leading-snug">{v.notes}</p>
                        <p className={cn(
                          'text-[9px] font-black uppercase tracking-widest mt-1.5',
                          v.outcome === 'Success' || v.outcome === 'Collected' || v.outcome === 'Completed' ? 'text-emerald-600' :
                          v.outcome === 'Declined' ? 'text-error' : 'text-amber-600'
                        )}>
                          {v.outcome}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── COMMISSION TAB ── */}
            {tab === 'commission' && (
              <motion.div key="commission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
                {/* Totals */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-200/30">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-1">Total Collected</p>
                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(s.commissionCollected)}</p>
                  </div>
                  <div className={cn('rounded-2xl p-5 border', s.commissionPending > 0 ? 'bg-error/5 border-error/20' : 'bg-tertiary/5 border-tertiary/20')}>
                    <p className={cn('text-[9px] font-black uppercase tracking-widest mb-1', s.commissionPending > 0 ? 'text-error' : 'text-tertiary')}>Pending</p>
                    <p className={cn('text-2xl font-black', s.commissionPending > 0 ? 'text-error' : 'text-tertiary')}>
                      {s.commissionPending > 0 ? formatCurrency(s.commissionPending) : 'Nil'}
                    </p>
                  </div>
                </div>

                {/* Monthly table */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Monthly Breakdown
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-outline-variant/15">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface-container-low">
                          <th className="text-left text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-4 py-3">Month</th>
                          <th className="text-right text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-4 py-3">Collected</th>
                          <th className="text-right text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-4 py-3">Pending</th>
                          <th className="text-center text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-4 py-3">Mode</th>
                          <th className="text-center text-[9px] font-black uppercase tracking-widest text-on-surface-variant px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {audit.commissionLog.map((row, i) => (
                          <tr key={i} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                            <td className="px-4 py-3 font-bold text-on-surface">{row.month}</td>
                            <td className="px-4 py-3 text-right font-black text-emerald-600">
                              {row.collected > 0 ? formatCurrency(row.collected) : '—'}
                            </td>
                            <td className="px-4 py-3 text-right font-black text-error">
                              {row.pending > 0 ? formatCurrency(row.pending) : '—'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-[9px] font-bold bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                                {row.mode}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={cn(
                                'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                                row.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' :
                                row.status === 'Partial' ? 'bg-amber-500/10 text-amber-600' :
                                'bg-surface-container text-on-surface-variant'
                              )}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── LEADS TAB ── */}
            {tab === 'leads' && (
              <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
                {/* Funnel visual */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Conversion Funnel
                  </h3>
                  <div className="space-y-3">
                    {[
                      { stage: 'Total Leads Captured', value: s.totalLeads, pct: 100, color: 'bg-primary' },
                      { stage: 'Converted to Booking', value: s.convertedLeads, pct: Math.round((s.convertedLeads / s.totalLeads) * 100), color: 'bg-emerald-500' },
                      { stage: 'Pending / Follow-up', value: s.pendingLeads, pct: Math.round((s.pendingLeads / s.totalLeads) * 100), color: 'bg-amber-500' },
                      { stage: 'Lost / Dropped', value: s.lostLeads, pct: Math.round((s.lostLeads / s.totalLeads) * 100), color: 'bg-error' },
                    ].map((item) => (
                      <div key={item.stage} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-on-surface-variant w-44 shrink-0 hidden sm:block">{item.stage}</span>
                        <div className="flex-1 h-7 bg-surface-container-low rounded-xl overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className={cn('h-full rounded-xl flex items-center justify-end pr-3', item.color)}
                          >
                            <span className="text-[10px] font-black text-white">{item.pct}%</span>
                          </motion.div>
                        </div>
                        <span className="text-sm font-black text-on-surface w-8 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Rate KPI */}
                <div className="bg-primary/5 rounded-2xl p-5 flex items-center gap-4 border border-primary/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Overall Conversion Rate</p>
                    <p className="text-3xl font-black text-primary">{venue.crmDetails.conversionRate}</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      {s.convertedLeads} out of {s.totalLeads} leads successfully converted to bookings.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── VenueProfile ─────────────────────────────────────────────────────────────
export function VenueProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('venue');
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
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
                      <button
                        onClick={() => setShowAuditModal(true)}
                        className="mt-4 text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0"
                      >
                        View Detailed Audit <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Audit Modal */}
      <AnimatePresence>
        {showAuditModal && (
          <AuditModal venue={venue} onClose={() => setShowAuditModal(false)} />
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-110">
        <motion.button
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (windowWidth < 768 && !isFabExpanded) {
              setIsFabExpanded(true);
            } else {
              navigate('/general-visit');
            }
          }}
          className={cn(
            "bg-primary text-white h-14 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 transition-[width,box-shadow] duration-300 ease-in-out hover:shadow-primary/60",
            windowWidth < 768 && !isFabExpanded ? "w-14" : "px-6"
          )}
        >
          <CalendarCheck className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {(isFabExpanded || windowWidth >= 768) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden whitespace-nowrap font-black text-sm tracking-wide"
              >
                Log General Visit
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
