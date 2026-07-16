// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import { pgPool } from '../lib/rag/supabase';

async function main() {
  console.log('==================================================');
  console.log('            RAG DATABASE MIGRATOR                 ');
  console.log('==================================================');

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`[Migrator] Migrations directory not found at: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  if (files.length === 0) {
    console.log('[Migrator] No SQL migration files found.');
    process.exit(0);
  }

  // Ensure migration tracking table exists
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS public.rag_migrations (
        version text PRIMARY KEY,
        applied_at timestamptz DEFAULT now()
      );
    `);
  } catch (error: any) {
    console.error(`[Migrator] Failed to create tracking table: ${error.message}`);
    process.exit(1);
  }

  for (const file of files) {
    const version = file.split('_')[0]; // Simple version extraction
    
    // Check if already applied
    const { rows } = await pgPool.query('SELECT version FROM public.rag_migrations WHERE version = $1', [version]);
    
    if (rows.length > 0) {
      console.log(`[Migrator] Skipping ${file} (already applied)`);
      continue;
    }

    console.log(`[Migrator] Applying ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await pgPool.query('BEGIN');
      await pgPool.query(sql);
      await pgPool.query('INSERT INTO public.rag_migrations (version) VALUES ($1)', [version]);
      await pgPool.query('COMMIT');
      console.log(`[Migrator] Successfully applied ${file}`);
    } catch (error: any) {
      await pgPool.query('ROLLBACK');
      console.error(`[Migrator] Error applying ${file}: ${error.message}`);
      process.exit(1);
    }
  }

  console.log('==================================================');
  console.log('            MIGRATIONS COMPLETE                   ');
  console.log('==================================================');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Migrator] Unhandled error:', err);
  process.exit(1);
});
