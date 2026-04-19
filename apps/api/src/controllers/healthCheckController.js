import healthCheckService from '../services/healthCheckService.js';

class HealthCheckController {
  async getHealth(req, res) {
    const health = await healthCheckService.getHealthStatus();
    res.json(health);
  }
}

export default new HealthCheckController();