const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
    serviceId: { type: Schema.Types.ObjectId, ref: 'service', required: true },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, trim: true, lowercase: true },
    clientPhone: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'deposit-paid', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    totalPrice: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    depositPaid: { type: Boolean, default: false },
    depositPesapalOrderId: { type: String },
    depositPaidAt: { type: Date },
    location: { type: String },
    referenceCode: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// Auto-generate a short reference code before save
bookingSchema.pre('save', function (next) {
    if (!this.referenceCode) {
        this.referenceCode = 'BK-' + Date.now().toString(36).toUpperCase();
    }
    next();
});

exports.bookingModel = model('booking', bookingSchema);
