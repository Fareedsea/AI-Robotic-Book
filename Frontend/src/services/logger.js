/**
 * Simple Logging Service for Book Generation
 * Provides logging capabilities for the book generation process
 */

class Logger {
  constructor() {
    this.logs = [];
    this.level = 'info'; // debug, info, warn, error
  }

  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {Object} metadata - Optional metadata
   */
  debug(message, metadata = {}) {
    if (this.isLevelEnabled('debug')) {
      this.log('debug', message, metadata);
    }
  }

  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {Object} metadata - Optional metadata
   */
  info(message, metadata = {}) {
    if (this.isLevelEnabled('info')) {
      this.log('info', message, metadata);
    }
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {Object} metadata - Optional metadata
   */
  warn(message, metadata = {}) {
    if (this.isLevelEnabled('warn')) {
      this.log('warn', message, metadata);
    }
  }

  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {Object} metadata - Optional metadata
   */
  error(message, metadata = {}) {
    if (this.isLevelEnabled('error')) {
      this.log('error', message, metadata);
    }
  }

  /**
   * Internal logging method
   * @param {string} level - The log level
   * @param {string} message - The message to log
   * @param {Object} metadata - Optional metadata
   */
  log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata
    };

    // Store in memory
    this.logs.push(logEntry);

    // Output to console
    const consoleMethod = level === 'error' ? 'error' :
                         level === 'warn' ? 'warn' :
                         level === 'debug' ? 'debug' : 'log';

    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, metadata);
  }

  /**
   * Check if a log level is enabled
   * @param {string} level - The level to check
   * @returns {boolean} True if the level is enabled
   */
  isLevelEnabled(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.level];
  }

  /**
   * Set the log level
   * @param {string} level - The level to set
   */
  setLevel(level) {
    if (['debug', 'info', 'warn', 'error'].includes(level)) {
      this.level = level;
    }
  }

  /**
   * Get all logs
   * @returns {Array} Array of log entries
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Log book generation specific events
   */
  logChapterGeneration(title, status, details = {}) {
    this.info(`Chapter generation ${status}`, {
      chapter: title,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  logBookBuild(status, details = {}) {
    this.info(`Book build ${status}`, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  logDeployment(status, details = {}) {
    this.info(`Deployment ${status}`, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }
}

// Export the logger instance
const logger = new Logger();
export default logger;