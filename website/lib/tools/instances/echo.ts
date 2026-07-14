import { Tool } from '../types';

export const EchoTool: Tool = {
  name: 'EchoTool',
  description: 'Returns the exact validated input provided to it. Used for deterministic testing.',
  version: '1.0.0',
  riskLevel: 'safe',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      repeat: { type: 'number' }
    },
    required: ['message']
  },
  async execute(args: Record<string, unknown>) {
    const repeat = (args.repeat as number) || 1;
    const msg = args.message as string;
    return {
      echoed: Array(repeat).fill(msg).join(' ')
    };
  }
};
