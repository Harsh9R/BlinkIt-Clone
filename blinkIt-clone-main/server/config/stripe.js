import stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

// Debug: Log environment variables
console.log('Environment variables loaded:', {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing',
    FRONTEND_URL: process.env.FRONTEND_URL
})

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

// Initialize Stripe with explicit API version
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true
})

// Test the Stripe instance
Stripe.balance.retrieve()
    .then(() => console.log('Stripe connection successful'))
    .catch(err => console.error('Stripe connection failed:', err))

export default Stripe