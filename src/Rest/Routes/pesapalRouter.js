const express = require('express');
const axios = require('axios');
const router = express.Router();
const { bookingModel } = require('../../Models/bookingModel');
const { pesapalTransactionModel } = require('../../Models/pesapalTransactionModel');
const { getPesapalToken } = require('../../Shared/helpers/pesapal/pesapal');

// IPN notification endpoint — Pesapal POSTs here when payment status changes
router.post('/ipnurl', async (req, res) => {
    try {
        const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = req.body;

        if (!OrderTrackingId) {
            return res.status(400).json({ status: 400, message: 'Missing OrderTrackingId' });
        }

        const token = await getPesapalToken();

        // Verify the transaction status with Pesapal
        const statusUrl = `${process.env.PESAPAL_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`;
        const statusRes = await axios.get(statusUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { payment_status_description, amount, payment_method } = statusRes.data;

        // Update our pesapal transaction record
        const pesapalTx = await pesapalTransactionModel.findOneAndUpdate(
            { order_tracking_id: OrderTrackingId },
            {
                status: payment_status_description === 'Completed' ? 'completed' : 'failed',
                amount: amount || 0,
            },
            { new: true }
        );

        // If payment completed, mark the booking deposit as paid
        if (payment_status_description === 'Completed' && pesapalTx?.bookingId) {
            await bookingModel.findByIdAndUpdate(pesapalTx.bookingId, {
                depositPaid: true,
                depositPaidAt: new Date(),
                status: 'deposit-paid',
            });
        }

        res.json({ orderNotificationType: OrderNotificationType, orderTrackingId: OrderTrackingId, status: 200 });
    } catch (err) {
        console.error('Pesapal IPN error:', err.message);
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Redirect callback — user lands here after completing/cancelling payment on Pesapal
router.get('/callback', async (req, res) => {
    const { OrderTrackingId } = req.query;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    try {
        const booking = await bookingModel.findOne({ depositPesapalOrderId: OrderTrackingId });
        if (booking?.referenceCode) {
            return res.redirect(`${clientUrl}/booking/payment-complete?ref=${booking.referenceCode}`);
        }
    } catch (_) {}

    res.redirect(`${clientUrl}/booking/payment-complete`);
});

module.exports = router;
