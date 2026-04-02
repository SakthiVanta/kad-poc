import React, { useState, useEffect, useRef } from 'react';
import {
  Map as MapIcon, Plus, Upload, Search, X, Check, ChevronRight, Building2,
  Users, CheckCircle2, Clock, XCircle, ShieldCheck, ShieldOff,
  Edit2, Trash2, MoreVertical, MapPin, Download, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockBeats, mockKAEs, type Beat, type Mandapam } from '../../data/kamMockData';

type BeatStatus = 'active' | 'inactive';

const statusIcon = (s: Mandapam['status']) => {
  if (s === 'active')   return <CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
  if (s === 'pending')  return <Clock        className="w-3.5 h-3.5 text-amber-500" />;
  return                       <XCircle      className="w-3.5 h-3.5 text-error" />;
};

const statusLabel: Record<Mandapam['status'], string> = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};

export function BeatManagement() {
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [beats, setBeats]           = useState<Beat[]>(mockBeats);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch]         = useState('');

  // Auto-scroll on mobile when selectedId changes
  useEffect(() => {
    if (selectedId && window.innerWidth < 1024) {
      const element = rowRefs.current.get(selectedId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      }
    }
  }, [selectedId]);

  const [filter, setFilter]         = useState<'all' | BeatStatus>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showBulk, setShowBulk]     = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddMandapam, setShowAddMandapam] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showRemoveMandapamConfirm, setShowRemoveMandapamConfirm] = useState<{ beatId: string, mandapId: number } | null>(null);
  const [toast, setToast]           = useState<string | null>(null);

  // New beat form
  const [newBeat, setNewBeat] = useState({ name: '', area: '', city: 'Chennai' });

  const showToastMsg = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const selected = beats.find((b) => b.id === selectedId) ?? null;

  const filtered = beats.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: beats.length,
    active: beats.filter((b) => b.status === 'active').length,
    unassigned: beats.filter((b) => b.assignedKAEId === null).length,
    totalMandapams: beats.reduce((s, b) => s + b.mandapams.length, 0),
  };

  // Assign KAE to beat
  const assignKAE = (beatId: string, kaeId: number | null) => {
    setBeats((prev) => prev.map((b) => b.id === beatId ? { ...b, assignedKAEId: kaeId } : b));
    showToastMsg(kaeId ? 'KAE assigned successfully' : 'KAE unassigned');
  };

  // Toggle beat status
  const toggleBeatStatus = (beatId: string) => {
    setBeats((prev) => prev.map((b) => b.id === beatId ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
    showToastMsg('Beat status updated');
  };

  // Delete beat
  const deleteBeat = (beatId: string) => {
    setBeats((prev) => prev.filter((b) => b.id !== beatId));
    if (selectedId === beatId) {
      setSelectedId(beats.find(b => b.id !== beatId)?.id ?? null);
    }
    setShowDeleteConfirm(null);
    showToastMsg('Beat deleted successfully');
  };

  // Edit beat
  const updateBeat = () => {
    if (!newBeat.name.trim()) return;
    setBeats((prev) => prev.map((b) => b.id === selectedId ? { ...b, name: newBeat.name, area: newBeat.area, city: newBeat.city } : b));
    setShowEdit(false);
    showToastMsg('Beat updated successfully');
  };

  // Remove mandapam from beat
  const removeMandapam = () => {
    if (!showRemoveMandapamConfirm) return;
    const { beatId, mandapId } = showRemoveMandapamConfirm;
    setBeats((prev) => prev.map((b) => b.id === beatId ? { ...b, mandapams: b.mandapams.filter((m) => m.id !== mandapId) } : b));
    setShowRemoveMandapamConfirm(null);
    showToastMsg('Mandapam removed from beat');
  };

  // Add mandapam to beat
  const addMandapam = (mandapam: Mandapam) => {
    if (!selectedId) return;
    setBeats((prev) => prev.map((b) => b.id === selectedId ? { ...b, mandapams: [...b.mandapams, mandapam] } : b));
    setShowAddMandapam(false);
    showToastMsg('Mandapam added to beat');
  };

  // Download Template
  const downloadTemplate = () => {
    const headers = ['Beat Name', 'Area', 'City', 'KAE Emp ID (Optional)'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "beat_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg('Template downloaded');
  };

  // Mock Bulk Upload
  const handleBulkUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newBeats: Beat[] = [
        { id: 'B101', code: 'C101-CHE', name: 'Velachery West', area: 'Velachery', city: 'Chennai', mandapams: [], assignedKAEId: null, status: 'active' },
        { id: 'B102', code: 'C102-CHE', name: 'Saidapet East', area: 'Saidapet', city: 'Chennai', mandapams: [], assignedKAEId: null, status: 'active' },
      ];
      setBeats(prev => [...prev, ...newBeats]);
      setIsUploading(false);
      setShowBulk(false);
      showToastMsg('2 beats uploaded successfully');
    }, 1500);
  };

  // Create new beat
  const createBeat = () => {
    if (!newBeat.name.trim()) return;
    const maxCode = beats.length + 1;
    const prefix  = newBeat.city.slice(0, 3).toUpperCase();
    const beat: Beat = {
      id: `B${String(maxCode).padStart(3, '0')}`,
      code: `C${maxCode}-${prefix}`,
      name: newBeat.name,
      area: newBeat.area || newBeat.name,
      city: newBeat.city,
      mandapams: [],
      assignedKAEId: null,
      status: 'active',
    };
    setBeats((prev) => [...prev, beat]);
    setNewBeat({ name: '', area: '', city: 'Chennai' });
    setShowCreate(false);
    setSelectedId(beat.id);
    showToastMsg('Beat created successfully');
  };

  const assignedKAEName = (id: number | null) =>
    id ? (mockKAEs.find((k) => k.id === id)?.name ?? '—') : 'Unassigned';

  const renderBeatDetail = (selected: Beat) => (
    <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">
      {/* Detail Header */}
      <div className="px-4 sm:px-6 py-5 border-b border-outline-variant/10 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black font-mono bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant">{selected.code}</span>
              <span className={cn('text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full',
                selected.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error')}>
                {selected.status}
              </span>
            </div>
            <h2 className="text-xl font-black text-on-surface">{selected.name}</h2>
            <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-primary" /> {selected.area}, {selected.city}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewBeat({ name: selected.name, area: selected.area, city: selected.city });
                setShowEdit(true);
              }}
              className="p-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
              title="Edit Beat"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(selected.id);
              }}
              className="p-2.5 rounded-xl border border-outline-variant/30 text-error hover:bg-error/5 transition-colors"
              title="Delete Beat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={(e) => {
              e.stopPropagation();
              toggleBeatStatus(selected.id);
            }}
              className="text-[10px] font-black uppercase tracking-wide px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0">
              {selected.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 space-y-6 lg:overflow-y-auto min-h-0 lg:scrollbar-thin lg:scrollbar-thumb-primary/40 lg:hover:scrollbar-thumb-primary/60">
        {/* KAE Assignment */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" /> KAE Assignment
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <select
                value={selected.assignedKAEId ?? ''}
                onChange={(e) => assignKAE(selected.id, e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-bold outline-none focus:border-primary transition-colors appearance-none pr-8"
              >
                <option value="">— Unassigned —</option>
                {mockKAEs.filter((k) => k.status === 'active').map((kae) => (
                  <option key={kae.id} value={kae.id}>
                    {kae.name} ({kae.empId}) — {kae.beatsAssigned} beats
                  </option>
                ))}
              </select>
            </div>
            {selected.assignedKAEId && (
              <div className="bg-primary/5 border border-primary/20 px-4 py-3 rounded-xl shrink-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Assigned</p>
                <p className="text-sm font-black text-on-surface">{assignedKAEName(selected.assignedKAEId)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Beat Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: selected.mandapams.length, color: 'text-on-surface' },
            { label: 'Active', value: selected.mandapams.filter((m) => m.status === 'active').length, color: 'text-primary' },
            { label: 'BWG', value: selected.mandapams.filter((m) => m.bwgPromise).length, color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-low rounded-2xl p-3 sm:p-4 border border-outline-variant/8 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">{stat.label}</p>
              <p className={cn('text-xl sm:text-2xl font-black', stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Mandapams Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-primary" /> Mandapams in this Beat
            </h3>
            <button
              onClick={() => setShowAddMandapam(true)}
              className="text-[10px] font-black uppercase tracking-wide text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          {selected.mandapams.length === 0 ? (
            <div className="border-2 border-dashed border-outline-variant/20 rounded-2xl py-10 text-center">
              <Building2 className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-3" />
              <p className="text-sm font-bold text-on-surface-variant/40">No mandapams in this beat</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selected.mandapams.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 sm:p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/8 hover:border-outline-variant/20 transition-colors group">
                  {statusIcon(m.status as any)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{m.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn(
                        'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border transition-all',
                        m.status === 'active'
                          ? "bg-primary/5 text-primary border-primary/20"
                          : m.status === 'pending'
                            ? "bg-amber-500/5 text-amber-600 border-amber-500/20"
                            : "bg-error/5 text-error border-error/20"
                      )}>
                        {statusLabel[m.status]}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRemoveMandapamConfirm({ beatId: selected.id, mandapId: m.id })}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error/10 transition-colors sm:opacity-0 group-hover:opacity-100"
                    title="Remove from beat"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen bg-surface flex flex-col lg:overflow-hidden">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary text-white shadow-2xl text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-outline-variant/10 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-on-surface">Beat Management</h1>
            <p className="text-sm text-on-surface-variant font-medium mt-0.5">
              Manage geographic beats and assign field executives
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBulk(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low text-xs font-black uppercase tracking-wide transition-all">
              <Upload className="w-4 h-4" /> Bulk Upload
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wide shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Add Beat
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 md:px-10 py-4 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Beats',    value: stats.total,          color: 'text-on-surface',  bg: 'bg-surface-container-low' },
            { label: 'Active',         value: stats.active,         color: 'text-primary',    bg: 'bg-primary/5' },
            { label: 'Unassigned',     value: stats.unassigned,     color: 'text-amber-600',   bg: 'bg-amber-500/5' },
            { label: 'Total Mandapams',value: stats.totalMandapams, color: 'text-primary',     bg: 'bg-primary/5' },
          ].map((s) => (
            <div key={s.label} className={cn('rounded-2xl p-4 border border-outline-variant/10', s.bg)}>
              <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{s.label}</p>
              <p className={cn('text-2xl font-black', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 lg:overflow-hidden px-6 md:px-10 pb-8 min-h-0">

        {/* ── LEFT: Beat List ── */}
        <div className="lg:w-80 xl:w-96 lg:flex-none flex flex-col border border-outline-variant/10 rounded-3xl lg:overflow-hidden bg-surface-container-lowest shadow-sm lg:mr-5 mb-5 lg:mb-0 lg:min-h-0">
          {/* Search */}
          <div className="p-3 border-b border-outline-variant/10 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search beats..."
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low rounded-xl text-sm font-medium outline-none"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'active', 'inactive'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn('flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                    filter === f ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low')}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container with Overflow Control */}
          <div className="lg:flex-1 lg:overflow-y-auto overflow-x-auto border-t-4 border-t-primary/80 relative scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
              {/* Table Header (Top of List) */}
            <div className="min-w-[700px] grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-4 py-4 bg-primary/5 border-b border-outline-variant/10 sticky top-0 z-10">
              {['Beat', 'Location', 'KAE', 'Stats', ''].map((h, i) => (
                <p key={i} className={cn(
                    "text-[10px] font-black uppercase tracking-widest text-primary/80 transition-all",
                    i === 0 ? "text-left pl-12 sm:pl-14" : (i === 4 ? "w-6" : "text-center")
                  )}>{h}</p>
                ))}
              </div>

              {/* Beat Rows */}
            <div className="divide-y divide-outline-variant/8 bg-surface-container-lowest">
                {filtered.length > 0 ? filtered.map((beat) => {
                  const isActive = beat.id === selectedId;
                  const kae      = mockKAEs.find((k) => k.empId === beat.assignedKAEId);
                  return (
                    <div
                      key={beat.id}
                      ref={(el) => { if (el) rowRefs.current.set(beat.id, el); }}
                      className="flex flex-col border-b border-outline-variant/8"
                    >
                      <button
                        onClick={() => setSelectedId(selectedId === beat.id ? null : beat.id)}
                        className={cn(
                          'min-w-[700px] grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 transition-all hover:bg-surface-container-low/80',
                          isActive ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'
                        )}
                      >
                        {/* Beat Details */}
                        <div className="min-w-0 text-left pl-2">
                          <p className="text-sm font-black text-on-surface truncate">{beat.name}</p>
                          <span className="text-[9px] font-mono font-bold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">{beat.code}</span>
                        </div>

                        {/* Area/City */}
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-on-surface-variant truncate">{beat.area}</p>
                          <p className="text-[10px] text-on-surface-variant/60 truncate">{beat.city}</p>
                        </div>

                        {/* KAE */}
                        <div className="flex justify-center">
                          {kae ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10">
                              <span className="text-[10px] font-bold text-primary truncate max-w-[80px]">{kae.name.split(' ')[0]}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-500/20">Unassigned</span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <p className="text-xs font-black text-primary">{beat.mandapams.length}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40">Venues</p>
                        </div>

                        {/* Chevron (Mobile Indicator) */}
                        <div className="w-6 flex items-center justify-center">
                          <ChevronRight className={cn(
                            "w-4 h-4 text-on-surface-variant/30 transition-transform duration-300",
                            isActive && "rotate-90 text-primary"
                          )} />
                        </div>
                      </button>

                      {/* Accordion Content (Mobile Only) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden lg:hidden"
                          >
                            <div className="p-4 bg-surface-container-low/50 sticky left-0 w-[calc(100vw-32px)] sm:w-full">
                              {renderBeatDetail(beat)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }) : (
                  <div className="p-12 text-center">
                    <AlertCircle className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-sm font-bold text-on-surface-variant/40">No beats found</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Beat Detail (Desktop Only) ── */}
        <div className="hidden lg:flex flex-1 flex-col border border-outline-variant/10 rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm">
          {selected ? renderBeatDetail(selected) : (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="max-w-xs text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                  <MapIcon className="w-10 h-10 text-primary/40 relative z-10" />
                </div>
                <h3 className="text-lg font-black text-on-surface mb-2">Beat Insights</h3>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  Select a beat from the list on the left to view detailed statistics, assigned KAEs, and associated mandapams.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Beat Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowCreate(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Create New Beat</h2>
                  <button onClick={() => setShowCreate(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label htmlFor="beat-name" className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Beat Name <span className="text-error">*</span></label>
                    <input
                      id="beat-name"
                      value={newBeat.name}
                      onChange={(e) => setNewBeat((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Adyar"
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="beat-area" className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Area / Locality</label>
                    <input
                      id="beat-area"
                      value={newBeat.area}
                      onChange={(e) => setNewBeat((f) => ({ ...f, area: e.target.value }))}
                      placeholder="e.g. Adyar, South Chennai"
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="beat-city" className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">City</label>
                    <select
                      id="beat-city"
                      value={newBeat.city}
                      onChange={(e) => setNewBeat((f) => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    >
                      {['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore', 'Madurai'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 text-[10px] text-on-surface-variant">
                    Beat code will be auto-generated. Mandapams can be added after creation.
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low">Cancel</button>
                  <button onClick={createBeat} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2" title="Create Beat Confirmation">
                    <Check className="w-4 h-4" /> Create Beat
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Edit Beat Modal ── */}
      <AnimatePresence>
        {showEdit && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowEdit(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Edit Beat</h2>
                  <button onClick={() => setShowEdit(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label htmlFor="edit-beat-name" className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Beat Name <span className="text-error">*</span></label>
                    <input
                      id="edit-beat-name"
                      value={newBeat.name}
                      onChange={(e) => setNewBeat((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Adyar"
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-beat-area" className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Area / Locality</label>
                    <input
                      id="edit-beat-area"
                      value={newBeat.area}
                      onChange={(e) => setNewBeat((f) => ({ ...f, area: e.target.value }))}
                      placeholder="e.g. Adyar, South Chennai"
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-beat-city" className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">City</label>
                    <select
                      id="edit-beat-city"
                      value={newBeat.city}
                      onChange={(e) => setNewBeat((f) => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    >
                      {['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore', 'Madurai'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowEdit(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low">Cancel</button>
                  <button onClick={updateBeat} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowDeleteConfirm(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-on-surface mb-2">Delete Beat?</h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    This action will permanently delete <span className="font-bold text-on-surface">{beats.find(b => b.id === showDeleteConfirm)?.name}</span> and all associated data. This cannot be undone.
                  </p>
                </div>
                <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant bg-surface hover:bg-surface-container-high">Cancel</button>
                  <button onClick={() => deleteBeat(showDeleteConfirm)} className="flex-1 py-3 rounded-xl bg-error text-red-600 text-sm font-bold shadow-md shadow-error/20 active:scale-95 transition-all">Yes, Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add Mandapam Modal ── */}
      <AnimatePresence>
        {showAddMandapam && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowAddMandapam(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Add Mandapam to Beat</h2>
                  <button onClick={() => setShowAddMandapam(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                  {[
                    { id: 9001, name: 'Grand Imperial Hall', status: 'active', bwgPromise: true },
                    { id: 9002, name: 'Royal Palace Grounds', status: 'active', bwgPromise: false },
                    { id: 9003, name: 'Crystal Ballroom', status: 'pending', bwgPromise: true },
                    { id: 9004, name: 'Ocean View Resort', status: 'active', bwgPromise: true },
                    { id: 9005, name: 'Heritage Residency', status: 'active', bwgPromise: false },
                  ].map((m) => {
                    const alreadyIn = selected?.mandapams.some(existing => existing.id === m.id);
                    return (
                      <div key={m.id} className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        alreadyIn ? "bg-surface-container-low border-outline-variant/10 opacity-50" : "bg-surface border-outline-variant/20 hover:border-primary/30"
                      )}>
                        <div className="flex items-center gap-3">
                          {statusIcon(m.status as any)}
                          <div>
                            <p className="text-sm font-bold text-on-surface">{m.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{m.id}</p>
                          </div>
                        </div>
                        {alreadyIn ? (
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Already in Beat</span>
                        ) : (
                          <button
                            onClick={() => addMandapam(m as any)}
                            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Remove Mandapam Confirmation ── */}
      <AnimatePresence>
        {showRemoveMandapamConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowRemoveMandapamConfirm(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-on-surface mb-2">Remove Mandapam?</h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Are you sure you want to remove <span className="font-bold text-on-surface">
                      {selected?.mandapams.find(m => m.id === showRemoveMandapamConfirm.mandapId)?.name}
                    </span> from this beat?
                  </p>
                </div>
                <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowRemoveMandapamConfirm(null)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant bg-surface hover:bg-surface-container-high">Cancel</button>
                  <button onClick={removeMandapam} className="flex-1 py-3 rounded-xl bg-error text-white text-sm font-bold shadow-md shadow-error/20 active:scale-95 transition-all">Remove</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bulk Upload Modal ── */}
      <AnimatePresence>
        {showBulk && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowBulk(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Bulk Upload Beats</h2>
                  <button onClick={() => setShowBulk(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Download Template</p>
                      <p className="text-xs text-on-surface-variant">Beat name, Area, City, KAE Emp ID (optional)</p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-xs font-black text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <Download className="w-4 h-4" /> .csv
                    </button>
                  </div>
                  <div
                    onClick={() => document.getElementById('bulk-file')?.click()}
                    className="w-full border-2 border-dashed border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors group cursor-pointer relative overflow-hidden"
                  >
                    <input type="file" id="bulk-file" className="hidden" accept=".csv,.xlsx" onChange={handleBulkUpload} />
                    {isUploading ? (
                      <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Processing...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-bold text-on-surface-variant">Click to upload Excel / CSV</p>
                        <p className="text-xs text-on-surface-variant/50 text-center px-4">Each row = one beat. Mandapams can be added after upload.</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowBulk(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low" disabled={isUploading}>Cancel</button>
                  <button
                    onClick={handleBulkUpload}
                    disabled={isUploading}
                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Upload & Preview'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
