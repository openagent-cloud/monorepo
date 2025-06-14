import { Tool } from '@openai/agents';

/**
 * Interface for agent run results
 */
export interface AgentRunResult {
  output: string;
  runId: string;
  metadata?: Record<string, any>;
}

