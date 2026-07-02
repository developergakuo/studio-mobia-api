const express = require('express');
const router = express.Router();
const { bookingModel } = require('../../Models/bookingModel');

// Pesapal IPN callback — called by Pesapal when payment status changes
router.get('/callback', async (req, res) => {
    try {
        const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = req.query;
        // TODO: verify payment status with Pesapal API and update booking
        // For now just acknowledge
        res.send('OK');
    } catch (err) {
        console.error('Pesapal callback error:', err);
        res.status(500).send('Error');
    }
});

// IPN registration endpoint
router.post('/ipn', async (req, res) => {
    try {
        const { OrderTrackingId, OrderMerchantReference } = req.body;
        const booking = await bookingModel.findOne({ depositPesapalOrderId: OrderTrackingId });
        if (booking) {
            booking.depositPaid = true;
            booking.depositPaidAt = new Date();
            booking.status = 'deposit-paid';
            await booking.save();
        }
        res.json({ status: 200 });
    } catch (err) {
        console.error('Pesapal IPN error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
