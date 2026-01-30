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
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ZoomControls } from '@/components/zoom-controls';

// Import view components
import { CompaniesView } from '@/components/companies-view';
import { ContactsView } from '@/components/contacts-view';
import { PitchesView } from '@/components/pitches-view';
import { ContactFinderView } from '@/components/contact-finder-view';
import { PipelineView } from '@/components/pipeline-view';

// Saudacoes inteligentes por horario e locale
const getGreeting = (hour: number, locale: string = 'pt-BR'): string => {
  const greetings: Record<string, Record<string, string>> = {
    'pt-BR': {
      morning: 'Bom dia',
      afternoon: 'Boa tarde',
      evening: 'Boa noite',
      night: 'Boa madrugada'
    },
    'en': {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night'
    },
    'es': {
      morning: 'Buenos días',
      afternoon: 'Buenas tardes',
      evening: 'Buenas noches',
      night: 'Buenas madrugadas'
    }
  };

  const lang = greetings[locale] || greetings['pt-BR'];

  if (hour >= 0 && hour < 6) return lang.night;
  if (hour >= 6 && hour < 12) return lang.morning;
  if (hour >= 12 && hour < 18) return lang.afternoon;
  return lang.evening;
};

// Data formatada por locale
const getFormattedDate = (date: Date, locale: string = 'pt-BR'): string => {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Hora com fuso horario
const getFormattedTime = (date: Date, locale: string = 'pt-BR'): string => {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

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
  const { locale, t } = useLanguage();

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = React.useMemo(() => {
    return getGreeting(currentTime.getHours(), locale);
  }, [currentTime, locale]);

  const formattedDate = React.useMemo(() => {
    return getFormattedDate(currentTime, locale);
  }, [currentTime, locale]);

  const formattedTime = React.useMemo(() => {
    return getFormattedTime(currentTime, locale);
  }, [currentTime, locale]);

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar transition-all duration-300',
          sidebarOpen ? 'w-72' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>NetworkOS</span>
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--fill-tertiary)', color: 'var(--text-secondary)' }}>
                  GTM
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Greeting Card */}
        {sidebarOpen && (
          <div className="mx-4 mt-4 p-4 rounded-2xl" style={{ background: 'var(--fill-tertiary)', border: '1px solid var(--border-color)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{greeting}</p>
            <p className="font-medium mt-0.5" style={{ color: 'var(--text)' }}>{t('sidebar.hello')} Danillo!</p>
            <p className="text-xs mt-2 capitalize" style={{ color: 'var(--text-secondary)' }}>{formattedDate}</p>
            <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
              <Clock className="h-3 w-3" />
              {formattedTime}
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
        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
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
      <main className="flex-1 overflow-auto" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <header className="app-header">
          <div>
            <h1 className="text-xl font-semibold capitalize" style={{ color: 'var(--text)' }}>
              {activeTab === 'contact-finder' ? 'Find Contacts' : activeTab}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>AI-First GTM Platform</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search companies, contacts..."
                className="search-input w-full md:w-72"
              />
            </div>

            {/* Zoom Controls */}
            <ZoomControls />

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Language Switcher */}
            <LanguageSwitcher />

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          iconBg="icon-bg-blue"
          iconColor="icon-color-blue"
          title="Total Companies"
          value={metrics?.totalCompanies?.toString() || '127'}
          change="+12%"
          positive
          loading={loading}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          iconBg="icon-bg-green"
          iconColor="icon-color-green"
          title="Active Contacts"
          value={metrics?.totalContacts?.toString() || '438'}
          change="+8%"
          positive
          loading={loading}
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          iconBg="icon-bg-purple"
          iconColor="icon-color-purple"
          title="Pipeline Value"
          value={metrics?.pipelineValue ? `$${(metrics.pipelineValue / 1000000).toFixed(1)}M` : '$2.4M'}
          change="+23%"
          positive
          loading={loading}
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          iconBg="icon-bg-orange"
          iconColor="icon-color-orange"
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
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Urgent Actions</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
              {metrics.urgentActions.length} items
            </span>
          </div>
          <div className="space-y-2">
            {metrics.urgentActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                style={{ background: 'var(--fill-tertiary)' }}
              >
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  action.priority === 'high' ? 'bg-red-400' :
                  action.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                )} />
                <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{action.message}</span>
                <ChevronRight className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <ActionCard
          icon={<Search className="h-6 w-6" />}
          iconBg="icon-bg-blue"
          iconColor="icon-color-blue"
          title="Research Company"
          description="Deep AI-powered company analysis"
          onClick={() => onNavigate('companies')}
        />
        <ActionCard
          icon={<Sparkles className="h-6 w-6" />}
          iconBg="icon-bg-purple"
          iconColor="icon-color-purple"
          title="Generate Pitch"
          description="AI-crafted personalized outreach"
          onClick={() => onNavigate('pitches')}
        />
        <ActionCard
          icon={<Users className="h-6 w-6" />}
          iconBg="icon-bg-green"
          iconColor="icon-color-green"
          title="Find Contacts"
          description="Discover decision makers"
          onClick={() => onNavigate('contact-finder')}
        />
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Recent Activity</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Latest actions and updates</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { reset(); fetch(); }}
              disabled={loading}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
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
            <Loader2 className="h-6 w-6 icon-color-purple animate-spin" />
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
                  activity.type === 'company' ? 'icon-bg-blue' :
                  activity.type === 'pitch' ? 'icon-bg-purple' :
                  activity.type === 'contact' ? 'icon-bg-green' :
                  'icon-bg-orange'
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
              iconBg="icon-bg-blue"
              title="New company added: Acme Corp"
              time="2 minutes ago"
            />
            <ActivityItem
              icon={<Sparkles className="h-4 w-4" />}
              iconBg="icon-bg-purple"
              title="Pitch generated for TechStart Inc"
              time="15 minutes ago"
            />
            <ActivityItem
              icon={<Users className="h-4 w-4" />}
              iconBg="icon-bg-green"
              title="3 contacts found at DataFlow"
              time="1 hour ago"
            />
            <ActivityItem
              icon={<Target className="h-4 w-4" />}
              iconBg="icon-bg-orange"
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
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>AI Insights</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
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
                className="text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p style={{ color: 'var(--text-secondary)' }}>Failed to load analytics</p>
          <button onClick={fetch} className="btn-primary mt-4">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          iconBg="icon-bg-blue"
          iconColor="icon-color-blue"
          title="Total Companies"
          value={metrics?.totalCompanies?.toString() || '0'}
          change="+12%"
          positive
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          iconBg="icon-bg-green"
          iconColor="icon-color-green"
          title="Total Contacts"
          value={metrics?.totalContacts?.toString() || '0'}
          change="+8%"
          positive
        />
        <StatCard
          icon={<Mail className="h-5 w-5" />}
          iconBg="icon-bg-purple"
          iconColor="icon-color-purple"
          title="Active Sequences"
          value={metrics?.activeSequences?.toString() || '0'}
          change="+15%"
          positive
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          iconBg="icon-bg-orange"
          iconColor="icon-color-orange"
          title="Avg AI Score"
          value={metrics?.averageAIScore?.toString() || '0'}
          change="+5%"
          positive
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Pipeline by Stage</h3>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-xl" style={{ borderColor: 'var(--border-color)' }}>
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Chart visualization coming soon</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Activity Over Time</h3>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-xl" style={{ borderColor: 'var(--border-color)' }}>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Export Data</h3>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors" style={{ background: 'var(--fill-tertiary)', color: 'var(--text-secondary)' }}>
            Download CSV (Day)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors" style={{ background: 'var(--fill-tertiary)', color: 'var(--text-secondary)' }}>
            Download CSV (Week)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors" style={{ background: 'var(--fill-tertiary)', color: 'var(--text-secondary)' }}>
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
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--text-tertiary)' }} />
        ) : (
          <>
            <span className="stat-value" style={{ color: 'var(--text)' }}>{value}</span>
            <span className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded-full',
              positive ? 'change-positive' : 'change-negative'
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
      <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{description}</p>
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
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBg)} style={{ color: 'var(--text-secondary)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{title}</p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{time}</p>
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
      <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{title}</h2>
      <p className="mt-2 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      <p className="text-sm mt-4" style={{ color: 'var(--text-tertiary)' }}>Coming soon...</p>
    </div>
  );
}
