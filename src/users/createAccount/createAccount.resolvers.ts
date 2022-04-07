import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import client from "../../client";

interface CreateAccountInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface CreateAccountOutput {
  ok: boolean;
  error?: string;
  user?: User;
}

export default {
  Mutation: {
    createAccount: async (
      _: any,
      { firstName, lastName, username, email, password }: CreateAccountInput
    ): Promise<CreateAccountOutput> => {
      try {
        const findUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (findUser) {
          throw new Error();
        }
        const unglyPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: unglyPassword,
          },
        });
        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          error: "This username/email is already taken.",
        };
      }
    },
  },
};
