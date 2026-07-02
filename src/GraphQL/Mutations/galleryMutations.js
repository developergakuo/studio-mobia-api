const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt } = require('graphql');
const { galleryType } = require('../Types/galleryType');
const { galleryModel } = require('../../Models/galleryModel');

exports.addGalleryItem = {
    type: galleryType,
    args: {
        url: { type: GraphQLString },
        thumbnailUrl: { type: GraphQLString },
        caption: { type: GraphQLString },
        category: { type: GraphQLString },
        type: { type: GraphQLString },
        order: { type: GraphQLInt },
        serviceId: { type: GraphQLID },
    },
    async resolve(_, args) {
        return galleryModel.create(args);
    },
};

exports.updateGalleryItem = {
    type: galleryType,
    args: {
        id: { type: GraphQLID },
        caption: { type: GraphQLString },
        category: { type: GraphQLString },
        isPublished: { type: GraphQLBoolean },
        order: { type: GraphQLInt },
    },
    async resolve(_, { id, ...rest }) {
        return galleryModel.findByIdAndUpdate(id, rest, { new: true });
    },
};

exports.deleteGalleryItem = {
    type: galleryType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args) {
        return galleryModel.findByIdAndDelete(args.id);
    },
};
