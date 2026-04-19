import contactService from '../services/contactService.js';
import logger from '../utils/logger.js';

class ContactController {
  async submitContact(req, res) {
    try {
      const result = await contactService.submitContact(req.body);
      res.json(result);
    } catch (error) {
      logger.error('Contact submission error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ContactController();