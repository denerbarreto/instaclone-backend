import { User } from "@prisma/client";
import client from "../../client";

interface SeeFollowersInput {
  username: string;
  page: number;
}

interface SeeFollowersOutput {
  ok: boolean;
  error?: string;
  followers?: User[];
  totalPages?: number;
}

export default {
  Query: {
    seeFollowers: async (
      _: any,
      { username, page }: SeeFollowersInput
    ): Promise<SeeFollowersOutput> => {
      const findUser = await client.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });
      if (!findUser) {
        return {
          ok: false,
          error: "User not found",
        };
      }

      const followers = await client.user
        .findUnique({
          where: {
            username,
          },
        })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: {
              username,
            },
          },
        },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
