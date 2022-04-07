import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../users.utils";

interface followUserInput {
  username: string;
}

interface followUserOutput {
  ok: boolean;
  error?: string;
}

const resolverFn = async (
  _: any,
  { username }: followUserInput,
  { loggedInUser }: Context
): Promise<followUserOutput> => {
  const findUser = await client.user.findUnique({ where: { username } });
  if (!findUser) {
    return {
      ok: false,
      error: "That user does not exist.",
    };
  }
  await client.user.update({
    where: {
      id: loggedInUser?.id,
    },
    data: {
      following: {
        connect: {
          username,
        },
      },
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    followUser: protectedResolver(resolverFn),
  },
};
