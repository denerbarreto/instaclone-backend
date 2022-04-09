import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../../users/users.utils";

const ResolverFn = (
  _: any,
  { id }: { id: number },
  { loggedInUser }: Context
) => {
  return client.room.findFirst({
    where: {
      id,
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
    seeRoom: protectedResolver(ResolverFn),
  },
};
