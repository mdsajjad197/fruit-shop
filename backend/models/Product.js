import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Product name is required'], trim: true },
        category: {
            type: String,
            enum: ['Seasonal', 'Imported', 'Organic'],
            required: [true, 'Category is required'],
        },
        price: { type: Number, required: [true, 'Price is required'], min: 0 },
        stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
        description: { type: String, required: [true, 'Description is required'] },
        images: [{ public_id: String, url: String }],
        ratings: [ratingSchema],
        unit: { type: String, default: 'kg' },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: average rating
productSchema.virtual('avgRating').get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    return +(sum / this.ratings.length).toFixed(1);
});

export default mongoose.model('Product', productSchema);
