// Using string literals to avoid circular dependency

export const flowNodeExamples = {
  flow_node_create_prompt: {
    summary: 'Create a prompt node',
    value: { 
      type: 'insert',
      collection: 'flow_node',
      value: { 
        chart_id: 'chart-123', 
        label: 'Initial Prompt', 
        type_id: 'prompt-type-uuid',  // Reference to the 'prompt' node type
        data: { 
          system_message: 'You are a helpful assistant specialized in customer support', 
          temperature: 0.7 
        },
        x: 150, 
        y: 250 
      } 
    }
  },
  
  flow_node_create_function: {
    summary: 'Create a function node',
    value: { 
      type: 'insert',
      collection: 'flow_node',
      value: { 
        chart_id: 'chart-123', 
        label: 'Get Customer Data', 
        type_id: 'function-type-uuid',  // Reference to the 'function' node type
        data: { 
          function_name: 'fetchCustomerDetails', 
          parameters: {
            customerId: '{{input.customer_id}}',
            includeHistory: true
          },
          retry_on_failure: true
        },
        x: 350, 
        y: 250 
      } 
    }
  },
  
  flow_node_create_agent: {
    summary: 'Create an agent node',
    value: { 
      type: 'insert',
      collection: 'flow_node',
      value: { 
        chart_id: 'chart-123', 
        label: 'Support Agent', 
        type_id: 'agent-type-uuid',  // Reference to the 'agent' node type
        data: { 
          instructions: 'Analyze the customer issue and determine the best course of action. Use available tools to gather information.', 
          model: 'gpt-4',
          tools: [
            { name: 'search_knowledge_base', description: 'Search the support knowledge base' },
            { name: 'check_order_status', description: 'Check order status by ID' }
          ]
        },
        x: 550, 
        y: 250 
      } 
    }
  },
  
  flow_node_create_conditional: {
    summary: 'Create a conditional routing node',
    value: { 
      type: 'insert',
      collection: 'flow_node',
      value: { 
        chart_id: 'chart-123', 
        label: 'Route Issue', 
        type_id: 'conditional-type-uuid',  // Reference to the 'conditional' node type
        data: { 
          conditions: [
            { 
              condition: 'input.category === "billing"', 
              output_handle: 'billing_team' 
            },
            { 
              condition: 'input.urgent === true', 
              output_handle: 'urgent_support' 
            }
          ],
          default_handle: 'standard_support'
        },
        x: 750, 
        y: 250 
      } 
    }
  },
  
  flow_node_update: {
    summary: 'Update an existing flow node',
    value: { 
      type: 'update',
      collection: 'flow_node',
      key: 'node-123',
      value: { 
        label: 'Updated Process', 
        x: 200, 
        y: 300,
        data: { params: { input: 'updated-input' } } 
      } 
    }
  },
  
  flow_node_delete: {
    summary: 'Delete a flow node',
    value: { 
      type: 'remove',
      collection: 'flow_node',
      key: 'node-123'
    }
  }
};
