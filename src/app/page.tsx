/**
 * NetworkOS - AI-First GTM Platform
 * Apple-inspired Dark Mode Design
 */

'use client';

import * as React from 'react';
import {
  Building2,
  Users,
  Sparkles,
  LayoutDashboard,
  Target,
  Mail,
  BarChart3,
  Settings,
  Search,
  Plus,
  Menu,
  TrendingUp,
  Zap,
  Globe,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
  UserSearch,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDashboardMetrics } from '@/hooks/useApi';

// Import view components
import { CompaniesView } from '@/components/companies-view';
import { ContactsView } from '@/components/contacts-view';
import { PitchesView } from '@/components/pitches-view';
import { ContactFinderView } from '@/components/contact-finder-view';
import { PipelineView } from '@/components/pipeline-view';

// Navigation items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'contact-finder', label: 'Find Contacts', icon: UserSearch },
  { id: 'pipeline', label: 'Pipeline', icon: Target },
  { id: 'pitches', label: 'Pitches', icon: Sparkles },
  { id: 'outreach', label: 'Outreach', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = React.useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [currentTime]);

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar transition-all duration-300',
          sidebarOpen ? 'w-72' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.08]">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-white">NetworkOS</span>
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                  GTM
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="h-4 w-4 text-white/60" />
          </button>
        </div>

        {/* Greeting Card */}
        {sidebarOpen && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08]">
            <p className="text-white/60 text-sm">{greeting}</p>
            <p className="text-white font-medium mt-0.5">Welcome back!</p>
            <p className="text-white/40 text-xs mt-2 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'nav-item w-full',
                activeTab === item.id && 'active',
                !sidebarOpen && 'justify-center px-3'
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Settings */}
        <div className="px-3 py-4 border-t border-white/[0.08]">
          <button
            className={cn(
              'nav-item w-full',
              !sidebarOpen && 'justify-center px-3'
            )}
          >
            <Settings className="h-[18px] w-[18px]" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-black">
        {/* Header */}
        <header className="app-header">
          <div>
            <h1 className="text-xl font-semibold text-white capitalize">
              {activeTab === 'contact-finder' ? 'Find Contacts' : activeTab}
            </h1>
            <p className="text-sm text-white/50">AI-First GTM Platform</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search companies, contacts..."
                className="search-input w-72"
              />
            </div>

            {/* Quick Actions */}
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'companies' && <CompaniesView />}
          {activeTab === 'contacts' && <ContactsView />}
          {activeTab === 'contact-finder' && <ContactFinderView />}
          {activeTab === 'pipeline' && <PipelineView />}
          {activeTab === 'pitches' && <PitchesView />}
          {activeTab === 'outreach' && <PlaceholderView title="Outreach" description="Manage outreach sequences and campaigns" />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </div>
      </main>
    </div>
  );
}

