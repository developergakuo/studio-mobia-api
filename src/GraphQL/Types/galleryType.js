const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt } = require('graphql');

exports.galleryType = new GraphQLObjectType({
    name: 'GalleryItem',
    fields: () => ({
        id: { type: GraphQLID },
        url: { type: GraphQLString },
        thumbnailUrl: { type: GraphQLString },
        caption: { type: GraphQLString },
        category: { type: GraphQLString },
        type: { type: GraphQLString },
        isPublished: { type: GraphQLBoolean },
        order: { type: GraphQLInt },
        createdAt: { type: GraphQLString, resolve: p => p.createdAt?.toISOString() },
    }),
});
