const { Schema, model } = require("mongoose");

const pesapalTransactionSchema = new Schema({
    order_tracking_id: String,
    merchant_reference_id: String,
    bookingId: { type: Schema.Types.ObjectId, ref: "booking" },
    amount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "failed", "completed"],
        default: "pending",
    },
});

exports.pesapalTransactionModel = model("pesapalTransaction", pesapalTransactionSchema);
