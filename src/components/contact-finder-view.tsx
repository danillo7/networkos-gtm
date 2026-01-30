/**
 * Contact Finder View Component
 * AI-powered discovery of decision makers
 */

'use client';

import * as React from 'react';
import {
  Search,
  Building2,
  User,
  Users,
  Briefcase,
  Code,
  Megaphone,
  Package,
  Loader2,
  AlertCircle,
  UserPlus,
  MessageSquare,
  Mail,
  Linkedin,
  Shield,
  Check,
  RefreshCw,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFindContacts } from '@/hooks/useApi';

// Sample companies for selection
const SAMPLE_COMPANIES = [
  { id: '1', name: 'TechCorp Inc', domain: 'techcorp.com', industry: 'Technology' },
  { id: '2', name: 'MediaFlow', domain: 'mediaflow.io', industry: 'Media' },
  { id: '3', name: 'EduLearn', domain: 'edulearn.com', industry: 'Education' },
  { id: '4', name: 'FinanceHub', domain: 'financehub.com', industry: 'Finance' },
  { id: '5', name: 'HealthTech Pro', domain: 'healthtechpro.com', industry: 'Healthcare' },
];

// Target roles configuration
const TARGET_ROLES = [
  { id: 'c-level', label: 'C-Level', description: 'CEO, CTO, CFO, COO, etc.' },
  { id: 'vp', label: 'VP', description: 'Vice Presidents' },
  { id: 'director', label: 'Director', description: 'Directors and Heads' },
  { id: 'manager', label: 'Manager', description: 'Senior Managers' },
];

// Departments configuration
const DEPARTMENTS = [
  { id: 'engineering', label: 'Engineering', icon: Code },
  { id: 'product', label: 'Product', icon: Package },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'sales', label: 'Sales', icon: Briefcase },
];

interface DiscoveredContact {
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  title: string;
  department?: string;
  authorityScore: number;
  decisionMaker: boolean;
  emailConfidence?: number;
  linkedinUrl?: string;
}

