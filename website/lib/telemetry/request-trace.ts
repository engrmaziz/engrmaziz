import { randomUUID } from 'crypto';
import { StageTelemetry, RequestTraceData } from './types';

export class RequestTrace {
  private requestId: string;
  private stages: Record<string, StageTelemetry> = {};
  private metadata: Record<string, any> = {};

  constructor(id?: string) {
    this.requestId = id || randomUUID();
  }

  getRequestId() {
    return this.requestId;
  }

  startStage(name: string) {
    this.stages[name] = {
      stageName: name,
      startTime: Date.now(),
      endTime: 0,
      durationMs: 0,
      success: false
    };
  }

  endStage(name: string, success: boolean = true, error?: string) {
    const stage = this.stages[name];
    if (stage) {
      stage.endTime = Date.now();
      stage.durationMs = stage.endTime - stage.startTime;
      stage.success = success;
      if (error) {
        stage.error = error;
      }
    }
  }

  attachMetadata(key: string, value: any) {
    this.metadata[key] = value;
  }

  exportTrace(): RequestTraceData {
    return {
      requestId: this.requestId,
      metadata: this.metadata,
      stages: this.stages
    };
  }
}
