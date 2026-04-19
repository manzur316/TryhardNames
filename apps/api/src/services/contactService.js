import 'dotenv/config';
import pb from '../config/pocketbase.js';
import logger from '../utils/logger.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class ContactService {
  validateContactData(data) {
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      throw new Error('All fields are required');
    }

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return { name, email, subject, message };
  }

  async submitContact(contactData) {
    const validatedData = this.validateContactData(contactData);

    logger.info(`Contact form submission received at ${new Date().toISOString()}`, {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      messageLength: validatedData.message.length,
    });

    // Store in PocketBase if collection exists
    try {
      await pb.collection('contact_submissions').create(validatedData, { $autoCancel: false });
      logger.info('Contact submission stored in PocketBase');
    } catch (error) {
      logger.warn('Could not store contact submission in PocketBase:', error.message);
      // Don't throw - submission is still logged
    }

    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
      },
    };
  }
}

export default new ContactService();