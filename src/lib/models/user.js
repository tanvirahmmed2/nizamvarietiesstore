import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: [true, 'User with this email already exists']
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        required: true,
        enum: {
            values: ['user', 'manager', 'sales'],
            message: '{VALUE} is not supporetd'
        }
    },
    cart: [
        {
            title: { type: String, trim: true, required: true },
            productId: { type: String, trim: true, required: true },
            quantity: { type: Number, trim: true, default: 1 },
            price: { type: Number, trim: true, required: true }

        }

    ],
    isBanned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User