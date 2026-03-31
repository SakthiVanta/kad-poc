/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { BeatPlanning } from './components/BeatPlanning';
import { P1Visit } from './components/P1Visit';
import { GeneralVisit } from './components/GeneralVisit';
import { Commission } from './components/Commission';
import { BWGUpgradation } from './components/BWGUpgradation';
import { LeadCapture } from './components/LeadCapture';
import { Settings } from './components/Settings';
import { BeatMap } from './components/BeatMap';
import { NewListing } from './components/NewListing';
import { BlockDate } from './components/BlockDate';

export default function App() {
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-surface w-full overflow-x-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
            <TopBar onOpenMap={() => setIsMapOpen(true)} onOpenSidebar={() => setIsSidebarOpen(true)} />
            <main className="flex-1 p-4 md:p-8 min-w-0 w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/new-listing" element={<NewListing />} />
                <Route path="/block-date" element={<BlockDate />} />
                <Route path="/beats" element={<BeatPlanning />} />
                <Route path="/p1-visit" element={<P1Visit />} />
                <Route path="/general-visit" element={<GeneralVisit />} />
                <Route path="/commission" element={<Commission />} />
                <Route path="/bwg" element={<BWGUpgradation />} />
                <Route path="/lead-capture" element={<LeadCapture />} />
                <Route path="/settings" element={<Settings onOpenMap={() => setIsMapOpen(true)} />} />
                <Route path="*" element={<Overview />} />
              </Routes>
            </main>
            
            <footer className="px-10 py-6 border-t border-outline-variant/10 text-center">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                © 2026 KAD CRM • Field Intelligence & Logistics System
              </p>
            </footer>
          </div>
        </div>
        <BeatMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      </Router>
    </ThemeProvider>
  );
}

