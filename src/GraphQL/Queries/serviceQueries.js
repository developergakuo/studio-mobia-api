const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
const { serviceType } = require('../Types/serviceType');
const { serviceModel } = require('../../Models/serviceModel');

exports.services = {
    type: new GraphQLList(serviceType),
    args: { category: { type: GraphQLString } },
    async resolve(_, args) {
        const filter = { isActive: true };
        if (args.category) filter.category = args.category;
        return serviceModel.find(filter).sort({ order: 1, createdAt: -1 });
    },
};

exports.allServices = {
    type: new GraphQLList(serviceType),
    async resolve() {
        return serviceModel.find({}).sort({ order: 1, createdAt: -1 });
    },
};

exports.service = {
    type: serviceType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args) {
        return serviceModel.findById(args.id);
    },
};
