import express from 'express';
const router = express.Router();

import authRoutes from "./authRoutes.js"
import categoryRoutes from "./categoryRoutes.js"
import packageRoutes from "./packageRoute.js"
import testimonialRoutes from "./testimonialRoutes.js"
import blogRoutes from "./blogRoutes.js"
import ticketRoutes from "./ticketRoutes.js"
import chatRoutes from "./chatRoutes.js"
import paymentRoutes from "./paymentRoutes.js"
import favouriteRoutes from "./favoritesRoutes.js"
import couponRoutes from "./CouponRoute.js"
import adminRoutes from "./adminroutes.js"




router.use('/user', authRoutes)
router.use('/category', categoryRoutes)
router.use('/package', packageRoutes)
router.use('/testimonial', testimonialRoutes)
router.use('/blog', blogRoutes)
router.use('/ticket', ticketRoutes)
router.use('/chat', chatRoutes)
router.use('/favourite', favouriteRoutes)
router.use('/payment', paymentRoutes)
router.use('/discount', couponRoutes)
router.use('/admin',adminRoutes)



export default router;
