import { Context } from "./../server";
import client from "../client";

export default {
  Room: {
    users: ({ id }: { id: number }) => {
      return client.room
        .findUnique({
          where: {
            id,
          },
        })
        .users();
    },
    messages: ({ id }: { id: number }) => {
      return client.message.findMany({
        where: {
          roomId: id,
        },
      });
    },
    unreadTotal: (
      { id }: { id: number },
      _: any,
      { loggedInUser }: Context
    ) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser?.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }: { id: number }) => {
      return client.message
        .findUnique({
          where: { id },
        })
        .user();
    },
  },
};
