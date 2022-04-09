import client from "../../client";

export default {
  Query: {
    seeHashtag: (_: any, { hashtag }: { hashtag: string }) => {
      return client.hashtag.findUnique({
        where: {
          hashtag,
        },
      });
    },
  },
};
