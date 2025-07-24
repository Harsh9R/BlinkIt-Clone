import { Review } from '../models/review.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new review
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
        throw new ApiError(400, "Product ID and rating are required");
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
        user: req.user._id,
        product: productId
    });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    // Create new review
    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment
    });

    return res.status(201).json(
        new ApiResponse(201, review, "Review created successfully")
    );
});

// Update a review
export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if the review belongs to the authenticated user
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own reviews");
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    return res.json(
        new ApiResponse(200, review, "Review updated successfully")
    );
});

// Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if the review belongs to the authenticated user
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own reviews");
    }

    await review.deleteOne();

    return res.json(
        new ApiResponse(200, {}, "Review deleted successfully")
    );
});

// Get all reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
        .populate('user', 'name avatar')
        .sort('-createdAt');

    return res.json(
        new ApiResponse(200, reviews, "Product reviews fetched successfully")
    );
});

// Get all reviews by the authenticated user
export const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('product', 'name images')
        .sort('-createdAt');

    return res.json(
        new ApiResponse(200, reviews, "User reviews fetched successfully")
    );
}); 