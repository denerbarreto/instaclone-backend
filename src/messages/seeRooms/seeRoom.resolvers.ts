import { Context } from "./../../server";
import client from "../../client";
import { protectedResolver } from "./../../users/users.utils";

const ResolverFn = async (_: any, __: any, { loggedInUser }: Context) => {
  return client.room.findMany({
    where: {
      users: {
        some: {
          id: loggedInUser?.id,
        },
      },
    },
  });
};

export default {
  Query: {
    seeRooms: protectedResolver(ResolverFn),
  },
};
