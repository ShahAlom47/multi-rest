import OverviewContent from '@/components/DashOverView/OverviewContent';
import TrafficAnalytics from '@/components/DashOverView/TrafficAnalytics';
import DashPageTitle from '@/components/DashPageTitle';
import React from 'react';

const DashboardHome = () => {
    return (
        <div className=' space-y-3 max-w  w-full'>
            <DashPageTitle>Overview</DashPageTitle>
           <OverviewContent></OverviewContent>
           <TrafficAnalytics></TrafficAnalytics>
        </div>
    );
};

export default DashboardHome;