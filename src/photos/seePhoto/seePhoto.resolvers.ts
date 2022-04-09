import client from "../../client";

export default {
  Query: {
    seePhoto: (_: any, { id }: { id: number }) => {
      client.photo.findUnique({
        where: {
          id,
        },
      });
    },
  },
};