export function ContactFinderView() {
  // Selection state
  const [selectedCompany, setSelectedCompany] = React.useState(SAMPLE_COMPANIES[0]);
  const [showCompanyDropdown, setShowCompanyDropdown] = React.useState(false);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>(['c-level', 'vp', 'director']);
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>(['engineering', 'product']);
  const [maxContacts, setMaxContacts] = React.useState(10);

  // Results state
  const [discoveredContacts, setDiscoveredContacts] = React.useState<DiscoveredContact[]>([]);
  const [addedContacts, setAddedContacts] = React.useState<Set<string>>(new Set());

  // API hook
  const { loading, error, find, reset } = useFindContacts();

  const handleFind = async () => {
    reset();
    setDiscoveredContacts([]);

    const result = await find({
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      domain: selectedCompany.domain,
      industry: selectedCompany.industry,
      targetRoles: selectedRoles,
      maxContacts,
    });

    if (result?.contacts) {
      // Filter by selected departments if any contacts have department info
      const filtered = result.contacts.filter((contact: DiscoveredContact) => {
        if (!contact.department) return true;
        return selectedDepartments.some(dept =>
          contact.department?.toLowerCase().includes(dept.toLowerCase())
        );
      });
      setDiscoveredContacts(filtered);
    }
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleAddContact = (contact: DiscoveredContact) => {
    const key = `${contact.fullName}-${contact.email}`;
    setAddedContacts(prev => new Set(prev).add(key));
    // In a real app, this would save to the database
  };

  const isContactAdded = (contact: DiscoveredContact) => {
    const key = `${contact.fullName}-${contact.email}`;
    return addedContacts.has(key);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-theme">Find Decision Makers</h2>
        <p className="text-sm text-theme-secondary">
          Discover key contacts at target companies
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Company Selection */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-theme/80 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Target Company
            </h3>

            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-theme-tertiary border border-theme hover:bg-theme-tertiary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                    <Building2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-theme">{selectedCompany.name}</p>
                    <p className="text-xs text-theme-secondary">{selectedCompany.domain}</p>
                  </div>
                </div>
                <ChevronDown className={cn(
                  'h-5 w-5 text-theme-tertiary transition-transform',
                  showCompanyDropdown && 'rotate-180'
                )} />
              </button>

              {showCompanyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10 rounded-xl dropdown-bg border border-theme shadow-xl overflow-hidden">
                  {SAMPLE_COMPANIES.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowCompanyDropdown(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 hover:bg-theme-tertiary transition-colors text-left',
                        selectedCompany.id === company.id && 'bg-theme-tertiary'
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                        <Building2 className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-theme">{company.name}</p>
                        <p className="text-xs text-theme-secondary">{company.domain}</p>
                      </div>
                      {selectedCompany.id === company.id && (
                        <Check className="h-4 w-4 text-green-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Target Roles */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-theme/80 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Target Roles
            </h3>

            <div className="space-y-2">
              {TARGET_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                    selectedRoles.includes(role.id)
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-theme-tertiary border-theme hover:bg-theme-tertiary'
                  )}
                >
                  <div className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors',
                    selectedRoles.includes(role.id)
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-white/30'
                  )}>
                    {selectedRoles.includes(role.id) && (
                      <Check className="h-4 w-4 text-theme" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      'text-sm font-medium',
                      selectedRoles.includes(role.id) ? 'text-theme' : 'text-theme-secondary'
                    )}>
                      {role.label}
                    </p>
                    <p className="text-xs text-theme-tertiary">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-theme/80 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Departments
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => toggleDepartment(dept.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                    selectedDepartments.includes(dept.id)
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-theme-tertiary border-theme text-theme-secondary hover:bg-theme-tertiary'
                  )}
                >
                  <dept.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{dept.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Max Contacts */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-theme/80 mb-4">Max Contacts</h3>
            <select
              value={maxContacts}
              onChange={(e) => setMaxContacts(Number(e.target.value))}
              className="w-full h-10 rounded-xl bg-theme-tertiary border border-theme px-3 text-sm text-theme"
            >
              <option value={5}>5 contacts</option>
              <option value={10}>10 contacts</option>
              <option value={20}>20 contacts</option>
              <option value={50}>50 contacts</option>
            </select>
          </div>

          {/* Find Button */}
          <button
            onClick={handleFind}
            disabled={loading || selectedRoles.length === 0}
            className="w-full btn-primary h-12 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Find Contacts
              </>
            )}
          </button>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-theme/80 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Discovered Contacts
              {discoveredContacts.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400">
                  {discoveredContacts.length} found
                </span>
              )}
            </h3>
            {discoveredContacts.length > 0 && (
              <button
                onClick={handleFind}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-theme-tertiary hover:bg-theme-tertiary transition-colors text-theme-secondary hover:text-theme"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                Refresh
              </button>
            )}
          </div>

          {/* Results Content */}
          <div className="flex-1 flex flex-col">
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-theme-secondary">Searching for decision makers...</p>
                  <p className="text-sm text-theme-tertiary mt-1">
                    Analyzing {selectedCompany.name} organization
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-theme-secondary">Failed to find contacts</p>
                  <p className="text-sm text-theme-tertiary mt-1">{error}</p>
                  <button onClick={handleFind} className="btn-primary mt-4">
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && discoveredContacts.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg mx-auto mb-4">
                    <Search className="h-8 w-8 text-theme" />
                  </div>
                  <p className="text-theme-secondary">Configure filters and click Find Contacts</p>
                  <p className="text-sm text-theme-tertiary mt-1">
                    AI will discover key decision makers at the target company
                  </p>
                </div>
              </div>
            )}

            {discoveredContacts.length > 0 && !loading && (
              <div className="space-y-3 overflow-auto">
                {discoveredContacts.map((contact, index) => (
                  <ContactResultCard
                    key={`${contact.fullName}-${index}`}
                    contact={contact}
                    isAdded={isContactAdded(contact)}
                    onAdd={() => handleAddContact(contact)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Result Card Component
function ContactResultCard({
  contact,
  isAdded,
  onAdd,
}: {
  contact: DiscoveredContact;
  isAdded: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-theme-tertiary border border-theme hover:bg-white/[0.07] transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-theme font-medium shrink-0">
          {contact.firstName[0]}
          {contact.lastName[0]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-theme truncate">{contact.fullName}</h4>
            {contact.decisionMaker && (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                Decision Maker
              </span>
            )}
          </div>
          <p className="text-sm text-theme-secondary truncate">{contact.title}</p>

          {/* Email with confidence */}
          {contact.email && (
            <div className="flex items-center gap-2 mt-2">
              <Mail className="h-3.5 w-3.5 text-theme-tertiary" />
              <span className="text-sm text-theme-secondary">{contact.email}</span>
              {contact.emailConfidence && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded',
                  contact.emailConfidence >= 80
                    ? 'bg-green-500/20 text-green-400'
                    : contact.emailConfidence >= 50
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                )}>
                  {contact.emailConfidence}% confidence
                </span>
              )}
            </div>
          )}

          {/* Authority Score */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-theme-secondary">Authority Score:</span>
              <span className={cn(
                'text-sm font-medium',
                contact.authorityScore >= 80
                  ? 'text-green-400'
                  : contact.authorityScore >= 60
                  ? 'text-yellow-400'
                  : 'text-red-400'
              )}>
                {contact.authorityScore}
              </span>
            </div>
            <div className="flex-1 h-1.5 rounded-full bg-theme-tertiary overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  contact.authorityScore >= 80
                    ? 'bg-green-400'
                    : contact.authorityScore >= 60
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                )}
                style={{ width: `${contact.authorityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {isAdded ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-green-500/20 text-green-400">
              <Check className="h-4 w-4" />
              Added
            </span>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add to List
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-theme-tertiary text-theme-secondary hover:bg-theme-tertiary hover:text-theme transition-colors">
            <MessageSquare className="h-4 w-4" />
            Generate Pitch
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactFinderView;
