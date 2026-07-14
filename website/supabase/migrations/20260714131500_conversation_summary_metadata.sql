ALTER TABLE public.conversations 
ADD COLUMN summary_message_count integer default 0,
ADD COLUMN summary_updated_at timestamptz;
