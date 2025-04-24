// server/models/Voucher.js
const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Voucher name is required'],
        trim: true,
    },
    code: {
        type: String,
        required: [true, 'Voucher code is required'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Discount type is required'],
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date',
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicableRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Applicable rooms are required'],
    }],
    image: {
        type: String,
        default: "http://res.cloudinary.com/dkhutgvlb/image/upload/v1739795711/xwfbzfrvi09g0h3sxwfs.jpg",
    },

}, { timestamps: true });

// Index để tìm kiếm code nhanh
voucherSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Voucher2', voucherSchema);