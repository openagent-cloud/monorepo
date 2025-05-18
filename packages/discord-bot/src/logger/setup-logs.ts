import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensures the logs directory exists for storing log files
 */
export function setupLogsDirectory(): void {
  const logsDir = path.join(process.cwd(), 'logs');
  
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log('Logs directory created successfully');
    } catch (error) {
      console.error('Failed to create logs directory:', error);
    }
  }
}
