import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Log Razorpay credentials (without exposing secrets)
console.log('Initializing Razorpay with key_id:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET available:', !!process.env.RAZORPAY_KEY_SECRET);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

export default razorpayInstance;
