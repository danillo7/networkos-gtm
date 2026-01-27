-- NetworkOS AI-First GTM Platform - Database Schema
-- Version: 1.0.0
-- Run this migration in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- COMPANIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    industry VARCHAR(100) NOT NULL,
    sub_industry VARCHAR(100),
    size VARCHAR(20) NOT NULL CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+')),
    employee_count INTEGER,
    revenue VARCHAR(50),
    funding JSONB, -- FundingInfo
    tech_stack TEXT[] DEFAULT '{}',
    products JSONB DEFAULT '[]', -- Product[]
    headquarters JSONB, -- Location
    founded_year INTEGER,
    linkedin_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    ai_score JSONB, -- AIScore
    enrichment_sources JSONB DEFAULT '[]', -- EnrichmentSource[]
    last_enriched TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for companies
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_size ON companies(size);
CREATE INDEX idx_companies_ai_score ON companies((ai_score->>'overall')::numeric);
CREATE INDEX idx_companies_name_trgm ON companies USING gin(name gin_trgm_ops);
CREATE INDEX idx_companies_created ON companies(created_at DESC);

-- ============================================================================
-- CONTACTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_date TIMESTAMPTZ,
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    title VARCHAR(200) NOT NULL,
    department VARCHAR(50) CHECK (department IN (
        'Engineering', 'Product', 'Marketing', 'Sales', 'Customer Success',
        'Operations', 'Finance', 'HR', 'Legal', 'Executive', 'IT', 'Other'
    )),
    seniority VARCHAR(20) NOT NULL CHECK (seniority IN (
        'C-Level', 'VP', 'Director', 'Manager', 'Senior', 'Mid-Level', 'Junior', 'Intern'
    )),
    authority_score INTEGER NOT NULL DEFAULT 0 CHECK (authority_score >= 0 AND authority_score <= 100),
    decision_maker BOOLEAN DEFAULT FALSE,
    influencer BOOLEAN DEFAULT FALSE,
    persona JSONB, -- ContactPersona
    enrichment_sources JSONB DEFAULT '[]', -- EnrichmentSource[]
    last_enriched TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for contacts
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_seniority ON contacts(seniority);
CREATE INDEX idx_contacts_authority ON contacts(authority_score DESC);
CREATE INDEX idx_contacts_decision_maker ON contacts(decision_maker) WHERE decision_maker = TRUE;
CREATE INDEX idx_contacts_name_trgm ON contacts USING gin(full_name gin_trgm_ops);

-- ============================================================================
-- PITCHES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pitches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'linkedin', 'call_script', 'video_script', 'proposal')),
    subject VARCHAR(500),
    body TEXT NOT NULL,
    hooks JSONB DEFAULT '[]', -- string[]
    personalization JSONB DEFAULT '[]', -- PersonalizationElement[]
    elevenlabs_products JSONB DEFAULT '[]', -- ElevenLabsProduct[]
    use_cases JSONB DEFAULT '[]', -- UseCase[]
    tone VARCHAR(20) NOT NULL CHECK (tone IN ('Professional', 'Friendly', 'Technical', 'Executive', 'Casual', 'Urgent')),
    length VARCHAR(10) NOT NULL CHECK (length IN ('short', 'medium', 'long')),
    variant VARCHAR(50),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    ai_model VARCHAR(100) NOT NULL,
    prompt_version VARCHAR(20) NOT NULL,
    feedback JSONB, -- PitchFeedback
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for pitches
CREATE INDEX idx_pitches_company ON pitches(company_id);
CREATE INDEX idx_pitches_contact ON pitches(contact_id);
CREATE INDEX idx_pitches_type ON pitches(type);
CREATE INDEX idx_pitches_generated ON pitches(generated_at DESC);

-- ============================================================================
-- PITCH TEMPLATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pitch_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'linkedin', 'call_script', 'video_script', 'proposal')),
    vertical VARCHAR(100),
    use_case VARCHAR(200),
    template TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    times_used INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2),
    reply_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OUTREACH SEQUENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS outreach_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contact_ids UUID[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'
    )),
    steps JSONB NOT NULL DEFAULT '[]', -- OutreachStep[]
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    metrics JSONB DEFAULT '{}', -- SequenceMetrics
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sequences
CREATE INDEX idx_sequences_company ON outreach_sequences(company_id);
CREATE INDEX idx_sequences_status ON outreach_sequences(status);
CREATE INDEX idx_sequences_start ON outreach_sequences(start_date);

