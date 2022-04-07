import { Context } from "./../../server";
import { protectedResolver } from "../users.utils";
import client from "../../client";

interface UnfollowUserInput {
  username: string;
}

interface UnfollowUserOutput {
  ok: boolean;
  error?: string;
}

const resolverFn = async (
  _: any,
  { username }: UnfollowUserInput,
  { loggedInUser }: Context
): Promise<UnfollowUserOutput> => {
  const findUser = await client.user.findUnique({
    where: {
      username,
    },
  });
  if (!findUser) {
    return {
      ok: false,
      error: "Can't unfollow user.",
    };
  }
  await client.user.update({
    where: {
      id: loggedInUser?.id,
    },
    data: {
      following: {
        disconnect: {
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
    unfollowUser: protectedResolver(resolverFn),
  },
};
