import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (result.length > 0) {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                averageRating: Math.round(result[0].averageRating * 10) / 10,
                numReviews: result[0].numReviews
            });
        } else {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                averageRating: 0,
                numReviews: 0
            });
        }
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
};

// Middleware to update product rating after review changes
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('deleteOne', { document: true }, function() {
    this.constructor.calculateAverageRating(this.product);
});

export const Review = mongoose.model('Review', reviewSchema);