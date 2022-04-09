import { processHashtags } from "./../photos.utils";
import { Context } from "./../../server";
import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

interface EditPhotoInput {
  id: number;
  caption: string;
}

const ResolverFn = async (
  _: any,
  { id, caption }: EditPhotoInput,
  { loggedInUser }: Context
) => {
  const photo = await client.photo.findFirst({
    where: {
      id,
      userId: loggedInUser?.id,
    },
    include: {
      hashtags: {
        select: {
          hashtag: true,
        },
      },
    },
  });

  if (!photo) {
    return {
      ok: false,
      error: "Photo not found.",
    };
  }
  await client.photo.update({
    where: {
      id,
    },
    data: {
      caption,
      hashtags: {
        disconnect: photo.hashtags,
        connectOrCreate: processHashtags(caption),
      },
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    editPhoto: protectedResolver(ResolverFn),
  },
};
