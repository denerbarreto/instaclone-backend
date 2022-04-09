import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_: any, { id }: { id: number }) => {
      return client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    },
  },
};
