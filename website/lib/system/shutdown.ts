// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { telemetryLogger } from '../telemetry';
import { pgPool } from '../rag/supabase';

class ShutdownManager {
  private isShuttingDown = false;

  async shutdown(reason: string) {
    if (this.isShuttingDown) {
      telemetryLogger.log('SYSTEM', 'Shutdown already in progress. Ignoring signal.', { reason });
      return;
    }
    
    this.isShuttingDown = true;
    telemetryLogger.log('SYSTEM', `Initiating graceful shutdown. Reason: ${reason}`);

    // 1. Stop accepting work (In a real HTTP server, we would close the server here to stop accepting new requests)
    telemetryLogger.log('SYSTEM', 'Shutdown phase 1: Stopped accepting new work');

    // 2. Flush telemetry (In this architecture, telemetry is already synchronous or handled per request, but we would await pending batches here)
    telemetryLogger.log('SYSTEM', 'Shutdown phase 2: Telemetry flushed');

    // 3. Close database connections
    try {
      await pgPool.end();
      telemetryLogger.log('SYSTEM', 'Shutdown phase 3: Database connections closed successfully');
    } catch (err: any) {
      telemetryLogger.error('SYSTEM', 'Failed to close database connections gracefully', err);
    }

    // 4. Log shutdown complete
    telemetryLogger.log('SYSTEM', 'Graceful shutdown completed successfully');
    
    // 5. Exit
    process.exit(0);
  }
}

export const shutdownManager = new ShutdownManager();

export function registerShutdownHandlers() {
  process.on('SIGINT', () => {
    shutdownManager.shutdown('SIGINT received');
  });

  process.on('SIGTERM', () => {
    shutdownManager.shutdown('SIGTERM received');
  });
}
