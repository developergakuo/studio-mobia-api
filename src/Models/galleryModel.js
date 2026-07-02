const { Schema, model } = require('mongoose');

const gallerySchema = new Schema({
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String, default: '' },
    category: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    serviceId: { type: Schema.Types.ObjectId, ref: 'service' },
}, { timestamps: true });

exports.galleryModel = model('gallery', gallerySchema);
