import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { EmailTemplate } from '../../../components/emails/newsletter-template'
import { redis } from '../../../lib/redis'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

// Add GET method for debugging
export async function GET(request: NextRequest) {
  console.log('GET request received to /api/newsletter');
  
  // Get email from query parameters
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  console.log('Email received:', email);
  
  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email is required' },
      { status: 400 }
    )
  }
  
  const result = schema.safeParse({ email })
  
  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0].message },
      { status: 400 }
    )
  }

  // Check if email already exists in newsletter
  if (!redis) {
    console.log('Redis not configured - running in local development mode');
    // For local development, just return success without storing
    return NextResponse.json({ 
      success: true, 
      message: 'Newsletter signup successful! (Local development mode - email not stored)'
    })
  }
  
  try {
    const exists = await redis.sismember('newsletter_emails', email)
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'This email is already on the newsletter!' },
        { status: 400 }
      )
    }
  } catch (redisError) {
    console.error('Redis error checking email:', redisError)
    return NextResponse.json(
      { success: false, message: 'Failed to check email. Please try again.' },
      { status: 500 }
    )
  }

  // Store email in Upstash Redis
  try {
    await redis.sadd('newsletter_emails', email)
  } catch (redisError) {
    console.error('Redis error:', redisError)
    return NextResponse.json(
      { success: false, message: 'Failed to store email. Please try again.' },
      { status: 500 }
    )
  }

  // Send welcome email using Resend
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: 'Sergiu <support@thedirectori.es>',
    to: email,
    subject: 'Welcome to My Newsletter!',
    html: EmailTemplate({ email }),
  })

  if (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to join newsletter. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ 
    success: true, 
    message: 'You have been added to the newsletter! Check your email for confirmation.'
  })
}

export async function POST(request: NextRequest) {
  console.log('POST request received to /api/newsletter');
  try {
    const body = await request.json()
    const { email } = body
    
    console.log('Email received:', email);
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }
    
    const result = schema.safeParse({ email })
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    // Check if email already exists in newsletter
    if (!redis) {
      console.log('Redis not configured - running in local development mode');
      // For local development, just return success without storing
      return NextResponse.json({ 
        success: true, 
        message: 'Newsletter signup successful! (Local development mode - email not stored)'
      })
    }
    
    try {
      const exists = await redis.sismember('newsletter_emails', email)
      if (exists) {
        return NextResponse.json(
          { success: false, message: 'This email is already on the newsletter!' },
          { status: 400 }
        )
    }
    } catch (redisError) {
      console.error('Redis error checking email:', redisError)
      return NextResponse.json(
        { success: false, message: 'Failed to check email. Please try again.' },
        { status: 500 }
      )
    }

    // Store email in Upstash Redis
    try {
      await redis.sadd('newsletter_emails', email)
    } catch (redisError) {
      console.error('Redis error:', redisError)
      return NextResponse.json(
        { success: false, message: 'Failed to store email. Please try again.' },
        { status: 500 }
      )
    }

    // Send welcome email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: 'Sergiu <support@thedirectori.es>',
      to: email,
      subject: 'Welcome to My Newsletter!',
      html: EmailTemplate({ email }),
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to join newsletter. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'You have been added to the newsletter! Check your email for confirmation.'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 