import express from 'express';
import { createOrder, getBookingSummary } from "../payment/orderController.js"
import { verifyRole, verifyToken } from '../middleware/authMiddleware.js';
import { getPaymentDetailsByUser, getPayments, verifyPayment } from '../payment/paymentController.js';

const router = express.Router();

router.post('/order',verifyToken,createOrder); 




//Verify the payments
router.post('/verify',verifyToken, verifyPayment);
router.get('/',verifyToken, getPayments);

router.get("/bookings/:userId/summary",verifyToken, getBookingSummary);
router.get('/transactions/:userId',verifyToken, getPaymentDetailsByUser);
export default router;
