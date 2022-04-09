import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../../users/users.utils";

interface editCommentInput {
  id: number;
  payload: string;
}

const ResolverFn = async (
  _: any,
  { id, payload }: editCommentInput,
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
      error: "Not authorized.",
    };
  } else {
    await client.comment.update({
      where: {
        id,
      },
      data: {
        payload,
      },
    });
    return {
      ok: true,
    };
  }
};

export default {
  Mutation: {
    editComment: protectedResolver(ResolverFn),
  },
};
