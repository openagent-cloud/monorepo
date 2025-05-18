# Token Analytics Module

This module provides comprehensive token usage analytics for AI service requests. It tracks and analyzes token usage across different services, models, and time periods, providing valuable insights into usage patterns and cost estimation.

## Features

- **Token Usage Tracking**: Track prompt, completion, and total tokens across all AI service requests
- **Time-Based Analysis**: View token usage trends over time with daily breakdowns
- **Model-Specific Metrics**: Analyze which models are used most frequently and their token consumption
- **Service Comparison**: Compare token usage across different AI services (OpenAI, Anthropic, Cohere)
- **Cost Estimation**: Get estimated costs based on current pricing models for different AI services

## API Endpoints

### GET /analytics/tokens

Returns detailed token usage analytics for the authenticated tenant.

**Query Parameters:**

- `days` (optional): Number of days to analyze (default: 30)

**Headers:**

- `x-api-key`: Tenant API key (required)

**Response Example:**

```json
{
  "summary": {
    "totalTokens": 125000,
    "promptTokens": 25000,
    "completionTokens": 100000,
    "estimatedCost": 1.25,
    "timeframe": {
      "startDate": "2025-04-18T00:00:00.000Z",
      "endDate": "2025-05-18T00:00:00.000Z",
      "days": 30
    }
  },
  "byModel": [
    {
      "model": "gpt-4",
      "promptTokens": 15000,
      "completionTokens": 60000,
      "totalTokens": 75000,
      "requestCount": 150
    },
    {
      "model": "gpt-3.5-turbo",
      "promptTokens": 10000,
      "completionTokens": 40000,
      "totalTokens": 50000,
      "requestCount": 300
    }
  ],
  "byDay": [
    {
      "date": "2025-04-18",
      "promptTokens": 800,
      "completionTokens": 3200,
      "totalTokens": 4000,
      "requestCount": 15
    }
    // Additional days...
  ],
  "byService": {
    "openai": {
      "promptTokens": 20000,
      "completionTokens": 80000,
      "totalTokens": 100000,
      "requestCount": 400,
      "models": ["gpt-4", "gpt-3.5-turbo"]
    },
    "anthropic": {
      "promptTokens": 5000,
      "completionTokens": 20000,
      "totalTokens": 25000,
      "requestCount": 50,
      "models": ["claude-2"]
    }
  }
}
```

## Usage with Makefile

The following Makefile commands are available for working with analytics:

```bash
# Run database migrations for analytics schema
make analytics:migrate

# Seed the database with sample data for testing analytics
make analytics:seed

# Generate a token usage report for the last 30 days
make analytics:report
```

## Integration with Visualization Tools

The data structure returned by the analytics API is designed to be easily integrated with visualization libraries such as Chart.js, D3.js, or Recharts. The time-series data in the `byDay` field is particularly useful for creating trend charts.

## Future Enhancements

- **Custom Date Ranges**: Allow specifying custom start and end dates for analytics
- **Export Functionality**: Add CSV/Excel export for analytics data
- **Real-time Analytics**: Implement WebSocket support for real-time token usage monitoring
- **Anomaly Detection**: Add algorithms to detect unusual token usage patterns
- **Budget Alerts**: Implement notification system for when token usage exceeds predefined thresholds
