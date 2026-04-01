import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  onChange?: (range: DateRange) => void;
  initialRange?: DateRange;
}

export function DateRangePicker({ onChange, initialRange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(initialRange || { 
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) 
  });
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    
    if (!range.start || (range.start && range.end)) {
      const newRange = { start: selectedDate, end: null };
      setRange(newRange);
      onChange?.(newRange);
    } else {
      if (selectedDate < range.start) {
        const newRange = { start: selectedDate, end: range.start };
        setRange(newRange);
        onChange?.(newRange);
      } else {
          const newRange = { start: range.start, end: selectedDate };
        setRange(newRange);
        onChange?.(newRange);
      }
    }
  };

  const isSelected = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (range.start && d.getTime() === range.start.getTime()) return true;
    if (range.end && d.getTime() === range.end.getTime()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!range.start || !range.end) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d > range.start && d < range.end;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const changeYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear());
    const firstDay = getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const selected = isSelected(i);
        const inRange = isInRange(i);
      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(i)}
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all",
            selected ? "bg-primary text-white shadow-lg" : 
            inRange ? "bg-primary/20 text-primary" : 
            "hover:bg-surface-container-high text-on-surface"
          )}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-surface-container-low shadow-sm rounded-lg px-4 py-2 text-sm font-semibold text-on-surface-variant cursor-pointer hover:bg-surface-container transition-all active:scale-95"
      >
        <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
        {range.start && range.end ? (
          <span>{formatDate(range.start)} - {formatDate(range.end)}</span>
        ) : (
          <span className="opacity-60 italic">Select a date</span>
        )}
        <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 p-6 min-w-[320px]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-black text-on-surface">{months[viewDate.getMonth()]}</span>
                <select 
                  value={viewDate.getFullYear()} 
                  onChange={changeYear}
                  className="bg-transparent border-none p-0 text-sm font-bold text-on-surface-variant cursor-pointer focus:ring-0"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="h-10 w-10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
              <button 
                onClick={() => { setRange({ start: null, end: null }); onChange?.({ start: null, end: null }); }}
                className="text-xs font-bold text-error hover:underline"
              >
                Clear Selection
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-primary px-4 py-2 rounded-lg text-white text-xs font-black shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
