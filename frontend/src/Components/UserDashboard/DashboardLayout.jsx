import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardHome from './DashboardHome';

const DashboardLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <DashboardHeader />
    <main className="flex-grow p-6 overflow-y-auto"><DashboardHome /></main>
  </div>
);

export default DashboardLayout;
