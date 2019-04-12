const { AuthenticationError, PubSub } = require('apollo-server');
const Pin = require('./models/Pin');

const pubsub = new PubSub();

/*
 * Constants
 * */
const PIN_ADDED = 'PIN_ADDED';
const PIN_UPDATED = 'PIN_UPDATED';
const PIN_DELETED = 'PIN_DELETED';

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx, info) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      try {
        const pins = await Pin.find({})
          .populate('author')
          .populate('comments.author');
        return pins;
      } catch (error) {
        console.error(error);
      }
    }
  },

  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      try {
        const newPin = await new Pin({
          ...args.input,
          author: ctx.currentUser._id
        }).save();
        const pinAdded = await Pin.populate(newPin, 'author');

        pubsub.publish(PIN_ADDED, { pinAdded });

        return pinAdded;
      } catch (error) {
        console.error(error);
      }
    }),

    deletePin: authenticated(async (root, args, ctx) => {
      try {
        const pinDeleted = await Pin.findOneAndDelete({
          _id: args.pinId
        }).exec();

        pubsub.publish(PIN_DELETED, { pinDeleted });

        return pinDeleted;
      } catch (error) {
        console.error(error);
      }
    }),

    createComment: authenticated(async (root, args, ctx) => {
      try {
        const newComment = { text: args.text, author: ctx.currentUser._id };
        const pinUpdated = await Pin.findOneAndUpdate(
          { _id: args.pinId },
          { $push: { comments: newComment } },
          { new: true }
        )
          .populate('author')
          .populate('comments.author');

        pubsub.publish(PIN_UPDATED, { pinUpdated });

        return pinUpdated;
      } catch (error) {
        console.error(error);
      }
    })
  },

  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    }
  }
};
