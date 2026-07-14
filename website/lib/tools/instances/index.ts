import { toolRegistry } from '../registry';
import { HealthTool } from './health';
import { TimeTool } from './time';
import { EchoTool } from './echo';

// Removed automatic registration. Handled by system/startup.ts

export { HealthTool, TimeTool, EchoTool };
