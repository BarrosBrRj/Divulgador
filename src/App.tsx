/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { AICreatorView } from './components/AICreatorView';
import { ArtGeneratorView } from './components/ArtGeneratorView';
import { RadarView } from './components/RadarView';
import { MyAdsView } from './components/MyAdsView';
import { PlansView } from './components/PlansView';
import { StatsView } from './components/StatsView';
import { BusinessProfileView } from './components/BusinessProfileView';
import { MessagesView } from './components/MessagesView';
import { FavoritesView } from './components/FavoritesView';
import { AdminView } from './components/AdminView';

// Modals & Overlays
import { AdDetailModal } from './components/AdDetailModal';
import { CreateAdModal } from './components/CreateAdModal';
import { BoostModal } from './components/BoostModal';
import { ShareModal } from './components/ShareModal';
import { ReportModal } from './components/ReportModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

const MainAppContent: React.FC = () => {
  const { currentTab, isMobileDeviceFrame } = useApp();

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView />;
      case 'ai-creator':
        return <AICreatorView />;
      case 'art-generator':
        return <ArtGeneratorView />;
      case 'radar':
        return <RadarView />;
      case 'my-ads':
        return <MyAdsView />;
      case 'plans':
        return <PlansView />;
      case 'stats':
        return <StatsView />;
      case 'profile':
        return <BusinessProfileView />;
      case 'messages':
        return <MessagesView />;
      case 'favorites':
        return <FavoritesView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-purple-200 selection:text-purple-900">
      {/* Top Main Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {isMobileDeviceFrame ? (
          /* Mobile Device Frame Simulation Container */
          <div className="py-6 px-4 flex justify-center items-center">
            <div className="w-full max-w-[420px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative min-h-[780px] flex flex-col">
              {/* Dynamic Island / Speaker notch */}
              <div className="w-28 h-4 bg-slate-900 mx-auto rounded-b-xl mb-1 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
              <div className="flex-1 p-4 overflow-y-auto max-h-[720px] scrollbar-thin">
                {renderCurrentView()}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Fluid Responsive View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-20 md:pb-10">
            {renderCurrentView()}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Modal Dialogs */}
      <AdDetailModal />
      <CreateAdModal />
      <BoostModal />
      <ShareModal />
      <ReportModal />
      <NotificationsModal />
      <AuthModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
