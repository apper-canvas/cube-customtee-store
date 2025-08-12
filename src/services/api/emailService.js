// Mock email service for review incentive system
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock email templates
const emailTemplates = {
  reviewRequest: {
    subject: "How was your CustomTee experience? Get 10% off your next order! 📸",
    template: (orderNumber, discountCode = 'PHOTOREVIEW10') => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 24px;">CustomTee Store</h1>
            <p style="color: #64748b; margin: 8px 0 0 0;">Thank you for your recent purchase!</p>
          </div>

          <!-- Hero Section -->
          <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <h2 style="color: white; margin: 0 0 8px 0; font-size: 20px;">📸 Share Your Photos, Get Rewarded!</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">Write a review with photos and get <strong>10% off</strong> your next order</p>
          </div>

          <!-- Order Details -->
          <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #475569;"><strong>Order:</strong> #${orderNumber}</p>
            <p style="margin: 8px 0 0 0; color: #475569;"><strong>Status:</strong> Delivered</p>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 16px;">
              ⭐ Write Review & Get Discount
            </a>
            <div style="font-size: 14px; color: #64748b;">
              <p style="margin: 8px 0 0 0;">Your discount code: <strong style="color: #059669;">${discountCode}</strong></p>
              <p style="margin: 4px 0 0 0;">Valid for 30 days • Minimum purchase $25</p>
            </div>
          </div>

          <!-- Benefits -->
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px;">Why your review matters:</h3>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #10b981; margin-right: 8px;">✓</span>
              <span style="color: #475569; font-size: 14px;">Help other customers make informed decisions</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #10b981; margin-right: 8px;">✓</span>
              <span style="color: #475569; font-size: 14px;">Show off your custom design to inspire others</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="color: #10b981; margin-right: 8px;">✓</span>
              <span style="color: #475569; font-size: 14px;">Get featured in our customer gallery</span>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">CustomTee Store - Premium Custom Apparel</p>
            <p style="margin: 0;">Questions? Reply to this email or contact support@customtee.com</p>
          </div>
        </div>
      </div>
    `
  },
  
  discountConfirmation: {
    subject: "🎉 Your 10% discount is ready! Thanks for the photo review",
    template: (discountCode, expiryDate) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Discount Activated!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Thank you for your photo review</p>
            </div>
            
            <div style="border: 2px dashed #10b981; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 8px 0; color: #059669; font-size: 32px;">${discountCode}</h2>
              <p style="margin: 0; color: #475569; font-size: 16px;"><strong>10% OFF</strong> your next order</p>
              <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">Valid until ${expiryDate} • Minimum $25 purchase</p>
            </div>
            
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Shop Now & Save 10%
            </a>
          </div>
        </div>
      </div>
    `
  }
};

export const emailService = {
  async sendReviewRequest(orderNumber, customerEmail = null) {
    await delay(800); // Simulate email sending delay
    
    const template = emailTemplates.reviewRequest;
    const emailContent = template.template(orderNumber);
    
    // In a real app, this would integrate with an email service like SendGrid, Mailgun, etc.
    console.log('📧 Review Request Email Sent:', {
      to: customerEmail || 'customer@example.com',
      subject: template.subject,
      orderNumber,
      timestamp: new Date().toISOString(),
      incentive: '10% discount for photo reviews'
    });
    
    // Mock success response
    return {
      messageId: `review-${orderNumber}-${Date.now()}`,
      status: 'sent',
      incentiveCode: 'PHOTOREVIEW10',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
  },

  async sendDiscountConfirmation(customerEmail, discountCode) {
    await delay(500);
    
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const template = emailTemplates.discountConfirmation;
    const emailContent = template.template(discountCode, expiryDate);
    
    console.log('📧 Discount Confirmation Email Sent:', {
      to: customerEmail,
      subject: template.subject,
      discountCode,
      expiryDate,
      timestamp: new Date().toISOString()
    });
    
    return {
      messageId: `discount-${discountCode}-${Date.now()}`,
      status: 'sent',
      expiryDate
    };
  },

  async scheduleAutomaticReviewPrompt(orderNumber, deliveryDate) {
    await delay(300);
    
    // Calculate prompt date (3 days after delivery)
    const promptDate = new Date(deliveryDate);
    promptDate.setDate(promptDate.getDate() + 3);
    
    console.log('📅 Automatic Review Prompt Scheduled:', {
      orderNumber,
      deliveryDate,
      scheduledFor: promptDate.toISOString(),
      incentiveType: 'photo_discount'
    });
    
    return {
      scheduleId: `auto-${orderNumber}-${Date.now()}`,
      scheduledFor: promptDate.toISOString(),
      status: 'scheduled'
    };
  },

  async getEmailMetrics(dateRange = '30d') {
    await delay(200);
    
    // Mock email performance metrics
    return {
      reviewRequests: {
        sent: 1247,
        opened: 892,
        clicked: 634,
        reviewsSubmitted: 312,
        photoReviewsSubmitted: 189,
        openRate: '71.5%',
        clickRate: '50.8%',
        conversionRate: '25.0%',
        photoConversionRate: '60.6%'
      },
      discountRedemption: {
        codesIssued: 189,
        codesRedeemed: 143,
        redemptionRate: '75.7%',
        averageOrderValue: 47.83,
        additionalRevenue: 6839.69
      },
      timeline: dateRange
    };
  }
};

export default emailService;