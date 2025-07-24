import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getUserReviews
} from '../controllers/review.controller.js';

const router = Router();

// Protected routes (require authentication)
router.use(verifyJWT);

// Create a new review
router.post('/', createReview);

// Update a review
router.put('/:reviewId', updateReview);

// Delete a review
router.delete('/:reviewId', deleteReview);

// Get all reviews for a product
router.get('/product/:productId', getProductReviews);

// Get all reviews by the authenticated user
router.get('/user', getUserReviews);

export default router; 