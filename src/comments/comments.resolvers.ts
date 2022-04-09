import { Context } from "./../server";
export default {
  Comment: {
    isMine: (
      { userId }: { userId: number },
      _: any,
      { loggedInUser }: Context
    ) => userId === loggedInUser?.id,
  },
};
