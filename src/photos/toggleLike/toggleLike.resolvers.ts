import { Context } from "../../server";
import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

const ResolverFn = async (
  _: any,
  { id }: { id: number },
  { loggedInUser }: Context
) => {
  const photo = await client.photo.findUnique({
    where: {
      id,
    },
  });
  if (!photo) {
    return {
      ok: false,
      error: "Photo not found",
    };
  }
  if (loggedInUser) {
    const like = await client.like.findUnique({
      where: {
        photoId_userId: {
          userId: loggedInUser?.id,
          photoId: id,
        },
      },
    });

    if (like) {
      await client.like.delete({
        where: {
          photoId_userId: {
            userId: loggedInUser?.id,
            photoId: id,
          },
        },
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id: photo.id,
            },
          },
        },
      });
      return {
        ok: true,
      };
    }
  }
  return {
    ok: false,
  };
};

export default {
  Mutation: {
    toggleLike: protectedResolver(ResolverFn),
  },
};
