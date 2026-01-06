import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: 'customer',
    },
    phone: {
        type: String,
        trim: true,
        default: '+880-1'
    },
    orderId: {
        type:Number,
        trim: true,
        required: true,
        unique: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            title: String,
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],

    delivery: {
        type: String,
        enum: ['homedelivery', 'pickup'],
        required: true
    },

    subTotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        default: 'cash'
    },

    status: {
        type: String,
        enum: ['confirmed', 'delivered', 'cancelled'],
        default: 'confirmed'
    },
    address:{
        type:String,
        trim:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.orders || mongoose.model('orders', orderSchema);

export default Order;