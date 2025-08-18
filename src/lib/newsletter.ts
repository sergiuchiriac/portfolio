'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { EmailTemplate } from '../components/emails/newsletter-template'
import { redis } from './redis'
import { DATA } from '../data/resume'


const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function joinWaitlist(prevState: any, formData: FormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const email = formData.get('email')
    
    if (!email) {
      return { success: false, message: 'Email is required' }
    }
    
    const result = schema.safeParse({ email })
    
    if (!result.success) {
      return { success: false, message: result.error.issues[0].message }
    }

    // Check if email already exists in waitlist
    if (!redis) {
      return { success: false, message: 'Database not configured. Please try again later.' }
    }
    
    try {
      const exists = await redis.sismember('newsletter_emails', email.toString())
      if (exists) {
        return { success: false, message: 'This email is already on the newsletter!' }
      }
    } catch (redisError) {
      console.error('Redis error checking email:', redisError)
      return { success: false, message: 'Failed to check email. Please try again.' }
    }

    // Store email in Upstash Redis
    try {
      await redis.sadd('waitlist_emails', email.toString())
    } catch (redisError) {
      console.error('Redis error:', redisError)
      return { success: false, message: 'Failed to store email. Please try again.' }
    }

    // Send welcome email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Sergiu <support@thedirectori.es>',
      to: email.toString(),
      subject: 'Welcome to My Newsletter!',
      html: EmailTemplate({ email: email.toString() }),
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, message: 'Failed to join waitlist. Please try again.' }
    }

    const count = await getWaitlistCount()

    return { 
      success: true, 
      message: 'You have been added to the newsletter! Check your email for confirmation.',
      count
    }
  } catch (error) {
    console.error('Error:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }
  }
}

export async function getWaitlistCount() {
  try {
    if (!redis) {
      return 0
    }
    const count = await redis.scard('waitlist_emails')
    return count
  } catch (error) {
    console.error('Error getting waitlist count:', error)
    return 0
  }
}

// Client-side compatible function for newsletter signup
export async function joinNewsletter(email: string) {
  try {
    // Use current origin for local development, fallback to DATA.url for production
    const response = await fetch(`${DATA.url}/api/newsletter?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return { 
        success: false, 
        message: `Server error: ${response.status}. Please try again later.` 
      };
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error joining newsletter:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }
  }
}
