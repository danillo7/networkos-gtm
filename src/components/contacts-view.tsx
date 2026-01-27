/**
 * Contacts View Component
 * Display contacts with AI Score badges
 */

'use client';

import * as React from 'react';
import {
  User,
  Building2,
  Mail,
  Linkedin,
  Phone,
  Zap,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  X,
  ExternalLink,
  MoreHorizontal,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Sample contacts data
const SAMPLE_CONTACTS = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    fullName: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    phone: '+1 555-0123',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    title: 'CTO',
    company: { id: '1', name: 'TechCorp Inc', domain: 'techcorp.com' },
    department: 'Engineering',
    seniority: 'C-Level',
    authorityScore: 95,
    decisionMaker: true,
    influencer: true,
    aiScore: { overall: 92, companyFit: 95, voiceAIOpp: 88, timing: 90, budget: 85 },
    leadStatus: 'hot',
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Johnson',
    fullName: 'Mike Johnson',
    email: 'mike.j@techcorp.com',
    linkedinUrl: 'https://linkedin.com/in/mikejohnson',
    title: 'VP Engineering',
    company: { id: '1', name: 'TechCorp Inc', domain: 'techcorp.com' },
    department: 'Engineering',
    seniority: 'VP',
    authorityScore: 82,
    decisionMaker: true,
    influencer: false,
    aiScore: { overall: 78, companyFit: 82, voiceAIOpp: 75, timing: 80, budget: 72 },
    leadStatus: 'warm',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    fullName: 'Emily Davis',
    email: 'emily@mediaflow.io',
    title: 'Head of Product',
    company: { id: '2', name: 'MediaFlow', domain: 'mediaflow.io' },
    department: 'Product',
    seniority: 'Director',
    authorityScore: 75,
    decisionMaker: false,
    influencer: true,
    aiScore: { overall: 85, companyFit: 90, voiceAIOpp: 88, timing: 78, budget: 82 },
    leadStatus: 'hot',
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Wilson',
    fullName: 'James Wilson',
    email: 'jwilson@edulearn.com',
    title: 'Senior Engineer',
    company: { id: '3', name: 'EduLearn', domain: 'edulearn.com' },
    department: 'Engineering',
    seniority: 'Senior',
    authorityScore: 55,
    decisionMaker: false,
    influencer: true,
    aiScore: null,
    leadStatus: 'cold',
  },
];

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  title: string;
  company: { id: string; name: string; domain: string };
  department: string;
  seniority: string;
  authorityScore: number;
  decisionMaker: boolean;
  influencer: boolean;
  aiScore?: { overall: number; companyFit: number; voiceAIOpp: number; timing: number; budget: number } | null;
  leadStatus: 'hot' | 'warm' | 'cold';
}

export function ContactsView() {
  const [contacts, setContacts] = React.useState<Contact[]>(SAMPLE_CONTACTS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [seniorityFilter, setSeniorityFilter] = React.useState<string>('all');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.leadStatus === statusFilter;
    const matchesSeniority = seniorityFilter === 'all' || c.seniority === seniorityFilter;

    return matchesSearch && matchesStatus && matchesSeniority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Contacts</h2>
          <p className="text-sm text-white/50">
            {contacts.length} contacts across {new Set(contacts.map((c) => c.company.id)).size} companies
          </p>
        </div>
        <button className="btn-primary">
          <Sparkles className="mr-2 h-4 w-4" />
          Find New Contacts
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2">
          {['all', 'hot', 'warm', 'cold'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                statusFilter === status
                  ? status === 'hot'
                    ? 'bg-red-500/20 text-red-400'
                    : status === 'warm'
                    ? 'bg-orange-500/20 text-orange-400'
                    : status === 'cold'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Seniority Filter */}
        <select
          value={seniorityFilter}
          onChange={(e) => setSeniorityFilter(e.target.value)}
          className="h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white/80"
        >
          <option value="all">All Seniority</option>
          <option value="C-Level">C-Level</option>
          <option value="VP">VP</option>
          <option value="Director">Director</option>
          <option value="Manager">Manager</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {/* Contacts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/60">No contacts found</h3>
          <p className="text-sm text-white/40 mt-1">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}

// Contact Card Component
function ContactCard({ contact }: { contact: Contact }) {
  const [showScoreTooltip, setShowScoreTooltip] = React.useState(false);

  return (
    <div className="glass-card p-5 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium">
            {contact.firstName[0]}
            {contact.lastName[0]}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
              {contact.fullName}
            </h3>
            <p className="text-sm text-white/60 truncate">{contact.title}</p>
          </div>
        </div>

        {/* AI Score Badge */}
        {contact.aiScore && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowScoreTooltip(true)}
              onMouseLeave={() => setShowScoreTooltip(false)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium border transition-colors',
                contact.aiScore.overall >= 80
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : contact.aiScore.overall >= 60
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              {contact.aiScore.overall}
            </button>

            {/* Score Tooltip */}
            {showScoreTooltip && (
              <div className="absolute right-0 top-full mt-2 z-10 w-48 p-3 rounded-xl bg-[#1c1c1e] border border-white/10 shadow-xl">
                <p className="text-xs font-medium text-white/80 mb-2">Score Breakdown</p>
                <div className="space-y-2">
                  <ScoreRow label="Company Fit" value={contact.aiScore.companyFit} />
                  <ScoreRow label="Voice AI Opp" value={contact.aiScore.voiceAIOpp} />
                  <ScoreRow label="Timing" value={contact.aiScore.timing} />
                  <ScoreRow label="Budget" value={contact.aiScore.budget} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Company */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Building2 className="h-4 w-4 text-white/40" />
        <span className="text-white/70">{contact.company.name}</span>
      </div>

      {/* Status & Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <LeadStatusBadge status={contact.leadStatus} />
        {contact.decisionMaker && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
            Decision Maker
          </span>
        )}
        {contact.influencer && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
            Influencer
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Send Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="View LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              title="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
        </div>

        <button className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
          <MessageSquare className="h-4 w-4" />
          Generate Pitch
        </button>
      </div>
    </div>
  );
}

// Lead Status Badge
function LeadStatusBadge({ status }: { status: 'hot' | 'warm' | 'cold' }) {
  const styles = {
    hot: 'bg-red-500/20 text-red-400',
    warm: 'bg-orange-500/20 text-orange-400',
    cold: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {status}
    </span>
  );
}

// Score Row for Tooltip
function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/50">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              value >= 80 ? 'bg-green-400' : value >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs text-white/70 w-8 text-right">{value}</span>
      </div>
    </div>
  );
}

export default ContactsView;
