import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
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

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
};

export const sendOrderConfirmation = async (orderData: OrderData): Promise<boolean> => {
  try {
    // Send to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
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
      from: process.env.EMAIL_USER,
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

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    return true;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return false;
  }
}; 