const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendContactEmail = async (formData) => {
  try {
    console.log('Attempting to send contact email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', process.env.ADMIN_EMAIL);

    const mailOptions = {
      from: `"Kitabey Books" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
};

const sendOrderConfirmation = async (orderData) => {
  try {
    console.log('Attempting to send order confirmation emails...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('Admin To:', process.env.ADMIN_EMAIL);
    console.log('Customer To:', orderData.customerEmail);

    // Send to admin
    const adminMailOptions = {
      from: `"Kitabey Books" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received: ${orderData.orderId}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
        <p><strong>Customer Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Shipping Address:</strong> ${orderData.shippingAddress}</p>
        <h3>Order Items:</h3>
        <ul>
          ${orderData.items.map(item => `
            <li>${item.name} x ${item.quantity} - $${item.price}</li>
          `).join('')}
        </ul>
        <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
      `
    };

    // Send to customer
    const customerMailOptions = {
      from: `"Kitabey Books" <${process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation: ${orderData.orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${orderData.customerName},</p>
        <p>Your order has been received and is being processed.</p>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <h3>Order Details:</h3>
        <ul>
          ${orderData.items.map(item => `
            <li>${item.name} x ${item.quantity} - $${item.price}</li>
          `).join('')}
        </ul>
        <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
        <p><strong>Shipping Address:</strong> ${orderData.shippingAddress}</p>
        <p>We'll send you another email when your order ships.</p>
      `
    };

    const [adminInfo, customerInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log('Admin email sent successfully:', adminInfo.messageId);
    console.log('Customer email sent successfully:', customerInfo.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return false;
  }
};

module.exports = {
  sendContactEmail,
  sendOrderConfirmation
}; 