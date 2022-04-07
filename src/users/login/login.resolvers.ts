import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import client from "../../client";

interface Logininput {
  username: string;
  password: string;
}

interface LoginOutput {
  ok: boolean;
  error?: string;
  token?: string;
}

export default {
  Mutation: {
    login: async (
      _: any,
      { username, password }: Logininput
    ): Promise<LoginOutput> => {
      const user = await client.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: "User not found.",
        };
      }
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return {
          ok: false,
          error: "Incorrect password.",
        };
      }
      const token = jwt.sign({ id: user.id }, `${process.env.SECRECT_KEY}`);
      return {
        ok: true,
        token,
      };
    },
  },
};
