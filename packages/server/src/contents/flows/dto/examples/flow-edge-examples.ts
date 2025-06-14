// Using string literals to avoid circular dependency

export const flowEdgeExamples = {
  flow_edge_create_standard: {
    summary: 'Create a standard edge between nodes',
    value: { 
      type: 'insert',
      collection: 'flow_edge',
      value: { 
        chart_id: 'chart-123', 
        source_node_id: 'prompt-node-uuid', 
        target_node_id: 'function-node-uuid',
        label: 'Success Path',
        source_handle: 'output',
        target_handle: 'input'
      } 
    }
  },
  
  flow_edge_create_conditional: {
    summary: 'Create a conditional edge with specific handles',
    value: { 
      type: 'insert',
      collection: 'flow_edge',
      value: { 
        chart_id: 'chart-123', 
        source_node_id: 'conditional-node-uuid', 
        target_node_id: 'agent-node-uuid',
        label: 'Urgent Cases',
        source_handle: 'urgent_support', // This matches the conditional node's output handle
        target_handle: 'input'
      } 
    }
  },
  
  flow_edge_create_fallback: {
    summary: 'Create a fallback/error path edge',
    value: { 
      type: 'insert',
      collection: 'flow_edge',
      value: { 
        chart_id: 'chart-123', 
        source_node_id: 'function-node-uuid', 
        target_node_id: 'error-handler-node-uuid',
        label: 'Error Path',
        source_handle: 'error',
        target_handle: 'input'
      } 
    }
  },
  
  flow_edge_update: {
    summary: 'Update an existing flow edge',
    value: { 
      type: 'update',
      collection: 'flow_edge',
      key: 'edge-123',
      value: { 
        label: 'Updated Path',
        source_handle: 'output-2' 
      } 
    }
  },
  
  flow_edge_delete: {
    summary: 'Delete a flow edge',
    value: { 
      type: 'remove',
      collection: 'flow_edge',
      key: 'edge-123'
    }
  }
};
