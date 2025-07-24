import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
        required: true
    },
    product_details: {
        name: String,
        image: Array,
        price: Number,
        discount: Number,
        unit: String
    }
}, {
    timestamps: true
});

// Add compound index to prevent duplicate entries
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const WishlistModel = mongoose.model('wishlist', wishlistSchema);

export default WishlistModel; 