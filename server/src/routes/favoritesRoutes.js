import express from 'express';
import {
  addFavorite,
  getFavoritesByUser,
  removeFavorite,
  getUsersByPackage,
} from '../controllers/favoriteController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',verifyToken, addFavorite); 
router.get('/user/:userId',verifyToken, getFavoritesByUser);
router.post('/delete',verifyToken, removeFavorite); 
router.get('/package/:packageId',verifyToken, getUsersByPackage); 

export default router;
