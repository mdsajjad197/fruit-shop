import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'kg' },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        address: {
            label: String,
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            phone: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'UPI'],
            required: [true, 'Payment method is required'],
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Pending',
        },
        orderStatus: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        statusHistory: [
            {
                status: String,
                updatedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Auto-push to statusHistory on status change
orderSchema.pre('save', function (next) {
    if (this.isModified('orderStatus')) {
        this.statusHistory.push({ status: this.orderStatus });
    }
    next();
});

export default mongoose.model('Order', orderSchema);