-- ============================================================================
-- OPPORTUNITIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    primary_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    stage VARCHAR(30) NOT NULL DEFAULT 'New Lead' CHECK (stage IN (
        'New Lead', 'Researching', 'Outreach Started', 'Engaged',
        'Meeting Scheduled', 'Demo Done', 'Proposal Sent',
        'Negotiation', 'Won', 'Lost', 'On Hold'
    )),
    value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    probability INTEGER CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    sequence_id UUID REFERENCES outreach_sequences(id) ON DELETE SET NULL,
    notes JSONB DEFAULT '[]', -- OpportunityNote[]
    activities JSONB DEFAULT '[]', -- Activity[]
    ai_recommendations TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for opportunities
CREATE INDEX idx_opportunities_company ON opportunities(company_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_opportunities_value ON opportunities(value DESC);
CREATE INDEX idx_opportunities_close_date ON opportunities(expected_close_date);

-- ============================================================================
-- ENRICHMENT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS enrichment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(10) NOT NULL CHECK (entity_type IN ('company', 'contact')),
    entity_id UUID NOT NULL,
    provider VARCHAR(30) NOT NULL CHECK (provider IN (
        'Hunter.io', 'Apollo.io', 'Clearbit', 'People Data Labs',
        'Perplexity', 'LinkedIn', 'Crunchbase', 'Manual', 'AI Research'
    )),
    status VARCHAR(10) NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
    data_points_found INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10,4),
    duration INTEGER NOT NULL, -- milliseconds
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for enrichment logs
CREATE INDEX idx_enrichment_entity ON enrichment_logs(entity_type, entity_id);
CREATE INDEX idx_enrichment_provider ON enrichment_logs(provider);
CREATE INDEX idx_enrichment_created ON enrichment_logs(created_at DESC);

-- ============================================================================
-- AGENT EXECUTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(30) NOT NULL CHECK (agent_type IN (
        'ResearchAgent', 'ScoringAgent', 'PitchGenerator',
        'ContactFinder', 'OutreachPlanner', 'MasterOrchestrator'
    )),
    input JSONB NOT NULL,
    output JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
    steps JSONB DEFAULT '[]', -- AgentStep[]
    total_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10,4) DEFAULT 0,
    duration INTEGER, -- milliseconds
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes for agent executions
CREATE INDEX idx_agent_type ON agent_executions(agent_type);
CREATE INDEX idx_agent_status ON agent_executions(status);
CREATE INDEX idx_agent_started ON agent_executions(started_at DESC);

-- ============================================================================
-- ACTIVITY FEED VIEW
-- ============================================================================

CREATE OR REPLACE VIEW activity_feed AS
SELECT
    'company_created' as activity_type,
    id as entity_id,
    'company' as entity_type,
    name as title,
    'New company added: ' || name as description,
    created_at
FROM companies
UNION ALL
SELECT
    'contact_created' as activity_type,
    id as entity_id,
    'contact' as entity_type,
    full_name as title,
    'New contact: ' || full_name || ' (' || title || ')' as description,
    created_at
FROM contacts
UNION ALL
SELECT
    'pitch_generated' as activity_type,
    id as entity_id,
    'pitch' as entity_type,
    COALESCE(subject, 'Pitch') as title,
    'Generated ' || type || ' pitch' as description,
    created_at
FROM pitches
UNION ALL
SELECT
    'opportunity_created' as activity_type,
    o.id as entity_id,
    'opportunity' as entity_type,
    c.name as title,
    'New opportunity: ' || c.name || ' (' || o.stage || ')' as description,
    o.created_at
FROM opportunities o
JOIN companies c ON o.company_id = c.id
ORDER BY created_at DESC;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequences_updated_at
    BEFORE UPDATE ON outreach_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pitch_templates_updated_at
    BEFORE UPDATE ON pitch_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (Optional - Enable if using auth)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (full access)
CREATE POLICY "Service role has full access to companies" ON companies
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to contacts" ON contacts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to pitches" ON pitches
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to sequences" ON outreach_sequences
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to opportunities" ON opportunities
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to enrichment_logs" ON enrichment_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to agent_executions" ON agent_executions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to pitch_templates" ON pitch_templates
    FOR ALL USING (auth.role() = 'service_role');

-- Anon can read companies and contacts
CREATE POLICY "Anon can read companies" ON companies
    FOR SELECT USING (auth.role() = 'anon');

