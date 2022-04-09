import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../../users/users.utils";

interface CreateCommentInput {
  photoId: number;
  payload: string;
}

const ResolverFn = async (
  _: any,
  { photoId, payload }: CreateCommentInput,
  { loggedInUser }: Context
) => {
  const ok = await client.photo.findUnique({
    where: {
      id: photoId,
    },
    select: {
      id: true,
    },
  });
  if (ok) {
    return {
      ok: false,
      error: "Photo not found.",
    };
  }
  await client.comment.create({
    data: {
      payload,
      photo: {
        connect: {
          id: photoId,
        },
      },
      user: {
        connect: {
          id: loggedInUser?.id,
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
    createComment: protectedResolver(ResolverFn),
  },
};
