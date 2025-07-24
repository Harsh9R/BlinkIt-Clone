import { Router } from 'express';
import auth from '../middleware/auth.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlist.controller.js';

const wishlistRouter = Router();

// Protected routes - require authentication
wishlistRouter.post("/add", auth, addToWishlist);
wishlistRouter.post("/remove", auth, removeFromWishlist);
wishlistRouter.get("/get", auth, getWishlist);

export default wishlistRouter; 