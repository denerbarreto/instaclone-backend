import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../../users/users.utils";

const ResolverFn = async (
  _: any,
  { id }: { id: number },
  { loggedInUser }: Context
) => {
  const comment = await client.comment.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });
  if (!comment) {
    return {
      ok: false,
      error: "Comment not found.",
    };
  } else if (comment.userId !== loggedInUser?.id) {
    return {
      ok: false,
      error: "Not Authorized.",
    };
  } else {
    await client.comment.delete({
      where: {
        id,
      },
    });
  }
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    deleteComment: protectedResolver(ResolverFn),
  },
};
