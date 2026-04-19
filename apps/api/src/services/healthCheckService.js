import logger from '../utils/logger.js';

class HealthCheckService {
  async getHealthStatus() {
    logger.info('Health check requested');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

export default new HealthCheckService();