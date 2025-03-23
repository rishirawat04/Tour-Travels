import express from 'express';
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getReviews,
} from '../controllers/testimonialController.js';
import { verifyRole, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',verifyToken, createTestimonial); 
router.get('/getAllReview', getReviews); 
router.get('/', getAllTestimonials); 
router.get('/:id', getTestimonialById);  
router.put('/:id',verifyToken, verifyRole("admin"), updateTestimonial);  
router.delete('/:id',verifyToken, verifyRole("admin"), deleteTestimonial); 
router.get('/getAllReview', getReviews); 

export default router;
