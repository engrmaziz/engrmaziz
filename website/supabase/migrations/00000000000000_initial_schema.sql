-- Enable extensions
create extension if not exists "vector" with schema public;
create extension if not exists "uuid-ossp" with schema public;

-- Enums
create type user_role as enum ('admin', 'user');
create type contact_status as enum ('new', 'contacted', 'qualified', 'archived');
create type service_request_status as enum ('pending', 'reviewing', 'accepted', 'declined');
create type appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type conversation_status as enum ('active', 'closed', 'archived');
create type document_type as enum ('markdown', 'pdf', 'txt', 'csv', 'web');
create type embedding_status as enum ('pending', 'processing', 'completed', 'failed');
create type prompt_status as enum ('draft', 'active', 'archived');
create type email_status as enum ('queued', 'sent', 'delivered', 'failed', 'bounced');

-- 1. Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text unique not null,
  role user_role default 'user',
  avatar text,
  bio text,
  timezone text,
  preferences jsonb default '{}'::jsonb,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Contacts
create table public.contacts (
  id uuid primary key default uuid_generate_v4(),
  timestamp timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  country text,
  subject text,
  message text not null,
  source_page text,
  referrer text,
  utm_parameters jsonb,
  ip_hash text,
  status contact_status default 'new',
  notes text,
  lead_score integer default 0,
  email_sent_status boolean default false,
  acknowledgement_status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Service Requests
create table public.service_requests (
  id uuid primary key default uuid_generate_v4(),
  selected_service text not null,
  requirements text not null,
  budget text,
  timeline text,
  company text,
  industry text,
  attachments text[],
  priority integer default 0,
  lead_score integer default 0,
  status service_request_status default 'pending',
  follow_up_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Appointments
create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  visitor_details jsonb not null,
  preferred_date date not null,
  preferred_time time not null,
  timezone text not null,
  meeting_purpose text not null,
  calendar_status appointment_status default 'pending',
  confirmation_status boolean default false,
  google_calendar_event_id text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Conversations
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  visitor_id text,
  visitor_name text,
  visitor_email text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  lead_score integer default 0,
  intent text,
  industry text,
  qualified boolean default false,
  appointment_requested boolean default false,
  summary text,
  model_usage jsonb,
  token_usage integer default 0,
  status conversation_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Messages
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  timestamp timestamptz default now(),
  citations jsonb,
  model text,
  latency integer,
  feedback text,
  created_at timestamptz default now()
);

-- 7. Documents
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  document_type document_type not null,
  project text,
  version text,
  source text,
  checksum text unique,
  file_path text,
  file_size bigint,
  mime_type text,
  chunk_count integer default 0,
  embedding_status embedding_status default 'pending',
  indexed_status boolean default false,
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Document Chunks
create table public.document_chunks (
  id uuid primary key default uuid_generate_v4(),
  parent_document uuid references public.documents(id) on delete cascade not null,
  chunk_text text not null,
  chunk_number integer not null,
  metadata jsonb,
  token_count integer,
  created_at timestamptz default now()
);

-- 9. Embeddings
create table public.embeddings (
  id uuid primary key default uuid_generate_v4(),
  embedding_model text not null,
  document_id uuid references public.documents(id) on delete cascade not null,
  chunk_id uuid references public.document_chunks(id) on delete cascade not null,
  vector vector(768) not null,
  version text,
  created_at timestamptz default now()
);

-- 10. Blog Sync
create table public.blog_sync (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references public.documents(id) on delete set null,
  slug text unique not null,
  published boolean default false,
  embedding_status embedding_status default 'pending',
  last_indexed timestamptz,
  checksum text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 11. Resume Versions
create table public.resume_versions (
  id uuid primary key default uuid_generate_v4(),
  version text not null,
  filename text not null,
  storage_path text not null,
  active_version boolean default false,
  uploaded_date timestamptz default now(),
  download_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 12. Activity Logs
create table public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- 13. Prompt Versions
create table public.prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  prompt_name text not null,
  version text not null,
  content_hash text,
  active boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. Email Logs
create table public.email_logs (
  id uuid primary key default uuid_generate_v4(),
  recipient text not null,
  sender text not null,
  template text,
  status email_status default 'queued',
  provider text,
  message_id text,
  delivery_status text,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

-- 15. System Settings
create table public.system_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text unique not null,
  setting_value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- INDEXES
-- =========================================
create index idx_contacts_email on public.contacts(email);
create index idx_contacts_status on public.contacts(status);
create index idx_contacts_created on public.contacts(created_at desc);

create index idx_conversations_status on public.conversations(status);
create index idx_conversations_score on public.conversations(lead_score desc);

create index idx_documents_type on public.documents(document_type);
create index idx_documents_embedding_status on public.documents(embedding_status);

create index idx_embeddings_document on public.embeddings(document_id);
create index idx_embeddings_model on public.embeddings(embedding_model);
-- HNSW Vector Index for fast cosine similarity search
create index idx_embeddings_vector on public.embeddings using hnsw (vector vector_cosine_ops);

create index idx_blog_sync_slug on public.blog_sync(slug);

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.service_requests enable row level security;
alter table public.appointments enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.embeddings enable row level security;
alter table public.blog_sync enable row level security;
alter table public.resume_versions enable row level security;
alter table public.activity_logs enable row level security;
alter table public.prompt_versions enable row level security;
alter table public.email_logs enable row level security;
alter table public.system_settings enable row level security;

-- Admin policies (full access)
create policy "Admins have full access to profiles" on public.profiles for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to contacts" on public.contacts for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to service_requests" on public.service_requests for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to appointments" on public.appointments for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to conversations" on public.conversations for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to messages" on public.messages for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to documents" on public.documents for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to document_chunks" on public.document_chunks for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to embeddings" on public.embeddings for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to blog_sync" on public.blog_sync for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to resume_versions" on public.resume_versions for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to activity_logs" on public.activity_logs for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to prompt_versions" on public.prompt_versions for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to email_logs" on public.email_logs for all using (auth.jwt() ->> 'role' = 'admin');
create policy "Admins have full access to system_settings" on public.system_settings for all using (auth.jwt() ->> 'role' = 'admin');

-- Public policies (Restricted)
create policy "Public can insert contacts" on public.contacts for insert with check (true);
create policy "Public can insert service_requests" on public.service_requests for insert with check (true);
create policy "Public can insert appointments" on public.appointments for insert with check (true);
create policy "Public can read active resume" on public.resume_versions for select using (active_version = true);
create policy "Public can read published blogs" on public.blog_sync for select using (published = true);

-- Note: In a production environment, Conversations and Messages inserts from public users 
-- would be handled securely via an API Route Server Action leveraging a Service Role Key,
-- rather than direct client-side insertion, to prevent malicious prompt injection or rate limit bypass.

-- =========================================
-- STORAGE BUCKETS
-- =========================================
insert into storage.buckets (id, name, public) values 
('resumes', 'resumes', true),
('documents', 'documents', false),
('knowledge', 'knowledge', false),
('blog-assets', 'blog-assets', true),
('conversation-attachments', 'conversation-attachments', false),
('avatars', 'avatars', true),
('temporary', 'temporary', false)
on conflict do nothing;

-- RLS for Storage
create policy "Public can read resumes" on storage.objects for select using (bucket_id = 'resumes');
create policy "Public can read blog assets" on storage.objects for select using (bucket_id = 'blog-assets');
create policy "Admins can manage all storage" on storage.objects for all using (auth.jwt() ->> 'role' = 'admin');
