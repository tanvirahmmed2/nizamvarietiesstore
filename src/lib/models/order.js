import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
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
        enum: ['dinein', 'takeout'],
        required: true
    },
    table: {
        type: String,
        trim:true
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
        enum: [ 'preparing', 'completed', 'cancelled'],
        default: 'preparing'
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true });

const Order = mongoose.models.orders || mongoose.model('orders', orderSchema);

export default Order;