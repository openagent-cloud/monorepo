// Using string literals to avoid circular dependency

export const flowChartExamples = {
  flow_chart_create: {
    summary: 'Create a new flow chart',
    value: { 
      type: 'insert',
      collection: 'flow_chart',
      value: { name: 'My New Flow Chart' } 
    }
  },
  flow_chart_update: {
    summary: 'Update an existing flow chart',
    value: { 
      type: 'update',
      collection: 'flow_chart',
      key: 'chart-123',
      value: { name: 'Updated Chart Name' } 
    }
  },
  flow_chart_delete: {
    summary: 'Delete a flow chart',
    value: { 
      type: 'remove',
      collection: 'flow_chart',
      key: 'chart-123'
    }
  }
};
