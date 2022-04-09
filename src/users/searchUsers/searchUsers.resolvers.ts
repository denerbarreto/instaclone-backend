import client from "../../client";

interface searchUsersInput {
  keyword: string;
}

export default {
  Query: {
    searchUsers: async (_: any, { keyword }: searchUsersInput) => {
      return client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });
    },
  },
};
