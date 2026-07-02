const { GraphQLNonNull, GraphQLID, GraphQLString } = require("graphql");
const axios = require("axios");
const { pesapalRequestType } = require("../Types/pesapalRequestType");
const { pesapalCredentialsModel } = require("../../Models/pesapalCredentials");
const { pesapalTransactionModel } = require("../../Models/pesapalTransactionModel");
const { bookingModel } = require("../../Models/bookingModel");
const { getPesapalToken, checkIPnNURL } = require("../../Shared/helpers/pesapal/pesapal");

exports.pesapalBookingRequest = {
    type: pesapalRequestType,
    args: {
        bookingId: { type: new GraphQLNonNull(GraphQLID) },
        callback_url: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args) {
        const booking = await bookingModel.findById(args.bookingId).populate("serviceId");
        if (!booking) throw new Error("Booking not found");

        const amount = booking.depositAmount;
        if (!amount || amount <= 0) throw new Error("Invalid deposit amount");

        const token = await getPesapalToken();
        if (token) {
            checkIPnNURL(token).catch(() => {});
        }

        const credentials = await pesapalCredentialsModel.findOne();
        if (!credentials) throw new Error("Pesapal credentials not configured");

        const { nanoid } = await import("nanoid");
        const orderId = nanoid();

        const serviceName = booking.serviceId?.name || "Studio Mobia service";
        const orderData = {
            id: orderId,
            currency: "KES",
            amount: Number(amount.toFixed(2)),
            description: `Deposit for ${serviceName} booking`,
            redirect_mode: "",
            callback_url: args.callback_url,
            notification_id: credentials.ipnId,
            billing_address: {
                email_address: booking.clientEmail,
                phone_number: booking.clientPhone,
                country_code: "KE",
                first_name: booking.clientName.split(" ")[0],
                middle_name: "",
                last_name: booking.clientName.split(" ").slice(1).join(" ") || "",
                line_1: "Studio Mobia",
            },
        };

        const submitOrderUrl = process.env.PESAPAL_URL + "/Transactions/SubmitOrderRequest";
        const response = await axios.post(submitOrderUrl, orderData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.redirect_url) {
            throw new Error("Failed to get redirect URL from Pesapal");
        }

        await pesapalTransactionModel.create({
            order_tracking_id: response.data.order_tracking_id,
            merchant_reference_id: response.data.merchant_reference_id,
            bookingId: booking._id,
            amount,
        });

        // Store the order tracking id on the booking so IPN can look it up
        booking.depositPesapalOrderId = response.data.order_tracking_id;
        await booking.save();

        return {
            redirectUrl: response.data.redirect_url,
            orderTrackingId: response.data.order_tracking_id,
        };
    },
};
