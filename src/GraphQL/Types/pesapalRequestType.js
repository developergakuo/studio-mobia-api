const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require("graphql");

exports.pesapalRequestType = new GraphQLObjectType({
    name: "PesapalRequest",
    fields: () => ({
        redirectUrl: { type: GraphQLString },
        orderTrackingId: { type: GraphQLString },
    }),
});
