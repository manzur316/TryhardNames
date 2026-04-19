export class ApiError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = Date.now();
  }
}

export const errorService = {
  getErrorMessage(error) {
    if (error instanceof ApiError) {
      return this._getApiErrorMessage(error.code) || error.message;
    }
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      return 'Network error. Please check your internet connection.';
    }

    return error?.message || 'An unexpected error occurred. Please try again.';
  },

  _getApiErrorMessage(code) {
    const messages = {
      'NETWORK_ERROR': 'Unable to connect to the server. Please check your connection.',
      'TIMEOUT_ERROR': 'The request took too long to complete. Please try again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'AUTH_ERROR': 'Your session has expired. Please log in again.',
      'NOT_FOUND': 'The requested resource could not be found.',
      'SERVER_ERROR': 'Our servers are currently experiencing issues. Please try again later.',
      'RATE_LIMIT': 'You have made too many requests. Please wait a moment.'
    };
    return messages[code] || null;
  },

  _getHttpErrorMessage(statusCode) {
    if (statusCode === 400) return 'VALIDATION_ERROR';
    if (statusCode === 401 || statusCode === 403) return 'AUTH_ERROR';
    if (statusCode === 404) return 'NOT_FOUND';
    if (statusCode === 429) return 'RATE_LIMIT';
    if (statusCode >= 500) return 'SERVER_ERROR';
    return 'UNKNOWN_ERROR';
  },

  createApiError(error, defaultMessage = 'An error occurred') {
    if (error instanceof ApiError) return error;

    let code = 'UNKNOWN_ERROR';
    let statusCode = 500;
    let message = defaultMessage;

    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      code = 'NETWORK_ERROR';
      statusCode = 0;
      message = 'Network connection failed';
    } else if (error.response) {
      statusCode = error.response.status || 500;
      code = this._getHttpErrorMessage(statusCode);
      message = error.response.data?.message || error.message || defaultMessage;
    } else if (error.code === 'ECONNABORTED') {
      code = 'TIMEOUT_ERROR';
      statusCode = 408;
      message = 'Request timed out';
    }

    return new ApiError(message, code, statusCode, error);
  },

  logError(error, context = {}) {
    const apiError = this.createApiError(error);
    console.error(`[ErrorService] ${apiError.code} (${apiError.statusCode}):`, {
      message: apiError.message,
      context,
      original: apiError.originalError,
      timestamp: new Date(apiError.timestamp).toISOString()
    });
    // Here you could integrate with Sentry, LogRocket, etc.
  }
};