const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter using SMTP with more specific Gmail settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Show debug output
  logger: true // Log information into the console
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
    console.log('Using email account:', process.env.EMAIL_USER);
  }
});

// Helper function to validate email format
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
};

// Function to send email
const sendEmail = async (options) => {
  try {
    // Check if options is a string (old format: to, subject, html)
    if (typeof options === 'string') {
      const [to, subject, html] = arguments;
      options = { to, subject, html };
    }
    
    const { to, subject, html, text } = options;
    
    console.log(`Sending email to ${to} with subject: ${subject}`);
    
    // Validate email format
    if (!validateEmail(to)) {
      console.error('Invalid recipient email format:', to);
      return false;
    }
    
    // Create mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html
    };
    
    // Add text version if provided
    if (text) {
      mailOptions.text = text;
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Contact form endpoint
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  console.log('Contact form submission received:', { name, email });

  if (!email || !name || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields (name, email, or message)'
    });
  }

  try {
    // Send email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #2196F3; padding: 10px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      </div>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Contact Form Submission',
      adminEmailHtml
    );

    // Send confirmation to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #4CAF50; padding: 10px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">Thank you for contacting us!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you soon.</p>
          <p>Best regards,<br>Kitabey Team</p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      'Thank you for contacting Kitabey',
      userEmailHtml
    );

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in contact form:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Order confirmation email
router.post('/orders', async (req, res) => {
  try {
    console.log('Order endpoint called with data:', req.body);
    
    // Validate required fields
    const { customerName, customerEmail, items, totalAmount, shippingAddress, orderId } = req.body;
    
    if (!customerName || !customerEmail || !items || items.length === 0 || !totalAmount || !shippingAddress) {
      console.error('Missing required fields for order confirmation', {
        customerName: Boolean(customerName),
        customerEmail: Boolean(customerEmail),
        items: Boolean(items) && items.length > 0,
        totalAmount: Boolean(totalAmount),
        shippingAddress: Boolean(shippingAddress)
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields for order confirmation' 
      });
    }
    
    // Validate email
    if (!validateEmail(customerEmail)) {
      console.error('Invalid email format:', customerEmail);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    // Generate order HTML
    const orderItems = items.map(item => 
      `<tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');
    
    // Customer order confirmation
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Confirmation</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for your order. We have received your purchase and are processing it now.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderId || `ORD-${Date.now()}`}</p>
        <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #f7f7f7;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-top: 1px solid #ddd;"><strong>Total:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #ddd;"><strong>₹${totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        <p>If you have any questions about your order, please contact us at <a href="mailto:${process.env.ADMIN_EMAIL}">support@kitabey.com</a>.</p>
        <p>Thank you for shopping with us!</p>
        <p>Kitabey E-commerce Team</p>
      </div>
    `;
    
    // Admin notification
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Order Received</h1>
        <p>A new order has been placed.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderId || `ORD-${Date.now()}`}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #f7f7f7;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-top: 1px solid #ddd;"><strong>Total:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #ddd;"><strong>₹${totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
    
    console.log('Attempting to send email to customer:', customerEmail);
    
    // Send confirmation to customer
    await sendEmail({
      to: customerEmail,
      subject: 'Order Confirmation',
      html: customerHtml,
      text: `Order Confirmation\n\nDear ${customerName},\n\nThank you for your order. We have received your purchase and are processing it now.\n\nOrder ID: ${orderId || `ORD-${Date.now()}`}\nShipping Address: ${shippingAddress}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}`
    });
    
    console.log('Customer email sent successfully');
    
    // Send notification to admin
    if (process.env.ADMIN_EMAIL) {
      console.log('Sending notification to admin:', process.env.ADMIN_EMAIL);
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: 'New Order Received',
        html: adminHtml,
        text: `New Order Received\n\nA new order has been placed.\n\nOrder ID: ${orderId || `ORD-${Date.now()}`}\nCustomer: ${customerName} (${customerEmail})\nShipping Address: ${shippingAddress}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}`
      });
      console.log('Admin notification sent successfully');
    }
    
    return res.json({ 
      success: true, 
      message: 'Order confirmation sent successfully' 
    });
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error sending order confirmation' 
    });
  }
});

