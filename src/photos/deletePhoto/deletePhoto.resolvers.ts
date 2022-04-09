import client from "../../client";
import { Context } from "./../../server";
import { protectedResolver } from "./../../users/users.utils";

const ResolverFn = async (
  _: any,
  { id }: { id: number },
  { loggedInUser }: Context
) => {
  const photo = await client.photo.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });
  if (!photo) {
    return {
      ok: false,
      error: "Photo not found.",
    };
  } else if (photo.userId !== loggedInUser?.id) {
    return {
      ok: false,
      error: "Not authorized.",
    };
  } else {
    await client.photo.delete({
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
    deletePhoto: protectedResolver(ResolverFn),
  },
};
