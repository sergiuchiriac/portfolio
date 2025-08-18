interface EmailTemplateProps {
  email: string
}

export function EmailTemplate({ email }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to My Newsletter</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Welcome to My Newsletter!</h1>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            Thank you for subscribing to my newsletter. I've received your email address (${email}) and will keep you updated on my latest content and insights.
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            I'm excited to share valuable information and updates with you!
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">Best regards,</p>
          <p style="color: #111827; font-size: 16px; font-weight: 500;">Sergiu</p>
        </div>
      </body>
    </html>
  `
}