CREATE POLICY "Anon can read contacts" ON contacts
    FOR SELECT USING (auth.role() = 'anon');

-- ============================================================================
-- INITIAL DATA: ElevenLabs Product Catalog
-- ============================================================================

CREATE TABLE IF NOT EXISTS elevenlabs_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    features TEXT[] NOT NULL,
    use_cases TEXT[] NOT NULL,
    target_audience TEXT[] NOT NULL,
    pricing_model VARCHAR(100),
    competitive_advantage TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert ElevenLabs products
INSERT INTO elevenlabs_products (name, description, category, features, use_cases, target_audience, pricing_model, competitive_advantage)
VALUES
(
    'Text to Speech API',
    'Industry-leading AI voice synthesis with natural, expressive speech output',
    'Text to Speech',
    ARRAY['29+ languages', 'Voice customization', 'Emotional tone control', 'Low latency streaming', 'SSML support'],
    ARRAY['Audiobook production', 'Video voiceovers', 'Podcast creation', 'E-learning content', 'IVR systems', 'Accessibility solutions'],
    ARRAY['Content creators', 'Publishers', 'E-learning platforms', 'Game developers', 'Call centers'],
    'Usage-based (characters)',
    ARRAY['Most natural sounding AI voices', 'Fastest inference times', 'Widest language support']
),
(
    'Voice Cloning',
    'Create custom AI voices from audio samples with instant or professional cloning',
    'Voice Cloning',
    ARRAY['Instant cloning (30s sample)', 'Professional cloning (30min)', 'Voice consistency', 'Multi-language support'],
    ARRAY['Personal voice preservation', 'Brand voice creation', 'Character voices for games', 'Dubbing workflows'],
    ARRAY['Media companies', 'Game studios', 'Personal users', 'Agencies'],
    'Subscription tiers',
    ARRAY['Highest fidelity cloning', 'Fastest turnaround', 'Best emotional range preservation']
),
(
    'Conversational AI',
    'Real-time voice AI for interactive applications with ultra-low latency',
    'Conversational AI',
    ARRAY['<500ms latency', 'Turn-taking detection', 'Interrupt handling', 'Context awareness', 'Multi-speaker support'],
    ARRAY['AI assistants', 'Customer service bots', 'Interactive NPCs', 'Voice interfaces', 'Tutoring systems'],
    ARRAY['Tech companies', 'Customer service', 'Gaming', 'EdTech'],
    'Usage-based (minutes)',
    ARRAY['Lowest latency in market', 'Most natural conversations', 'Best interrupt handling']
),
(
    'AI Dubbing',
    'Automatic video dubbing preserving original voice characteristics across languages',
    'Dubbing',
    ARRAY['29 languages', 'Voice preservation', 'Lip sync', 'Emotion transfer', 'Batch processing'],
    ARRAY['Movie/TV localization', 'Corporate video translation', 'YouTube content', 'E-learning localization'],
    ARRAY['Studios', 'Streaming platforms', 'Corporate comms', 'Content creators'],
    'Per-minute pricing',
    ARRAY['Best voice preservation', 'Fastest turnaround', 'Most accurate lip sync']
),
(
    'Sound Effects Generation',
    'AI-generated sound effects from text descriptions',
    'Audio AI',
    ARRAY['Text-to-SFX', 'Customizable parameters', 'High quality output', 'Commercial license'],
    ARRAY['Game audio', 'Film production', 'Podcast enhancement', 'Video content'],
    ARRAY['Game developers', 'Video editors', 'Podcasters', 'Film makers'],
    'Usage-based',
    ARRAY['Most realistic SFX', 'Fastest generation', 'Widest variety']
)
ON CONFLICT DO NOTHING;

-- Index for ElevenLabs products
CREATE INDEX idx_elevenlabs_category ON elevenlabs_products(category);

COMMENT ON TABLE companies IS 'Target companies for GTM outreach';
COMMENT ON TABLE contacts IS 'Decision makers and influencers at target companies';
COMMENT ON TABLE pitches IS 'AI-generated personalized pitches';
COMMENT ON TABLE outreach_sequences IS 'Multi-step outreach campaigns';
COMMENT ON TABLE opportunities IS 'Sales pipeline opportunities';
COMMENT ON TABLE enrichment_logs IS 'Audit trail for data enrichment operations';
COMMENT ON TABLE agent_executions IS 'AI agent execution history';
COMMENT ON TABLE elevenlabs_products IS 'ElevenLabs product catalog for pitch matching';
