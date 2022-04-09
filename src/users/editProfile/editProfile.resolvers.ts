import { protectedResolver } from "./../users.utils";
import { Context } from "./../../server";
import { ReadStream } from "fs-capacitor";
import { createWriteStream } from "fs";
import client from "../../client";
import * as bcrypt from "bcrypt";

interface EditProfileInput {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  token: string;
  bio?: string;
  avatar?: any;
}

interface EditProfileOutput {
  ok: boolean;
  error?: string;
}

interface AvatarPayload {
  file: {
    filename: string;
    createReadStream(): ReadStream;
  };
}

const resolverFn = async (
  _: any,
  {
    username,
    password,
    firstName,
    lastName,
    email,
    bio,
    avatar,
  }: EditProfileInput,
  { loggedInUser }: Context
): Promise<EditProfileOutput> => {
  const {
    file: { filename, createReadStream },
  }: AvatarPayload = await avatar;
  let avatarUrl = null;
  if (avatar) {
    const newFilename = `${loggedInUser?.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }

  let uglyPassword = null;
  if (password) {
    uglyPassword = await bcrypt.hash(password, 10);
  }
  const updatedUser = await client.user.update({
    where: { id: loggedInUser?.id },
    data: {
      username,
      firstName,
      lastName,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
