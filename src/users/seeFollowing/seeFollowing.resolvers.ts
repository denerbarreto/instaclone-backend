import { User } from "@prisma/client";
import client from "../../client";

interface SeeFollowingsInput {
  username: string;
  lastId: number;
}

interface SeeFollowingOutput {
  ok: boolean;
  error?: string;
  following?: User[];
}

export default {
  Query: {
    seeFollowing: async (
      _: any,
      { username, lastId }: SeeFollowingsInput
    ): Promise<SeeFollowingOutput> => {
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
      const following = await client.user
        .findUnique({
          where: {
            username,
          },
        })
        .following({
          take: 5,
          skip: 1,
          ...(lastId && { cursor: { id: lastId } }),
        });
      return {
        ok: true,
        following,
      };
    },
  },
};
