import { pgPool } from '../lib/rag/supabase';

async function runCleanup() {
  console.log('==================================================');
  console.log('            RAG SYSTEM CLEANUP                    ');
  console.log('==================================================');
  
  try {
    process.stdout.write('Checking for orphaned chunks... ');
    const res = await pgPool.query(`
      DELETE FROM public.document_chunks
      WHERE parent_document NOT IN (SELECT id FROM public.documents)
      RETURNING id;
    `);
    console.log(`✅ Removed ${res.rowCount} orphans.`);

    process.stdout.write('Vacuuming rag_cache (removing expired)... ');
    // Assuming we want to remove items older than 30 days
    const cacheRes = await pgPool.query(`
      DELETE FROM public.rag_cache
      WHERE created_at < NOW() - INTERVAL '30 days'
      RETURNING id;
    `);
    console.log(`✅ Removed ${cacheRes.rowCount} expired entries.`);

    console.log('==================================================');
    console.log('✅ Cleanup completed successfully.');
    process.exit(0);
  } catch (err: any) {
    console.error(`\n❌ Cleanup failed: ${err.message}`);
    process.exit(1);
  }
}

runCleanup();
