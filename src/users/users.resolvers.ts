import { Context } from "./../server";
import client from "../client";

interface UserInput {
  id: number;
}

export default {
  User: {
    totalFollowing: async ({ id }: UserInput): Promise<number> => {
      return client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      });
    },

    totalFollowers: async ({ id }: UserInput): Promise<number> => {
      return client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      });
    },

    myProfile: (
      { id }: UserInput,
      _: any,
      { loggedInUser }: Context
    ): boolean => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },

    isFollowing: async (
      { id }: UserInput,
      _: any,
      { loggedInUser }: Context
    ): Promise<boolean> => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });

      return Boolean(exists);
    },

    photos: ({ id }: { id: number }) => {
      return client.user
        .findUnique({
          where: {
            id,
          },
        })
        .photos();
    },
  },
};
