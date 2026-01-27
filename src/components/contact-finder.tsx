/**
 * NetworkOS - Contact Finder Component
 * UI for discovering and managing contacts
 */

'use client';

import * as React from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Linkedin,
  CheckCircle,
  XCircle,
  Loader2,
  Star,
  Crown,
  Shield,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/cn';
import type { Company, Contact, Seniority, ContactPersona } from '@/api/lib/types';

interface ContactFinderProps {
  company: Company;
  existingContacts?: Contact[];
  onFindContacts: (options: FindContactsOptions) => Promise<Contact[]>;
  onVerifyEmail: (email: string) => Promise<{ valid: boolean; confidence: number }>;
  onAddToSequence?: (contacts: Contact[]) => void;
  isLoading?: boolean;
}

interface FindContactsOptions {
  targetRoles?: string[];
  maxContacts?: number;
}

const SENIORITY_CONFIG: Record<Seniority, { icon: React.ReactNode; color: string; priority: number }> = {
  'C-Level': { icon: <Crown className="h-4 w-4" />, color: 'text-yellow-600', priority: 1 },
  'VP': { icon: <Star className="h-4 w-4" />, color: 'text-purple-600', priority: 2 },
  'Director': { icon: <Shield className="h-4 w-4" />, color: 'text-blue-600', priority: 3 },
  'Manager': { icon: null, color: 'text-green-600', priority: 4 },
  'Senior': { icon: null, color: 'text-gray-600', priority: 5 },
  'Mid-Level': { icon: null, color: 'text-gray-500', priority: 6 },
  'Junior': { icon: null, color: 'text-gray-400', priority: 7 },
  'Intern': { icon: null, color: 'text-gray-300', priority: 8 },
};

const DEFAULT_TARGET_ROLES = [
  'CEO',
  'CTO',
  'VP Engineering',
  'VP Product',
  'Head of AI',
  'Director of Engineering',
  'Product Manager',
];

export function ContactFinder({
  company,
  existingContacts = [],
  onFindContacts,
  onVerifyEmail,
  onAddToSequence,
  isLoading = false,
}: ContactFinderProps) {
  const [contacts, setContacts] = React.useState<Contact[]>(existingContacts);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>(DEFAULT_TARGET_ROLES.slice(0, 4));
  const [customRole, setCustomRole] = React.useState('');
  const [selectedContacts, setSelectedContacts] = React.useState<Set<string>>(new Set());
  const [finding, setFinding] = React.useState(false);
  const [verifying, setVerifying] = React.useState<string | null>(null);

  const handleFindContacts = async () => {
    setFinding(true);
    try {
      const newContacts = await onFindContacts({
        targetRoles: selectedRoles,
        maxContacts: 10,
      });
      setContacts(newContacts);
    } catch (error) {
      console.error('Failed to find contacts:', error);
    } finally {
      setFinding(false);
    }
  };

  const handleVerifyEmail = async (contact: Contact) => {
    if (!contact.email) return;

    setVerifying(contact.id);
    try {
      const result = await onVerifyEmail(contact.email);
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? { ...c, emailVerified: result.valid, emailVerificationDate: new Date() }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to verify email:', error);
    } finally {
      setVerifying(null);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const addCustomRole = () => {
    if (customRole && !selectedRoles.includes(customRole)) {
      setSelectedRoles((prev) => [...prev, customRole]);
      setCustomRole('');
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedContacts(new Set(contacts.map((c) => c.id)));
  };

  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  // Sort contacts by authority score
  const sortedContacts = [...contacts].sort(
    (a, b) => b.authorityScore - a.authorityScore
  );

  return (
    <div className="space-y-4">
      {/* Search Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Find Decision Makers
          </CardTitle>
          <CardDescription>
            Discover contacts at {company.name}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Target Roles */}
          <div>
            <label className="text-sm font-medium mb-2 block">Target Roles</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TARGET_ROLES.map((role) => (
                <Badge
                  key={role}
                  variant={selectedRoles.includes(role) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          {/* Custom Role */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Add custom role..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addCustomRole()}
            />
            <Button variant="outline" size="sm" onClick={addCustomRole}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Button */}
          <Button
            className="w-full"
            onClick={handleFindContacts}
            disabled={finding || isLoading || selectedRoles.length === 0}
            loading={finding}
          >
            <Users className="mr-2 h-4 w-4" />
            Find Contacts
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {contacts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Found {contacts.length} contacts
                </CardTitle>
                <CardDescription>
                  Sorted by authority score
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {sortedContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                selected={selectedContacts.has(contact.id)}
                onSelect={() => toggleContactSelection(contact.id)}
                onVerify={() => handleVerifyEmail(contact)}
                isVerifying={verifying === contact.id}
              />
            ))}

            {/* Actions */}
            {selectedContacts.size > 0 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {selectedContacts.size} selected
                </span>
                <Button
                  onClick={() =>
                    onAddToSequence?.(
                      contacts.filter((c) => selectedContacts.has(c.id))
                    )
                  }
                >
                  Add to Sequence
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {contacts.length === 0 && !finding && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">No contacts found yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select target roles and click "Find Contacts" to discover decision makers
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Contact Card Component
interface ContactCardProps {
  contact: Contact;
  selected: boolean;
  onSelect: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}

function ContactCard({
  contact,
  selected,
  onSelect,
  onVerify,
  isVerifying,
}: ContactCardProps) {
  const seniorityConfig = SENIORITY_CONFIG[contact.seniority];

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all cursor-pointer',
        selected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Avatar Placeholder */}
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10',
          seniorityConfig.color
        )}>
          {seniorityConfig.icon || (
            <span className="text-sm font-semibold">
              {contact.firstName[0]}
              {contact.lastName[0]}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{contact.fullName}</span>
            {contact.decisionMaker && (
              <Badge variant="success" className="text-xs">
                Decision Maker
              </Badge>
            )}
            {contact.influencer && !contact.decisionMaker && (
              <Badge variant="info" className="text-xs">
                Influencer
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground truncate">
            {contact.title}
          </p>

          {/* Contact Methods */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {contact.email && (
              <div className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{contact.email}</span>
                {contact.emailVerified ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerify();
                    }}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3" />
                <span>{contact.phone}</span>
              </div>
            )}

            {contact.linkedinUrl && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </a>
            )}
          </div>

          {/* Persona */}
          {contact.persona && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">{contact.persona.type}</span>
              {contact.persona.communicationStyle && (
                <span> - {contact.persona.communicationStyle}</span>
              )}
            </div>
          )}
        </div>

        {/* Authority Score */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-2xl font-bold">{contact.authorityScore}</span>
          <Progress
            value={contact.authorityScore}
            className="w-16"
            size="sm"
          />
          <Badge variant="outline" className={cn('text-xs', seniorityConfig.color)}>
            {contact.seniority}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default ContactFinder;
