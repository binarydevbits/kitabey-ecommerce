import express from 'express';
import { sendContactEmail, sendOrderConfirmation } from '../services/emailService';

const router = express.Router();

// Test endpoint to verify email configuration
router.get('/test', async (req, res) => {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email to verify the email configuration.'
    };

    const success = await sendContactEmail(testData);
    
    if (success) {
      res.json({ message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test email' });
    }
  } catch (error) {
    console.error('Error in test email endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const success = await sendContactEmail({ name, email, subject, message });
    
    if (success) {
      res.json({ message: 'Email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Error in contact email endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/order-confirmation', async (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData.orderId || !orderData.customerName || !orderData.customerEmail || 
        !orderData.items || !orderData.totalAmount || !orderData.shippingAddress) {
      return res.status(400).json({ error: 'Missing required order information' });
    }

    const success = await sendOrderConfirmation(orderData);
    
    if (success) {
      res.json({ message: 'Order confirmation emails sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send order confirmation emails' });
    }
  } catch (error) {
    console.error('Error in order confirmation endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 