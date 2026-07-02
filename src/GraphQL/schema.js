const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { services, allServices, service } = require('./Queries/serviceQueries');
const { bookings, booking, bookingByRef } = require('./Queries/bookingQueries');
const { gallery } = require('./Queries/galleryQueries');

const { createService, updateService, deleteService } = require('./Mutations/serviceMutations');
const { createBooking, updateBookingStatus, cancelBooking } = require('./Mutations/bookingMutations');
const { addGalleryItem, updateGalleryItem, deleteGalleryItem } = require('./Mutations/galleryMutations');

const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        services,
        allServices,
        service,
        bookings,
        booking,
        bookingByRef,
        gallery,
    },
});

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createService,
        updateService,
        deleteService,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
    },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
