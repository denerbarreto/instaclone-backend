import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../../users/users.utils";

const ResolverFn = async (
  _: any,
  { id }: { id: number },
  { loggedInUser }: Context
) => {
  const message = await client.message.findFirst({
    where: {
      id,
      userId: {
        not: loggedInUser?.id,
      },
      room: {
        users: {
          some: {
            id: loggedInUser?.id,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (!message) {
    return {
      ok: false,
      error: "Message not found.",
    };
  }
  await client.message.update({
    where: {
      id,
    },
    data: {
      read: true,
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    readMessaage: protectedResolver(ResolverFn),
  },
};
