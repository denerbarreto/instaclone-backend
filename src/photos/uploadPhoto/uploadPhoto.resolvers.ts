import { processHashtags } from "./../photos.utils";
import { Context } from "./../../server";
import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

interface UploadPhotoInput {
  file: string;
  caption: string;
}

const ResolverFn = async (
  _: any,
  { file, caption }: UploadPhotoInput,
  { loggedInUser }: Context
) => {
  let hashtagObj: any = [];
  if (caption) {
    hashtagObj = processHashtags(caption);
  }
  client.photo.create({
    data: {
      file,
      caption,
      user: {
        connect: {
          id: loggedInUser?.id,
        },
      },
      ...(hashtagObj.length > 0 && {
        hashtags: {
          connectOrCreate: hashtagObj,
        },
      }),
    },
  });
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(ResolverFn),
  },
};
