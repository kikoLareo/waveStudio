import api from '../services/api';

const logService = {
  /**
   * Safely converts any value to a string representation
   */
  safeStringify: (value: any): string => {
    try {
      if (value === undefined) return 'undefined';
      if (value === null) return 'null';
      if (typeof value === 'function') return '[Function]';
      if (typeof value === 'symbol') return value.toString();
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Error) {
        return JSON.stringify({
          name: value.name,
          message: value.message,
          stack: value.stack
        });
      }
      if (typeof value === 'object') {
        const seen = new WeakSet();
        return JSON.stringify(value, (key, val) => {
          if (typeof val === 'object' && val !== null) {
            if (seen.has(val)) return '[Circular]';
            seen.add(val);
          }
          return val;
        });
      }
      return String(value);
    } catch {
      return '[Unable to stringify value]';
    }
  },

  /**
   * Safely processes metadata to ensure it's serializable
   */
  processMetadata: (meta: Record<string, any>): Record<string, string> => {
    const processed: Record<string, string> = {};
    
    try {
      Object.entries(meta).forEach(([key, value]) => {
        // Skip undefined values
        if (value === undefined) return;
        
        // Convert value to safe string representation
        processed[key] = logService.safeStringify(value);
      });
    } catch (error) {
      processed.error = 'Error processing metadata';
      processed.details = logService.safeStringify(error);
    }

    return processed;
  },

  /**
   * Sends a log to the backend.
   * @param {string} level - Log level (info, warning, error, etc.)
   * @param {string} message - Log message
   * @param {object} meta - Optional metadata (user, transaction, etc.)
   */
  log: async (level: string, message: string, meta: Record<string, any> = {}): Promise<void> => {
    // Ensure level is valid
    const validLevel = ['info', 'warn', 'error', 'debug'].includes(level) ? level : 'info';

    try {
      // Process metadata safely
      const processedMeta = logService.processMetadata(meta);

      // Create safe log entry
      const logEntry = {
        level: validLevel,
        message: logService.safeStringify(message),
        timestamp: new Date().toISOString(),
        meta: processedMeta
      };

      // In development, log to console
      if (import.meta.env.DEV) {
        const consoleMethod = validLevel === 'error' ? 'error' : 'log';
        console[consoleMethod](message, processedMeta);
      }

      // Only send to backend in production
      if (!import.meta.env.DEV) {
        await api.post('/logs', logEntry).catch(error => {
          console.error('Failed to send log to server:', logService.safeStringify(error));
        });
      }
    } catch (error) {
      // Last resort error handling
      if (import.meta.env.DEV) {
        console.error('Logging failed:', logService.safeStringify(error));
      }
    }
  }
};

export default logService;