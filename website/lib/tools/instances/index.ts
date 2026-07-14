import { toolRegistry } from '../registry';
import { HealthTool } from './health';
import { TimeTool } from './time';
import { EchoTool } from './echo';

// Automatically register demo tools
toolRegistry.register(HealthTool);
toolRegistry.register(TimeTool);
toolRegistry.register(EchoTool);

export { HealthTool, TimeTool, EchoTool };
