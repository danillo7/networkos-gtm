/**
 * NetworkOS - Main Dashboard Page
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

// Navigation items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Target },
  { id: 'pitches', label: 'Pitches', icon: Sparkles },
  { id: 'outreach', label: 'Outreach', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r bg-card transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">NetworkOS</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                !sidebarOpen && 'justify-center px-2'
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* Settings */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              !sidebarOpen && 'justify-center px-2'
            )}
          >
            <Settings className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Settings</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-6">
          <div>
            <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
            <p className="text-sm text-muted-foreground">
              AI-First GTM Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search companies, contacts..."
                className="h-9 w-64 rounded-md border bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Quick Actions */}
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'companies' && <CompaniesView />}
          {activeTab === 'contacts' && <ContactsView />}
          {activeTab === 'pipeline' && <PipelineView />}
          {activeTab === 'pitches' && <PitchesView />}
          {activeTab === 'outreach' && <OutreachView />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </div>
      </main>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Companies" value="127" change="+12%" positive />
        <StatCard title="Active Contacts" value="438" change="+8%" positive />
        <StatCard title="Pipeline Value" value="$2.4M" change="+23%" positive />
        <StatCard title="Avg AI Score" value="72" change="+5%" positive />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Research Company</h3>
              <p className="text-sm text-muted-foreground">
                Deep AI-powered company analysis
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Generate Pitch</h3>
              <p className="text-sm text-muted-foreground">
                AI-crafted personalized outreach
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Find Contacts</h3>
              <p className="text-sm text-muted-foreground">
                Discover decision makers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem
              icon={<Building2 className="h-4 w-4" />}
              title="New company added: Acme Corp"
              time="2 minutes ago"
            />
            <ActivityItem
              icon={<Sparkles className="h-4 w-4" />}
              title="Pitch generated for TechStart Inc"
              time="15 minutes ago"
            />
            <ActivityItem
              icon={<Users className="h-4 w-4" />}
              title="3 contacts found at DataFlow"
              time="1 hour ago"
            />
            <ActivityItem
              icon={<Target className="h-4 w-4" />}
              title="Opportunity moved to 'Demo Done'"
              time="2 hours ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder views
function CompaniesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
        <CardDescription>Manage and research target companies</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Import the CompanyCard component and list companies here.
        </p>
      </CardContent>
    </Card>
  );
}

function ContactsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>Decision makers and influencers</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Import the ContactFinder component to discover and manage contacts.
        </p>
      </CardContent>
    </Card>
  );
}

function PipelineView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline</CardTitle>
        <CardDescription>Track opportunities through stages</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Import the PipelineManager component for kanban-style pipeline management.
        </p>
      </CardContent>
    </Card>
  );
}

function PitchesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitches</CardTitle>
        <CardDescription>AI-generated personalized outreach</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Import the PitchGenerator component to create compelling pitches.
        </p>
      </CardContent>
    </Card>
  );
}

function OutreachView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outreach</CardTitle>
        <CardDescription>Manage outreach sequences</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure and monitor multi-step outreach campaigns.
        </p>
      </CardContent>
    </Card>
  );
}

function AnalyticsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Performance metrics and insights</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Import the InsightsDashboard component for comprehensive analytics.
        </p>
      </CardContent>
    </Card>
  );
}

// Helper components
function StatCard({
  title,
  value,
  change,
  positive,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold">{value}</span>
          <Badge variant={positive ? 'success' : 'destructive'} className="text-xs">
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