// Dashboard View with real API integration
function DashboardView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { data: metrics, loading, error, fetch, reset } = useDashboardMetrics();
  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          title="Total Companies"
          value={metrics?.totalCompanies?.toString() || '127'}
          change="+12%"
          positive
          loading={loading}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-green-500/20"
          iconColor="text-green-400"
          title="Active Contacts"
          value={metrics?.totalContacts?.toString() || '438'}
          change="+8%"
          positive
          loading={loading}
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
          title="Pipeline Value"
          value={metrics?.pipelineValue ? `$${(metrics.pipelineValue / 1000000).toFixed(1)}M` : '$2.4M'}
          change="+23%"
          positive
          loading={loading}
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          iconBg="bg-orange-500/20"
          iconColor="text-orange-400"
          title="Avg AI Score"
          value={metrics?.averageAIScore?.toString() || '72'}
          change="+5%"
          positive
          loading={loading}
        />
      </div>

      {/* Urgent Actions */}
      {metrics?.urgentActions && metrics.urgentActions.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Urgent Actions</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
              {metrics.urgentActions.length} items
            </span>
          </div>
          <div className="space-y-2">
            {metrics.urgentActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  action.priority === 'high' ? 'bg-red-400' :
                  action.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                )} />
                <span className="text-sm text-white/80 flex-1">{action.message}</span>
                <ChevronRight className="h-4 w-4 text-white/40" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          icon={<Search className="h-6 w-6" />}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          title="Research Company"
          description="Deep AI-powered company analysis"
          onClick={() => onNavigate('companies')}
        />
        <ActionCard
          icon={<Sparkles className="h-6 w-6" />}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
          title="Generate Pitch"
          description="AI-crafted personalized outreach"
          onClick={() => onNavigate('pitches')}
        />
        <ActionCard
          icon={<Users className="h-6 w-6" />}
          iconBg="bg-green-500/20"
          iconColor="text-green-400"
          title="Find Contacts"
          description="Discover decision makers"
          onClick={() => onNavigate('contact-finder')}
        />
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <p className="text-sm text-white/50">Latest actions and updates</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { reset(); fetch(); }}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
          </div>
        ) : metrics?.recentActivity && metrics.recentActivity.length > 0 ? (
          <div className="space-y-1">
            {metrics.recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={
                  activity.type === 'company' ? <Building2 className="h-4 w-4" /> :
                  activity.type === 'pitch' ? <Sparkles className="h-4 w-4" /> :
                  activity.type === 'contact' ? <Users className="h-4 w-4" /> :
                  <Target className="h-4 w-4" />
                }
                iconBg={
                  activity.type === 'company' ? 'bg-blue-500/20' :
                  activity.type === 'pitch' ? 'bg-purple-500/20' :
                  activity.type === 'contact' ? 'bg-green-500/20' :
                  'bg-orange-500/20'
                }
                title={activity.description}
                time={activity.timestamp}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <ActivityItem
              icon={<Building2 className="h-4 w-4" />}
              iconBg="bg-blue-500/20"
              title="New company added: Acme Corp"
              time="2 minutes ago"
            />
            <ActivityItem
              icon={<Sparkles className="h-4 w-4" />}
              iconBg="bg-purple-500/20"
              title="Pitch generated for TechStart Inc"
              time="15 minutes ago"
            />
            <ActivityItem
              icon={<Users className="h-4 w-4" />}
              iconBg="bg-green-500/20"
              title="3 contacts found at DataFlow"
              time="1 hour ago"
            />
            <ActivityItem
              icon={<Target className="h-4 w-4" />}
              iconBg="bg-orange-500/20"
              title="Opportunity moved to 'Demo Done'"
              time="2 hours ago"
            />
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="glass-card p-6 glow">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            <p className="text-sm text-white/50 mt-1">
              Based on your pipeline analysis, we recommend focusing on the 3 high-score leads
              that haven&apos;t been contacted in the last week. The best time to reach out is
              Tuesday morning between 9-11 AM.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="btn-primary text-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Action Plan
              </button>
              <button
                onClick={() => onNavigate('pipeline')}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                View Pipeline →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics View
function AnalyticsView() {
  const { data: metrics, loading, error, fetch } = useDashboardMetrics();
  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="glass-card p-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/70">Failed to load analytics</p>
          <button onClick={fetch} className="btn-primary mt-4">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-400"
          title="Total Companies"
          value={metrics?.totalCompanies?.toString() || '0'}
          change="+12%"
          positive
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-green-500/20"
          iconColor="text-green-400"
          title="Total Contacts"
          value={metrics?.totalContacts?.toString() || '0'}
          change="+8%"
          positive
        />
        <StatCard
          icon={<Mail className="h-5 w-5" />}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
          title="Active Sequences"
          value={metrics?.activeSequences?.toString() || '0'}
          change="+15%"
          positive
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          iconBg="bg-orange-500/20"
          iconColor="text-orange-400"
          title="Avg AI Score"
          value={metrics?.averageAIScore?.toString() || '0'}
          change="+5%"
          positive
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pipeline by Stage</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-white/20 rounded-xl">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-white/30 mx-auto mb-2" />
              <p className="text-white/40 text-sm">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Activity Over Time</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-white/20 rounded-xl">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-white/30 mx-auto mb-2" />
              <p className="text-white/40 text-sm">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Data</h3>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            Download CSV (Day)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            Download CSV (Week)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            Download CSV (Month)
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  change,
  positive,
  loading,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  change: string;
  positive: boolean;
  loading?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className={cn('stat-icon', iconBg, iconColor)}>{icon}</div>
      <p className="text-sm text-white/50">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        {loading ? (
          <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
        ) : (
          <>
            <span className="stat-value text-white">{value}</span>
            <span className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded-full',
              positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              {change}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Action Card Component
function ActionCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="action-card glow cursor-pointer"
    >
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl mb-4', iconBg, iconColor)}>
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/50 mt-1">{description}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  icon,
  iconBg,
  title,
  time,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
}) {
  return (
    <div className="activity-item">
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white/70', iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/90 truncate">{title}</p>
        <p className="text-xs text-white/40">{time}</p>
      </div>
    </div>
  );
}

// Placeholder View Component
function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg mx-auto mb-4">
        <Globe className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-white/50 mt-2 max-w-md mx-auto">{description}</p>
      <p className="text-white/30 text-sm mt-4">Coming soon...</p>
    </div>
  );
}
