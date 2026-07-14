import { Tool } from '../types';

export const TimeTool: Tool = {
  name: 'TimeTool',
  description: 'Returns the current UTC time, Local time, and Timezone context.',
  version: '1.0.0',
  riskLevel: 'safe',
  schema: {
    type: 'object',
    properties: {
      timezone: { type: 'string' }
    },
    required: []
  },
  async execute(args: Record<string, unknown>) {
    const d = new Date();
    return {
      utc: d.toUTCString(),
      local: d.toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
};
