const { GraphQLID, GraphQLString, GraphQLFloat } = require('graphql');
const { bookingType } = require('../Types/bookingType');
const { bookingModel } = require('../../Models/bookingModel');
const { serviceModel } = require('../../Models/serviceModel');

exports.createBooking = {
    type: bookingType,
    args: {
        serviceId: { type: GraphQLID },
        clientName: { type: GraphQLString },
        clientEmail: { type: GraphQLString },
        clientPhone: { type: GraphQLString },
        date: { type: GraphQLString },
        time: { type: GraphQLString },
        notes: { type: GraphQLString },
        location: { type: GraphQLString },
    },
    async resolve(_, args) {
        const service = await serviceModel.findById(args.serviceId);
        if (!service) throw new Error('Service not found');

        const depositAmount = Math.round(service.price * (service.depositPercentage / 100));

        return bookingModel.create({
            ...args,
            date: new Date(args.date),
            totalPrice: service.price,
            depositAmount,
            status: 'pending',
        });
    },
};

exports.updateBookingStatus = {
    type: bookingType,
    args: {
        id: { type: GraphQLID },
        status: { type: GraphQLString },
    },
    async resolve(_, args) {
        return bookingModel.findByIdAndUpdate(args.id, { status: args.status }, { new: true });
    },
};

exports.cancelBooking = {
    type: bookingType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args) {
        return bookingModel.findByIdAndUpdate(args.id, { status: 'cancelled' }, { new: true });
    },
};
