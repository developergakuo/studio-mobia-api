const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLInt, GraphQLList } = require('graphql');

exports.serviceType = new GraphQLObjectType({
    name: 'Service',
    fields: () => ({
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
        createdAt: { type: GraphQLString, resolve: p => p.createdAt?.toISOString() },
    }),
});
