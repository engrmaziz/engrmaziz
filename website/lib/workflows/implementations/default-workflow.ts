import { BaseWorkflow } from '../base-workflow';
import { WorkflowContext, WorkflowResult, WorkflowStep } from '../types';
import { agentRouter } from '../../agents/router';

export class DefaultWorkflow extends BaseWorkflow {
  public name = 'default-workflow';

  constructor() {
    super();
    this.steps = [
      {
        name: 'DelegateToAgentRouter',
        execute: async (context: WorkflowContext): Promise<WorkflowResult> => {
          // Pass the identical AgentContext down to the AgentRouter
          const agent = agentRouter.route(context.agentCtx);
          
          // Execute exactly as it was executed before this Workflow abstraction existed
          const response = await agent.execute(context.agentCtx);
          
          return { response };
        }
      }
    ];
  }
}
