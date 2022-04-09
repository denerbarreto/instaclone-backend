import { gql } from "apollo-server";
export default gql`
  type Mutation {
    readMessaage(id: Int!): MutationOutput!
  }
`;
