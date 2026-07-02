const { GraphQLList, GraphQLString, GraphQLBoolean } = require('graphql');
const { galleryType } = require('../Types/galleryType');
const { galleryModel } = require('../../Models/galleryModel');

exports.gallery = {
    type: new GraphQLList(galleryType),
    args: {
        category: { type: GraphQLString },
        type: { type: GraphQLString },
        includeUnpublished: { type: GraphQLBoolean },
    },
    async resolve(_, args) {
        const filter = {};
        if (!args.includeUnpublished) filter.isPublished = true;
        if (args.category) filter.category = args.category;
        if (args.type) filter.type = args.type;
        return galleryModel.find(filter).sort({ order: 1, createdAt: -1 });
    },
};
