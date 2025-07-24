import WishlistModel from '../models/wishlist.model.js';
import ProductModel from '../models/product.model.js';

export const addToWishlist = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        // Get product details
        const product = await ProductModel.findById(productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Check if already in wishlist
        const existingWishlist = await WishlistModel.findOne({
            userId,
            productId
        });

        if (existingWishlist) {
            return response.status(400).json({
                message: "Product already in wishlist",
                error: true,
                success: false
            });
        }

        // Add to wishlist
        const wishlistItem = await WishlistModel.create({
            userId,
            productId,
            product_details: {
                name: product.name,
                image: product.image,
                price: product.price,
                discount: product.discount,
                unit: product.unit
            }
        });

        return response.json({
            message: "Product added to wishlist",
            data: wishlistItem,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error adding to wishlist",
            error: true,
            success: false
        });
    }
};

export const removeFromWishlist = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        const deletedItem = await WishlistModel.findOneAndDelete({
            userId,
            productId
        });

        if (!deletedItem) {
            return response.status(404).json({
                message: "Product not found in wishlist",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Product removed from wishlist",
            data: deletedItem,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error removing from wishlist",
            error: true,
            success: false
        });
    }
};

export const getWishlist = async (request, response) => {
    try {
        const userId = request.userId;

        const wishlistItems = await WishlistModel.find({ userId })
            .sort({ createdAt: -1 });

        return response.json({
            message: "Wishlist items",
            data: wishlistItems,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Error fetching wishlist",
            error: true,
            success: false
        });
    }
}; 