// Test endpoint to check email configuration
router.get('/test-email-config', (req, res) => {
  res.json({
    emailUser: process.env.EMAIL_USER ? 'Configured' : 'Missing',
    adminEmail: process.env.ADMIN_EMAIL ? 'Configured' : 'Missing',
    emailPassword: process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Missing'
  });
});

// Test route for order confirmation emails with any email
router.get('/test-order-email', async (req, res) => {
  try {
    const testEmail = req.query.email;
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address in the query parameter ?email=test@example.com'
      });
    }
    
    console.log('Testing order confirmation email to:', testEmail);
    
    // Test data
    const testOrderData = {
      orderId: `TEST-ORD-${Date.now()}`,
      customerName: 'Test Customer',
      customerEmail: testEmail,
      shippingAddress: '123 Test Street, Test City, Test State 12345, Test Country',
      items: [
        {
          name: 'Test Book 1',
          quantity: 2,
          price: 299
        },
        {
          name: 'Test Book 2',
          quantity: 1,
          price: 499
        }
      ],
      totalAmount: 1097
    };
    
    // Generate customer email HTML
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #4CAF50; padding: 10px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">Order Confirmation</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${testOrderData.customerName},</p>
          <p><strong>Thank you for your order!</strong> Your order has been successfully placed and will be processed shortly.</p>
          <p><strong>Order ID:</strong> ${testOrderData.orderId}</p>
          
          <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
            </tr>
            ${testOrderData.items.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border: 1px solid #eee;">
            <p><strong>Total Amount:</strong> ₹${testOrderData.totalAmount}</p>
            <p><strong>Shipping Address:</strong> ${testOrderData.shippingAddress}</p>
          </div>
          
          <p style="margin-top: 20px;">We will process your order shortly and send you a delivery confirmation email.</p>
          <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 0.9em;">
            <p>This is a TEST email for development purposes.</p>
            <p>© 2023 Kitabey Bookstore. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
    
    // Send test customer email
    const customerEmailSent = await sendEmail(
      testEmail,
      `[TEST] Your Kitabey Order Confirmation - ${testOrderData.orderId}`,
      customerEmailHtml
    );
    
    if (!customerEmailSent) {
      throw new Error(`Failed to send test email to ${testEmail}`);
    }
    
    res.json({ 
      success: true, 
      message: `Test order email sent to ${testEmail}. Please check your email (including spam folder).` 
    });
  } catch (error) {
    console.error('Error sending test order email:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send test order email' 
    });
  }
});

// Newsletter subscription endpoint
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  
  console.log('Newsletter subscription received:', { email });

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  try {
    // Send confirmation to subscriber
    const subscriberHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background: linear-gradient(90deg, #FF3366, #FF6B6B); padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">Thank You for Subscribing!</h2>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p>Hello,</p>
          <p>Thank you for subscribing to our newsletter. You'll now receive updates on our latest book releases, exclusive deals, and special promotions.</p>
          
          <div style="background-color: #f8f8f8; border-left: 4px solid #FF3366; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;">Stay tuned for our next update!</p>
          </div>
          
          <p>If you did not sign up for this newsletter, please disregard this email.</p>
          
          <p>Best regards,<br>Kitabey Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
            <p>© ${new Date().getFullYear()} Kitabey. All rights reserved.</p>
            <p>If you wish to unsubscribe from our newsletter in the future, please reply to this email with "UNSUBSCRIBE" in the subject line.</p>
          </div>
        </div>
      </div>
    `;

    const emailSent = await sendEmail({
      to: email,
      subject: 'Welcome to Kitabey Newsletter',
      html: subscriberHtml
    });

    if (!emailSent) {
      throw new Error('Failed to send confirmation email');
    }

    // Notify admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #2196F3; padding: 10px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">New Newsletter Subscription</h2>
        </div>
        <div style="padding: 20px;">
          <p>A new user has subscribed to the newsletter:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscription',
      html: adminHtml
    });

    res.json({ 
      success: true, 
      message: 'Subscription successful! Please check your email for confirmation.' 
    });
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process subscription. Please try again later.' 
    });
  }
});

module.exports = router; 