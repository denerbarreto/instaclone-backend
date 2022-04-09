import { Context } from "./../../server";
import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

const ResolverFn = (_: any, __: any, { loggedInUser }: Context) => {
  return client.photo.findMany({
    where: {
      OR: [
        {
          user: {
            followers: {
              some: {
                id: loggedInUser?.id,
              },
            },
          },
        },
        {
          userId: loggedInUser?.id,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default {
  Query: {
    seeFeed: protectedResolver(ResolverFn),
  },
};
