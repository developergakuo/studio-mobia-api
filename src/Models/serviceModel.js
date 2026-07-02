const { Schema, model } = require('mongoose');

const SERVICE_CATEGORIES = [
    'photography',
    'video',
    'recording',
    'content-creation',
    'events',
    'product-photography',
    'real-estate',
    'drone',
];

const serviceSchema = new Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: SERVICE_CATEGORIES, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'KES' },
    duration: { type: String },
    depositPercentage: { type: Number, default: 30, min: 0, max: 100 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

exports.serviceModel = model('service', serviceSchema);
exports.SERVICE_CATEGORIES = SERVICE_CATEGORIES;
