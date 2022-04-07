import client from "../../client";

interface SeeProfileInput {
  username: string;
}

export default {
  Query: {
    seeProfile: (_: any, { username }: SeeProfileInput) => {
      return client.user.findUnique({
        where: {
          username,
        },
        include: {
          following: true,
          followers: true,
        },
      });
    },
  },
};
