import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
        index: true
    },
    image : {
        type : Array,
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category'
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory'
        }
    ],
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
        default : null
    },
    discount : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : "",
        index: true
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
},{
    timestamps : true
})

// Create text index with proper weights
productSchema.index(
    { name: "text", description: "text" },
    { 
        weights: {
            name: 10,
            description: 5
        },
        name: "product_text_index",
        default_language: "english"
    }
);

const ProductModel = mongoose.model('product', productSchema);

// Ensure indexes are created
ProductModel.createIndexes().then(() => {
    console.log('Indexes created successfully');
}).catch(err => {
    console.error('Error creating indexes:', err);
});

export default ProductModel