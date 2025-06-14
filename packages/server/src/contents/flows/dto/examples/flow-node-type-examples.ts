// Using string literals to avoid circular dependency

export const flowNodeTypeExamples = {
  flow_node_type_create_prompt: {
    summary: 'Create a prompt node type',
    value: { 
      type: 'insert',
      collection: 'flow_node_type',
      value: { 
        name: 'prompt', 
        label: 'Prompt Node',
        config_schema: { 
          type: 'object', 
          required: ['system_message'],
          properties: {
            system_message: { 
              type: 'string',
              description: 'System message for the AI model'
            },
            temperature: { 
              type: 'number',
              default: 0.7,
              description: 'Sampling temperature'
            }
          }
        }
      } 
    }
  },
  
  flow_node_type_create_function: {
    summary: 'Create a function node type',
    value: { 
      type: 'insert',
      collection: 'flow_node_type',
      value: { 
        name: 'function', 
        label: 'Function Node',
        config_schema: { 
          type: 'object', 
          required: ['function_name'],
          properties: {
            function_name: { 
              type: 'string',
              description: 'Name of the function to execute'
            },
            parameters: { 
              type: 'object',
              description: 'Function parameters',
              additionalProperties: true
            },
            retry_on_failure: {
              type: 'boolean',
              default: false,
              description: 'Whether to retry the function on failure'
            }
          }
        }
      } 
    }
  },
  
  flow_node_type_create_agent: {
    summary: 'Create an agent node type',
    value: { 
      type: 'insert',
      collection: 'flow_node_type',
      value: { 
        name: 'agent', 
        label: 'Agent Node',
        config_schema: { 
          type: 'object', 
          required: ['instructions'],
          properties: {
            instructions: { 
              type: 'string',
              description: 'Instructions for the agent'
            },
            model: {
              type: 'string',
              enum: ['gpt-4', 'claude-3', 'gemini-pro'],
              default: 'gpt-4',
              description: 'Model to use for the agent'
            },
            tools: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              },
              description: 'Tools available to the agent'
            }
          }
        }
      } 
    }
  },
  
  flow_node_type_create_conditional: {
    summary: 'Create a conditional routing node type',
    value: { 
      type: 'insert',
      collection: 'flow_node_type',
      value: { 
        name: 'conditional', 
        label: 'Conditional Node',
        config_schema: { 
          type: 'object', 
          required: ['conditions'],
          properties: {
            conditions: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  condition: { type: 'string', description: 'JavaScript expression to evaluate' },
                  output_handle: { type: 'string', description: 'Handle to route to if condition is true' }
                },
                required: ['condition', 'output_handle']
              },
              description: 'List of conditions to evaluate'
            },
            default_handle: {
              type: 'string',
              description: 'Default handle to route to if no conditions match'
            }
          }
        }
      } 
    }
  },
  
  flow_node_type_update: {
    summary: 'Update an existing node type schema',
    value: { 
      type: 'update',
      collection: 'flow_node_type',
      key: 'prompt-type-uuid',
      value: { 
        label: 'Enhanced Prompt Node',
        config_schema: { 
          type: 'object', 
          required: ['system_message'],
          properties: {
            system_message: { 
              type: 'string',
              description: 'System message for the AI model'
            },
            temperature: { 
              type: 'number', 
              default: 0.7,
              description: 'Sampling temperature'
            },
            max_tokens: { 
              type: 'number',
              default: 1000,
              description: 'Maximum tokens in response'
            }
          }
        } 
      } 
    }
  },
  
  flow_node_type_delete: {
    summary: 'Delete a node type',
    value: { 
      type: 'remove',
      collection: 'flow_node_type',
      key: 'node-type-123'
    }
  }
};
