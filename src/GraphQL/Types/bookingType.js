const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLBoolean } = require('graphql');
const { serviceType } = require('./serviceType');
const { serviceModel } = require('../../Models/serviceModel');

exports.bookingType = new GraphQLObjectType({
    name: 'Booking',
    fields: () => ({
        id: { type: GraphQLID },
        clientName: { type: GraphQLString },
        clientEmail: { type: GraphQLString },
        clientPhone: { type: GraphQLString },
        date: { type: GraphQLString, resolve: p => p.date?.toISOString() },
        time: { type: GraphQLString },
        notes: { type: GraphQLString },
        status: { type: GraphQLString },
        totalPrice: { type: GraphQLFloat },
        depositAmount: { type: GraphQLFloat },
        depositPaid: { type: GraphQLBoolean },
        depositPaidAt: { type: GraphQLString, resolve: p => p.depositPaidAt?.toISOString() },
        location: { type: GraphQLString },
        referenceCode: { type: GraphQLString },
        createdAt: { type: GraphQLString, resolve: p => p.createdAt?.toISOString() },
        service: {
            type: serviceType,
            resolve: p => serviceModel.findById(p.serviceId),
        },
    }),
});
