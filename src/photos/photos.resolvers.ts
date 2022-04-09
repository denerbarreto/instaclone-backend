import { Context } from "./../server";
import client from "../client";

export default {
  Photo: {
    user: ({ userId }: { userId: number }) => {
      return client.user.findUnique({
        where: {
          id: userId,
        },
      });
    },
    hashtags: ({ id }: { id: number }) => {
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      });
    },
    likes: ({ id }: { id: number }) => {
      client.like.count({ where: { photoId: id } });
    },
    comments: ({ id }: { id: number }) => {
      client.comment.findMany({
        where: {
          photoId: id,
        },
        include: {
          user: true,
        },
      });
    },
    isMine: (
      { userId }: { userId: number },
      _: any,
      { loggedInUser }: Context
    ) => userId === loggedInUser?.id,
  },
  Hashtag: {
    photos: ({ id }: { id: number }) => {
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos();
    },

    totalPhotos: ({ id }: { id: number }) => {
      return client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      });
    },
  },
};
