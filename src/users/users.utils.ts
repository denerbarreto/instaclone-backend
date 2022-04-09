import * as jwt from "jsonwebtoken";
import client from "../client";

interface JwtPayload {
  id: number;
}

export const getUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = jwt.verify(token, `${process.env.SECRE_KEY}`) as JwtPayload;
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const protectedResolver =
  (ourResolver: any) => (root: any, args: any, context: any, info: any) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
