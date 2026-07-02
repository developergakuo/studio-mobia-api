const { GraphQLID, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLInt, GraphQLList } = require('graphql');
const { serviceType } = require('../Types/serviceType');
const { serviceModel } = require('../../Models/serviceModel');

exports.createService = {
    type: serviceType,
    args: {
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        currency: { type: GraphQLString },
        duration: { type: GraphQLString },
        depositPercentage: { type: GraphQLFloat },
        images: { type: new GraphQLList(GraphQLString) },
        order: { type: GraphQLInt },
    },
    async resolve(_, args) {
        return serviceModel.create(args);
    },
};

exports.updateService = {
    type: serviceType,
    args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        currency: { type: GraphQLString },
        duration: { type: GraphQLString },
        depositPercentage: { type: GraphQLFloat },
        images: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
        order: { type: GraphQLInt },
    },
    async resolve(_, { id, ...rest }) {
        return serviceModel.findByIdAndUpdate(id, rest, { new: true });
    },
};

exports.deleteService = {
    type: serviceType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args) {
        return serviceModel.findByIdAndDelete(args.id);
    },
};
