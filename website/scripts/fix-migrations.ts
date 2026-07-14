import { pgPool } from '../lib/rag/supabase';

async function main() {
  await pgPool.query(`
    INSERT INTO public.rag_migrations (version) VALUES 
      ('00000000000000'), 
      ('20260712143000'), 
      ('20260712192000')
    ON CONFLICT DO NOTHING;
  `);
  console.log('Marked existing migrations as applied.');
  process.exit(0);
}

main().catch(console.error);
