const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
const { bookingType } = require('../Types/bookingType');
const { bookingModel } = require('../../Models/bookingModel');

exports.bookings = {
    type: new GraphQLList(bookingType),
    args: {
        status: { type: GraphQLString },
        serviceId: { type: GraphQLID },
    },
    async resolve(_, args) {
        const filter = {};
        if (args.status) filter.status = args.status;
        if (args.serviceId) filter.serviceId = args.serviceId;
        return bookingModel.find(filter).sort({ createdAt: -1 });
    },
};

exports.booking = {
    type: bookingType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args) {
        return bookingModel.findById(args.id);
    },
};

exports.bookingByRef = {
    type: bookingType,
    args: { referenceCode: { type: GraphQLString } },
    async resolve(_, args) {
        return bookingModel.findOne({ referenceCode: args.referenceCode });
    },
};
