interface PurchaseEmailTemplateProps {
  email: string
  amount: number
}

const PurchaseEmailTemplate = ({ email, amount }: PurchaseEmailTemplateProps) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Congratulations! Your Payment is Confirmed</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 20px; background-color: #f9fafb;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #111827; font-size: 28px; margin: 0; font-weight: 700;">🎉 Congratulations!</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">Your payment has been confirmed!</p>
          </div>
          
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #374151; font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">Order Details</h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Product:</span>
              <span style="color: #111827; font-weight: 500;">1-to-1 Consulting Session</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Amount:</span>
              <span style="color: #111827; font-weight: 500;">$${(amount / 100).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Email:</span>
              <span style="color: #111827; font-weight: 500;">${email}</span>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: white; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">🎉 Congratulations & Welcome!</h3>
            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; line-height: 1.5;">
              You've successfully purchased a 1-to-1 consulting session! I'm excited to work with you and help you achieve your goals.
            </p>
          </div>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #92400e; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">📅 Next Step: Book Your Session</h3>
            <p style="color: #92400e; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
              Let's book your 1-to-1 consulting session. Follow this link to schedule a time that works best for you:
            </p>
            <div style="text-align: center; margin: 16px 0;">
              <a href="https://cal.com/sergiu-chiriac/1-to-1-consulting" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Book Your Session</a>
            </div>
            <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5; font-weight: 500;">
              <strong>Or copy and paste this link: https://cal.com/sergiu-chiriac/1-to-1-consulting</strong>
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="color: #111827; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">What's Next?</h3>
            <ul style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Book your preferred time slot using the link above</li>
              <li>Prepare any questions or topics you'd like to discuss</li>
              <li>Receive a calendar confirmation and meeting details</li>
            </ul>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Questions? I'm here to help!</p>
            <p style="color: #111827; font-size: 14px; margin: 0; font-weight: 500;">Sergiu Chiriac</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export default PurchaseEmailTemplate
