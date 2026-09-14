import React from "react";
import { MetricsGrid } from '../components/MetricsGrid';
import { QuickActions } from '../components/QuickActions';
import { ActivityFeed } from '../components/ActivityFeed';

export const Dashboard:React.FC = () => {
    return(
        <div>
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight text-white">Cluster Overview</h1>
				<p className="text-sm text-slate-400 mt-1">Monitor real-time metrics, node statuses, and system activity.</p>
			</div>
        	<MetricsGrid />
            <QuickActions />
            <ActivityFeed />
        </div>
    )
}